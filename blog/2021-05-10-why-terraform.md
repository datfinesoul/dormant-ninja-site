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

## What it offers me.

### Confidence via dependency management and versioning.

Because Terraform is declarative in nature, the configuration files (`.tf` files) can be split up in any you choose inside the workspace.