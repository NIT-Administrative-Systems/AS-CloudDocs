# Upgrading Terraform
Prior to January 2020, all IaC was written in Terraform v0.10.x. One selected version of the `terraform` command was available on the Jenkins servers.

The v0.10 series has reached the end of its useful life: the AWS provider will [no longer be updated](https://www.hashicorp.com/blog/deprecating-terraform-0-11-support-in-terraform-providers/) for Terraform 0.11 and older. Without active support on the AWS provider, new AWS features will be unavailable to us. As time goes on, AWS API changes may leave existing IaC modules broken & unable to build.

## Strategy
A utility called [`tfenv`](https://github.com/tfutils/tfenv) is available on the Jenkins servers. This is similar to Python's `virtual_env`, Node's `nvm`, or Ruby's `rbenv`. It allows you to select a specific version of Terraform on a per-project basis.

This utility will allow us to run multiple versions of Terraform on the same Jenkins server. Projects may be upgraded one-by-one, instead of needing all jobs on one Jenkins server to upgrade to Terraform v0.12 in unison.

## Upgrading from v0.10
The Terraform language has undergone significant changes in v0.12. It has a tool to convert your terraform files, but there are some items that cannot be automatically updated. 

You should carefully review [the official upgrade guide](https://www.terraform.io/upgrade-guides/0-12.html) and identify any features you are using that may require your attention before you undertake an upgrade.

1. Install the `tfenv` command on your workstation
    
    You should remove any versions of Terraform that you had installed previously; they can be re-installed under `tfenv`'s management

1. Create a new git branch for the upgrade

1. Create a `.terraform-version` file in the root of your project. This file is used by `tfenv` to determine what version to install

    ```sh
    $ cat .terraform-version
    latest:0.12
    ```

1. Install terraform by running `tfenv install` in the root of your project

1. Run the automatic upgrade command for each folder containing `.tf` files.

    The [recommended module structure](./as-tf-modules.md) dictates that all env-specific modules use the same 'base' code. This means all the env-specific modules must be upgraded alongside it. You cannot piecemeal this step.

    The upgrade tool considers these on a folder-by-folder basis. It will not follow references to other folders or remote modules.

    ```sh
    # This is an example -- your base module & envs may differ.
    # If you have any .tf files in the project root, make sure to do
    # that folder as well.
    $ terraform 0.12upgrade -yes sandbox/
    $ terraform 0.12upgrade -yes nonprod/
    $ terraform 0.12upgrade -yes prod/

    # Any modules that use providers will need those providers installed
    # before they can be upgraded.
    $ terraform init base/
    $ terraform 0.12upgrade -yes base/
    $ rm -rf base/.terraform
    ```

1. Adjust your `.terraform-version` file again. The upgrade may have written a specific patch version, but we want on-the-fly updates for the patch version.

    It should be:

    ```sh
    $ cat .terraform-version
    latest:0.12
    ```

1. Remove any `versions.tf` files in your environment-specific folders.

    This file tells Terraform the minimum version number the module may run on. The upgrade command will emit these for each folder it is run in.
    
    In the interest of DRY code, we only want this file in the base module that all of the env-specific modules use. They will all inherently rely on its version specification.

    ```sh
    # From the project root:
    $ find . -name versions.tf
    ./prod/versions.tf
    ./nonprod/versions.tf
    ./sandbox/versions.tf
    ./base/versions.tf

    # Leave the one in base, but remove all others:
    $ rm ./prod/versions.tf ./nonprod/versions.tf ./sandbox/versions.tf
    ```

1. If you have pinned the AWS provider version for your module, review this and decide if it is appropriate to update the version.

    This was done for some IaC modules. The older provider uses older AWS APIs, allowing the module to build without making changes that Amazon needs for the newer APIs.

    This is a good opportunity to review and upgrade to the latest provider.

    If you have pinned the provider version, it will look like this:

    ```hcl
    provider "aws" {
        # Pinned to 1.33 and older
        version = "<= 1.13.0"

        # Pinned to 1.60.x
        version = "~> 1.60"
    }
    ```

    You should at least migrate to the 2.x provider. The latest version can be found on the [Terraform registry](https://registry.terraform.io/providers/hashicorp/aws). If you move to the latest evrsion, you can set up Dependabot for the repository and receive pull requests when new versions of the provider are available.

1. If you are using any of the [AS shared modules](./available-modules.md), you will need to use their `tf-0.12` branch. All you need to do is add/update `?ref=<branch name>` in the git URLs.

    ```hcl
    module "alb" {
        source = "github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules//alb?ref=tf-0.12"

        // . . .
    }
    ```

1. Run the validator tool for each module and review your Terraform code.

    ```sh
    $ cd nonprod
    $ terraform init # errors about the state file are expected and OK
    $ terraform validate
    $ rm -rf .terraform
    ```

    Fix any errors raised by the upgrade tool & any other issues you identify.

    Warnings will be called out when you run the upgrade command, but they will be annotated in the code as well. Look for `TF-UPGRADE-TODO` comments.

1. Log in to AWS from your console and review the plan

    You can use the [aws-adfs tool](./terraform-concepts.md#developing-testing-iac) to log in to AWS on your console. Select the correct account (e.g. planning dev = nonprod AWS account) when logging in.

    ```sh
    $ cd nonprod/
    $ terraform init
    $ terraform plan
    $ rm -rf .terraform
    ```

    In most cases, the plan will show no changes. There may be exceptions to this. You can review older deployments to determine if that was normal in v0.10; if it was, the v0.10 and v0.12 plans should reflect that the same resources need to change. The exceptions we know about are:

    - API Gateway deployments may show up if a run will always re-deploy the API Gateway
    - Lambdas may show up if the code or dependencies have changed, since the last modified date, source code hash, and/or etag (for the zip containing the code) have changed

    You may not be able to generate a complete plan. If you are using encrypted SSM parameters with a custom KMS key, you will not have enough access to decrypt the values, which Terraform wants to consider for its plan.

1. Update your Jenkins pipeline files to use `tfenv` and auto-approve the plan

    You will need a new stage before `terraform` is used to grab the correct version for your project. In the context of your `stages` block, prepend:

    ```groovy
    stage ('tfenv') {
        steps {
            sh 'tfenv install'
            sh 'terraform -version'
        }
    }
    ```

    You will also need to add the `-auto-approve` flag to `terraform apply`:

    ```groovy
    stage ('Existing Apply Stage') {
        steps {
            sh 'terraform apply -auto-approve -no-color'
        }
    }
    ```

## Going Live with the Upgrade
Once your v0.12 changes are valid, moving the new module into production should be painless. The underlying terraform code may have been updated, but the `terraform plan` should be unchanged. No changes should be made to your infrastructure as a result of this upgrade.

After you run `terraform apply` with the new version of terraform, that module's `tfstate` is updated. This occurs even if the `terraform apply` command fails to fully execute. You cannot revert to a older version of terraform. This is applicable even for minor version bumps (e.g. 0.12.19 to 0.12.20).

## VS Code Support
If you are using the Terraform VS Code extension, you will need to make adjustments to its configuration so it will work with the v0.12 language changes.

In your VS Code setting JSON file, set these options:

```json
{
    // . . .
    "terraform.indexing.enabled": false,
    "terraform.languageServer.enabled": true
}
```

Restart VS Code. It should prompt you to install & run the Terraform Language Server. Once complete, you should regain the full use of the extension.