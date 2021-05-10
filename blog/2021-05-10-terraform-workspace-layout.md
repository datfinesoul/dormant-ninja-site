---
author: Phil Hadviger
author_title: Principal Site Reliability Engineer @ GLG
author_url: https://github.com/datfinesoul
author_image_url: https://s.gravatar.com/avatar/fbd101f7b02677e16044db00640c727f?s=80
draft: false
hide_table_of_contents: false

slug: terraform-workspace-layout-1
title: Terraform Repo and Workspace Layout Part 1
tags: [hashicorp, terraform, infrastructure, workspace, layout, sumo logic]
description: Example of how to structure a Terraform monorepo, with a detailed explanation of the layout

---

## Infrastructure Breakdown

I prefer using a monorepo approach for my Terraform configuration, based on a primary provider.  So take this example folder structure, where I work with Sumo Logic and AWS and then read more below on how all this works out in practice.

```bash
security ->   CODEOWNERS
tooling ->    /.dev
provider ->   /aws 
account ->      /management-account
purpose ->        /core
purpose ->        /cloudtrail
                    /modules
component ->          /aws-trail
component ->          /sumologic-source
account ->      /dormant-ninja-prod
purpose ->        /core
purpose ->        /tokyo
                  /outsourced
tooling ->          /.dev
purpose ->          /project-x
purpose ->          /project-y
provider ->   /sumologic
account ->      /dormant-ninja
purpose ->        /jp
```

<!--truncate-->

So everything is broken up into 6 types: tooling, provider, account, purpose, component and security.

I intentionally left reusable independently versioned modules out of the list, and I'll talk about that more at a later point.

### Where is the actual workspace?

Depending on how deep you want to nest things, workspaces would start at any purpose level.  Some examples based on the above would be:

- aws-management-account-core
- aws-dormant-ninja-prod-tokyo
- aws-dormant-ninja-prod-outsourced-project-x

### Tooling

This type of folder contains scripts and resources, that are ultimately used by all sub-folders.  So for example, the `/.dev` folder could contain a script that can setup a default Terraform Cloud workspace for any folder in the repo, or perform any shared maintenance of config files.

The `/aws/dormant-ninja-prod/outsourced/.dev` folder would contains helpers and script to manage outsourced projects.

### Provider

This would be a breakdown of the primary providers.  What I mean by *primary* becomes more obvious when I talk more about components, but at a high level it's based on the provider I'll be using the most for the infrastructure in that folder. (eg. AWS, Sumo Logic, etc.)

### Account

An individual account for the provider.  In the case where there is just one account, I still use something like `main`, `prod` or `dev` because in most cases there is still some kind of breakdown like this.

### Purpose (aka Workspace)

This isn't a single level type setup.  Purpose can be simple, or complex and deeply nested.  In regards to the example above it could be the following

#### `/aws/management-account/cloudtrail`

The purpose here is setting up an organization AWS CloudTrail, which has the logs picked up by Sumo Logic.

#### `/aws/dormant-ninja-prod/outsourced/project-x`

This would be all the infrastructure required to get project-x running.

The full path separated by dashes instead of slashes would translate into the workspace name.  In most cases, all of the `.tf` files would live in this directory.

### Component (./modules/*)

Components are really modules, but in this case, modules that are really just smaller parts of the overall purpose.  Not every workspace will have a need for these.  Some of these components can eventually become modules that are in their own repository, with their own versioning.  (Like the [Cloud Posse](https://github.com/cloudposse?q=terraform-&type=&language=&sort=) Terraform modules for example)

This is also the place, where I end up using sub-providers.  In the example of `/aws/management-account
purpose/cloudtrail` for example, most of the components are **AWS**, just as the `/aws` starting prefix indicates, but the `/modules/sumologic-source` for example is using the **Sumo Logic** provider as well.

Based on my layout of directories, it might seem like it would make more sense to have all Sumo Logic related items live under `/sumologic`, but in this particular case the coupling is just too tight, to not have it live in the same workspace.

### Security

In my organization, the CODEOWNERS file in combination with access to [Terraform Cloud](https://www.terraform.io/cloud) is how I control who has the power to make changes.  I'll discuss this setup in detail at a later point as well, and there are a variety of options available on how to go about it.

## The Monorepo

The core reason for the monorepo setup in my particular case is, that it gives me a single source of truth about the infrastructure of an organization.

It's easy to search for what is deployed, who deployed it, and often even see the reason for the deployment, by having access to GitHub's Issues, Wiki, Projects and Pull Requests all in one place.

## Related Articles/Posts

- Terraform Repo and Workspace Layout Part 2 (coming soon)

  This will focus on what some of the Terraform files in each of the directories would look like, and give examples of helper scripts.

- Terraform Repo and Workspace Layout Part 3 (coming soon)

  Focused around state in the cloud, how to plan and apply, and basic team/security setup