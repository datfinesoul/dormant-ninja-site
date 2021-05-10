---
author: Phil Hadviger
author_title: Principal Site Reliability Engineer @ GLG
author_url: https://github.com/datfinesoul
author_image_url: https://s.gravatar.com/avatar/fbd101f7b02677e16044db00640c727f?s=80
draft: false
hide_table_of_contents: false

slug: terraform-workspace-layout
title: Example Terraform Repo and Workspace Layout
tags: [hashicorp, terraform, infrastructure, workspace, layout, sumo logic]
description: How I structure most of my Terraform Workspaces.

---

## Infrastructure Breakdown

I prefer using a monorepo approach for my Terraform configuration, based on a primary provider.  So take this example folder structure, where I work with Sumo Logic and AWS

```bash
tooling ->   /.dev
provider ->  /aws 
account ->     /management-account
purpose ->       /core
purpose ->       /cloudtrail
                   /modules
component ->         /aws-trail
component ->         /sumologic-source
account ->     /dormant-ninja-prod
purpose ->       /core
purpose ->       /tokyo
                 /outsourced
tooling ->         /.dev
purpose ->         /project-x
purpose ->         /project-y
provider ->  /sumologic
account ->     /dormant-ninja
purpose ->       /jp
```

So everything is broken up into 6 types: tooling, provider, account, purpose, component and one that is not listed, which is a reusable independently versioned module.

### Where is the actual workspace?

Depending on how deep you want to nest things, workspaces would start at any purpose level.  Some examples based on the above would be:

- aws-management-account-core
- aws-dormant-ninja-prod-tokyo
- aws-dormant-ninja-prod-outsourced-project-x

### Tooling

This type of folder contains scripts and resources, that are ultimately used by all sub-folders.  So for example, the `/.dev` folder could contain a script that can setup a default Terraform Cloud workspace for any folder in the repo, or perform any shared maintenance of config files.

The `/aws/dormant-ninja-prod/outsourced/.dev` folder would contains helpers and script to manage outsourced projects.

### Provider

This would be a breakdown of the primary providers.  What I mean by *primary* becomes more obvious when I talk more about components, but at a high level it's based on the provider I'll be using the most for the infrastructure in that folder. (eg. AWS, Sumo Logic, etc.)

### Account

An individual account for the provider.  In the case where there is just one account, I still use something like `main`, `prod` or `dev` because in most cases there is still some kind of breakdown like this.

### Purpose

This isn't a single level type setup.  Purpose can be simple or complex and deeply nested.  In regards to the example above it could be the following

#### `/aws/management-account/cloudtrail`

The purpose here is setting up an organization AWS CloudTrail, which has the logs picked up by Sumo Logic.

#### `/aws/dormant-ninja-prod/outsourced/project-x`

This would be all the infrastructure required to get project-x running.

### Component

This might leave you wondering, if `/aws/management-account/cloudtrail` would then have some related folder in `/sumologic/` since it's multi-provider.  I'll go over that in the next section.

