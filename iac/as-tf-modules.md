# AS Terraform Modules
A collection of resources can be grouped into a terraform module, and the module can be invoked multiple times. This can be leveraged to declare all your infrastructure for an application in a *base module*, and then run that module (with some different variables) for dev, QA, and production.

Administrative Systems generally creates a folder structure like this:

```
├── base_module
│   ├── sns.tf
│   ├── output.tf
│   └── variables.tf
├── dev
│   ├── provider.tf
│   ├── state.tf
│   └── main.tf
└── qa
    ├── provider.tf
    ├── state.tf
    └── main.tf
```

You'll notice that the `provider.tf` and `state.tf` files move out to the environment. The `sns.tf` file in the `base_module` has the SNS topic and subscription from our last example, but there are two new files: `variables.tf`, which declares what arguments our *base module* has, and `outputs.tf`, which has its *attributes*. 

:::tip Terraform Files
Terraform is run for a given folder. It will evaluate all of the `*.tf` files in that folder as one module.

This means you can split your resources up across as many files as you like. We generally split them by service, e.g. `sns.tf` has the SNS config. 

We keep the `state.tf`, `variables.tf`, `provider.tf`, and `output.tf` in their own files. Otherwise, there are no rules -- you can split the infrastructure resources across as many (or few) files as makes sense for your project.
:::

The `main.tf` for the development environment would look like this:

```hcl
module "opsgenie_alert" {
    source = "../base_module"

    # These would be declared in the base_module's variables.tf
    environment = "development"
    team_name   = "MyTeam"
}
```

This ensures consistency between environments. The dev environment *must* be similar to the QA environment, because they are built using the exact same terraform module.

Modules are very powerful: you can nest modules and have them interact with each other via their outputs, include shared module code from Github repositories, and access the Terraform state from other IaC projects.

## Sharing Resources
The AS Cloud Services team will create and manage shared resources in your account -- things like an ALB, IP subnets, and the VPC. There will be one repository for each department's AWS accounts, with a base module covering everything the account needs and a sandbox/nonprod/production module to build the resources out in an appropriate manner.

Developers will need to use some of the attributes for these shared resources in their IaC. For example, running a Lambda in the VPC so it may access resources on campus requires the VPC ID and subnet IDs.

:::tip New Practice
The shared resource repository and remote access to state files is a fairly new practice. 

Historically, shared account resources were not created with terraform. VPC IDs/etc were hard coded in each project. 

The AS Cloud Services team is working to import these into terraform. If you find you need an attribute that isn't available, please let the AS Cloud Services team know!
:::

**Declaring a VPC resource in an application's terraform module would be wrong**: the VPC already exists, and declaring one would try to create a second VPC. Instead, an application would want to declare a remote resource and access information about about the already-created VPC.