# Terraform
Infrastructure as Code (IaC) is a way to define what resources & configuration you need to run an application. These declarations can then be stored in git. This approach eliminates the potential for human error when setting up multiple servers & configuration drift between environments.

All cloud resources in the prod & nonprod environments must be created as IaC, and account permissions will reflect this policy.

[Terraform](https://www.terraform.io/) is the vendor-agnostic IaC tool that Administrative Systems uses. When you write your IaC, terraform will determine which service providers you need and will automatically download the appropriate [provider drivers](https://www.terraform.io/docs/providers/index.html). 

For the most part, AS developers will only need to be concerned with the [AWS provider](https://www.terraform.io/docs/providers/aws/index.html). But if the need arises, you can use terraform to build infrastructure for one app across several cloud vendors.

:::warning Terraform Version
Prior to January 2020, we used Terraform v0.10. We are in the process of migrating to TF 0.12. 

All new IaC development should be done using TF 0.12. We recommend installing [`tfenv`](https://github.com/tfutils/tfenv) to manage your TF versions.

You should upgrade your older modules to v0.12 -- see the AS [upgrade guide](./tf-upgrading.md) for guidance.
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
  topic_arn              = aws_sns_topic.opsgenie_alert_topic.arn"
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
aws-adfs login --adfs-host=ads-fed.northwestern.edu --provider-id urn:amazon:webservices --region us-east-2 --no-sspi
```

Once logged in, the utility will prompt you to choose the AWS account to use.

## More About Configuring Profiles in the AWS-ADFS Utility

The aws-adfs utility facilitates logging you into AWS and it places your temporary credential information in your .aws/credentials files where many other applications (including terraform) know where to look and how to use it. In short, it logs into an AWS account on your behalf during the upload.

A default profile is established based on the first AWS account you use without specifically designating a profile name. Note that you can always delete your default via the reset command and establish another one. (See below.)

In addition to a default profile, you can create a profile for each AWS account that you use.

There are three commands that you will need in order to work with profiles:

**1. aws-adfs list**

Use this to list the details of all your profiles, including the default.


**2. --profile {YourProfileName}**

This is added to the standard utility statement both to create a profile and to use that profile after it is created.
Once you have entered the standard utility statement with a new profile name, you will see a numbered list of all AWS account to which you have access.
Enter the number of the account that you want to associate with the profile name you entered. From that point forward, that profile name is mapped to the account you selected.

*For Example*
```sh
aws-adfs login --adfs-host=ads-fed.northwestern.edu --provider-id urn:amazon:webservices --region us-east-2 **--profile YourProfileName**
```

*Using an existing profile*
```sh
sudo aws-adfs login --profile YourProfileName
```

**3. aws-adfs reset --profile YourProfileName**

Use this to delete the named profile from the list.



## Shortcut Configuration
The utility code listed above can become tedious. To shorten the process, use follow the instructions below to install a function within your bash profile that clears the current profile and sets your newly entered profile.

1. Open bash editor:   vi ~/.bash_profile
2. Enter i to insert
3. Paste in the following code:

```sh
function aws-adfs-login ()
{                                                                                     
	unset AWS_PROFILE
	aws-adfs login --adfs-host=ads-fed.northwestern.edu --provider-id urn:amazon:webservices --profile $1 --no-sspi
	export AWS_PROFILE=$1
}
```

4. Enter [esc] to exit insert mode
5. Enter [shift]zz to save and close
6. If you are using linux, enter:   **source ~/.bash_profile**
7. To use a profile, enter the function and profile name:  **aws-adfs-login [YourProfileName]**
8. To see all your profiles, enter: **aws-adfs list**
