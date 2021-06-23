---
author: Phil Hadviger
author_title: Principal Site Reliability Engineer @ GLG
author_url: https://github.com/datfinesoul
author_image_url: https://s.gravatar.com/avatar/fbd101f7b02677e16044db00640c727f?s=80
draft: true
hide_table_of_contents: false

slug: why-terraform
title: Why I choose Terraform over CloudFormation
tags: [aws, hashicorp, terraform, cloudformation, infrastructure, azure blueprints, github]
description: Why choosing Terraform over other solutions like CloudFormation works better for me.
---

## Why Terraform?

When reading about Terraform on reddit, or talking with people about it during meetups, I frequently see the use of Terraform criticized by users that are already using CloudFormation, Azure Blueprints and the like.

> - CloudFormation is native to AWS, so it's closer to the source and better supported.
>
> - Why add yet another tool, when Azure already offers Blueprints?
> - GitHub has a great API that is well documented, there is really no reason to switch.
> - The multi provider stuff is total overkill, and adds complexity when it isn't needed.

None of that is wrong by any means, and the point of this post isn't really a fight to the death trying to prove my use of Terraform is better than the alternative approaches.  I do believe though that after working on infrastructure quite a bit during my time being a developer, it offers the tooling and support to prove extremely powerful, adaptable and clear in it's approach to managing infrastructure.

<!--truncate-->

## What it offers me.

### Confidence via dependency management and versioning.

Because Terraform is declarative in nature, the configuration files (`.tf` files) can be split up in any you choose inside the workspace.

### Terraform Pros

- Existing infrastructure can be imported/adapted
- Great you want to manage infrastructure on multiple providers
- Support for infrastructure modules offering easier repeatability
- Dry runs via plans
- State management is left to the user
- HCL is very readable
- The providers seems updated very frequently and are sometimes even ahead of native providers like cloudformation, etc.
- Great community support

### Terraform Cons

- State management is left to the user, and needs to be guarded
- Supports HCL and JSON, but no conversion tools between the two.
- Rollbacks can only be accomplished via a version control system, and are not part of the deployment/upgrade process
- The platform hasn't reached 1.0 yet
- Terraform itself, doesn't have any user/team management built in, so either Terraform Cloud or another comparable platform would have to be used.