# Terraform State Move
Terraform can move resources around within the state file, which means you can refactor terraform without being forced to recreate the resources. For example, this is useful for converting individual resources or a `count` resource to a `for_each` resource.  

The `terraform state mv` command modifies the state and must be executed by an AWS Account Admin.

1. (Developer) Refactor your Terraform in a new branch. On your local machine, login with the `aws-adfs` utility and verify `terraform plan` will refactor the resources as desired but would destroy/recreate the resources. Don't merge and deploy/`apply` the changes yet.
2. (Admin) Locally checkout the branch with the refactored terraform. Locally login to aws account with `aws-adfs`, with admin rights.
3. (Admin) Locally, in the `iac/{env}` directory corresponding to the state file, run `terraform init`.
4. (Admin) Then, for each individual resource to refactor/move within the state, run a `terraform state mv` command with the source/destination in the state file.
e.g.
```bash
# Example
terraform state mv 'module.example.aws_s3_bucket.an_individual_bucket' 'module.example.aws_s3_bucket.fc_bucket["a-foreach-bucket"]'
```
:::tip
Look at the destroy/create for each resource in the `terraform plan` output to get the correct source and destination for each resource's mv command.
:::
5. (Developer) Once all of the moves within the state file are complete, locally verify that `terraform plan` no longer shows the recreation of all of those resources (because the state file now matches the refactored IaC).
6. (Developer) Merge the IaC code change and deploy (should be no changes).

<!-- the Details block does not work in IE -->
::: details Example Use Case: Refactor invididual s3 bucket resources to a for_each resource
### Scenario
There are 18 buckets in one module, declared as individual resources with the same configuration. Terraform did not add the `for_each` feature until awhile after this IaC was created. In order to more easily maintain those s3 buckets (e.g. change the configuration without updating in 18 places) and more cleanly add outputs for the bucket data, it would be preferable to convert them from being individually declared in the IaC to a single for_each resource (which references a variable with a list of bucket names).

```hcl
# before: many individual declarations
resource "aws_s3_bucket" "first_example_bucket" {
    ... 
}

resource "aws_s3_bucket" "second_example_bucket" {
    ... 
}

resource "aws_s3_bucket" "third_example_bucket" {
    ... 
}
```
```hcl
# after: single for_each declaration 
resource "aws_s3_bucket" "all_example_buckets" {
    for_each = toset(var.example_bucket_names)

    bucket = "${each.key}-${var.env}"
    acl    = "private"

    tags = local.tags
}
```

### Problem
Moving individual resources (s3 buckets) to a for_each resource will destroy and recreate them all on `terraform apply` because they have to be referenced differently in the state file as a for-each.  

If the s3 buckets are already live and contain objects you don't want to lose, recreating all of the buckets is problematic.

### Solution
Use `terraform state mv` to change each bucket's reference in the state file to a for-each, in order to refactor without recreating. 
```bash
# Example
terraform state mv 'module.example.aws_s3_bucket.first_example_bucket' 'module.example.aws_s3_bucket.all_example_buckets["first-example-bucket"]'
```
:::
