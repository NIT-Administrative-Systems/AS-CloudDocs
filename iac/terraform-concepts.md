# Terraform
Infrastructure as Code (IaC) is a way to define what resources & configuration you need to run an application. These declarations can then be stored in git. This approach eliminates the potential for human error when setting up multiple servers & configuration drift between environments.

[Terraform](https://www.terraform.io/) is the vendor-agnostic IaC tool that Administrative Systems uses. When you write your IaC, terraform will determine which service providers you need and will automatically download the appropriate [provider drivers](https://www.terraform.io/docs/providers/index.html). 

For the most part, AS developers will only need to be concerned with the [AWS provider](https://www.terraform.io/docs/providers/aws/index.html). But if the need arises, you can use terraform to build infrastructure for one app across several cloud vendors.

:::danger Terraform v0.10
At this time, Terraform v0.10 is installed on all Jenkins servers.

When reviewing Terraform documentation, verify the docs are for v0.11 and before; v0.12 made significant changes to the syntax.

If you are testing locally, you can use [tfenv](https://github.com/tfutils/tfenv) to swap between versions.
:::

## Concepts
A simple terraform module is made up of three parts: provider blocks, a backend, and the infrastructure resources you want.

```hcl
# Provider Block
# --------------

# Declares that we need the AWS provider and sets a default region.
# The version argument tells TF that it should use any stable v2.27.x provider.
provider "aws" {
  region = "us-east-2"
  version = "~> 2.27"
}

# Backend Block
# -------------

# This block tells Terraform that it should remember what
# resources it has created using a file in an S3 bucket.
terraform {
  backend "s3" {
    bucket = "accountName-nonprod-build-tfstate"
    key    = "accountName-shared-resources/nonprod/terraform.tfstate"
    region = "us-east-2"
  }
}

# Resource Blocks
# ---------------

# Creates a Simple Notification Service topic
resource "aws_sns_topic" "opsgenie_alert_topic" {
  name = "OpsGenie-SomeTeam"
}

# Adds OpsGenie's alert API as a subscriber to that topic,
# using the Amazon Resource Name (ARN) that the previous resource
# output.
resource "aws_sns_topic_subscription" "opsgenie_integration" {
  topic_arn              = "${aws_sns_topic.opsgenie_alert_topic.arn}"
  protocol               = "https"
  endpoint               = "https://api.opsgenie.com/alert/SomeTeam?apiKey=MyVeryCoolSecret"
  endpoint_auto_confirms = true
}
```

Terraform will automatically determine that it needs to create the topic before it can create the subscription, since the subscription is using an *attribute* (the ARN) from the topic resource.

Every resource is different. The terraform AWS provider documentation will explain what arguments (inputs) & attributes (outputs) are available. For example, the [`aws_sns_topic`](https://www.terraform.io/docs/providers/aws/r/sns_topic.html) documentation tells us that we could set a `display_name` argument too.

## Developing & Testing IaC
Before you begin, you should install the [terraform extension for VS Code](https://marketplace.visualstudio.com/items?itemName=mauve.terraform). This will give you a code formatter, syntax highlighting, tab completion, and quick navigation.

You may check your TF code compiles with the `terraform validate` command. You will need to `terraform init` your module beforehand. If the `init` gives you errors about the S3 bucket, that is OK: the state bucket is only needed when you are planning/deploying/destroying.

Infrastructure in the nonprod & prod accounts may only be created by terraform running on your Jenkins server -- your own AWS login will not be able to create anything. If you wish to test terraform from your own machine, you can log in to the sandbox with the [aws-adfs](https://github.com/venth/aws-adfs) utility.

:::tip `aws-adfs` & Duo
Before using the `aws-adfs` utility, you will need to configure Duo to automatically send you push notifications.

When logging in to [aws.northwestern.edu](https://aws.northwestern.edu), hit the *Settings* tab on your Duo popup, then *My Settings & Devices*.

Choose *Automatically Send this Device a Duo Push* to enable this functionality.
:::

Once installed, you can run the utility with the below arguments. Your username should be in the format `ads\netid`.

```sh
aws-adfs login --adfs-host=ads-fed.northwestern.edu --provider-id urn:amazon:webservices --region us-east-2
```

Once logged in, the utility will prompt you to choose the AWS account to use.