# VPCs & IP Addressing
As mentioned in the [AWS account design](./aws-account-design.md) article, each account will have a Virtual Private Cloud (VPC) with a large block of Northwestern LAN IPs assigned to it. These addresses can route back to the campus datacenters by way of a VPN.

If you wish to run an application inside the VPC, you will need to be assigned a subnet. This is a smaller slice of the VPC's total IP pool. Depending on the application, you may be given shared subnets or a dedicated app-specific subnets. EC2s, ECS containers, Lambdas, and any AWS service utilizing these compute services can be provided with a VPC ID & subnet IDs.

You will typically receive a pair of subnet IDs, with each subnet being configured to exist in a different availability zone.

**@TODO**
- [subnetting tool](http://www.davidc.net/sites/default/subnets/subnets.html)
- how to get a subnet
- correct way to reference a subnet (module)

In cases where you are certain that you do not need to access resources in the campus datacenter, you do not need a subnet allocation -- Amazon can provide the IPs from their pool of public addresses.