# VPCs & IP Addressing
As mentioned in the [AWS account design](./aws-account-design.md) article, each account will have a Virtual Private Cloud (VPC) with a large block of Northwestern LAN IPs assigned to it. These addresses can route back to the campus datacenters by way of a VPN.

If you wish to run an application inside the VPC, you will need to be assigned a subnet. This is a smaller slice of the VPC's total IP pool. Depending on the application, you may be given shared subnets or a dedicated app-specific subnets. EC2s, ECS containers, Lambdas, and any AWS service utilizing these compute services can be provided with a VPC ID & subnet IDs.

You will typically receive a pair of subnet IDs, with each subnet being configured to exist in a different availability zone.

## Assignment
Your VPC has a limited amount of IP space on the Northwestern network. This resource is managed by the EACD-CloudOps group, so you should ask them for an appropriate subnet for your application.

Subnet assignments are done in your account's shared resources Github repository as infrastructure-as-code.

In cases where you are certain that you do not need to access resources in the campus datacenter, you do not need a subnet allocation -- Amazon can provide the IPs from their pool of public addresses.

### Assignment Process
The EACD-CloudOps group will evaluate your request and determine if you need a dedicated subnet for your application, or if you can use an existing shared subnet. Factors such as application isolation and concurrent compute resource are considered.

A [subnetting tool](http://www.davidc.net/sites/default/subnets/subnets.html) will help determine how to split remaining IP space up. Amazon only allows us to split subnets as small as a /28. An entry will be added to your account's shared resource IaC and the subnet will be provisioned.

If all available IP space is exhausted, the PIPS-CloudOps group will be engaged. They will work with TNS to add additional subnet(s) to the VPC.

## Using Subnets
To use subnets in your IaC modules, you will want to create a [remote resource to load the tfstate](../iac/as-tf-modules.md) from your shared account resources module. The remote resource will make the subnet IDs available for use.

```hcl
data "terraform_remote_state" "account_resources" {
  backend = "s3"

  config = {
    bucket = var.account_resources_state_bucket
    key    = var.account_resources_state_file
    region = var.account_resources_state_region
  }
}

resource "aws_ecs_service" "ecs_task_serv" {
    name = local.ecs_task_name
    
    // . . .

    network_configuration {
        subnets = data.terraform_remote_state.account_resources.docconv_subnets
        // . . .
    }
}
```