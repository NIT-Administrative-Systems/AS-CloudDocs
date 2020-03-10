# Tagging Resources
AWS allows developers to tag most resources with up to 50 custom key:value pairs. In Administrative Systems, we have two uses for tags: cost breakdown (from the AWS Cost Explorer), and use with IAM/snapshot/bucket ACL policies.

## Standard Tags
We only require two standard tags. All resources that support tagging should have these tags.

| Tag Name    | Value                                                              | Purpose       | 
|-------------|--------------------------------------------------------------------|---------------| 
| Application | The name of your app, which MUST be consistent across envrionments | Cost analysis | 
| Environment | App environment, like dev/QA/prod                                  | Cost analysis | 

Note that tag names **are case-sensitive**. Take care to use the correct case for our standard tag names.

Adding these tags across all resources in Terraform is easy:

```hcl
# Add a tags.tf file, or put these locals in your variables.tf
locals { 
    tags = {
        Application = var.app_name
        Environment = var.env
    }
} 

# And then across (almost) all your TF resource blocks:
resource "aws_s3_bucket" "app_code_bucket" {
  bucket = "my-unique-bucket-name"
  acl    = "private"

  tags = local.tags
}

# If you need to add some additional tags, you can still use the local:
resource "aws_s3_bucket" "app_code_bucket" {
  bucket = "my-unique-bucket-name"
  acl    = "private"

  tags = merge(local.tags, { LambdaSourceCode = true })
}
```

You can check the Terraform AWS provider documentation for each resource to determine if it supports tags. Alternatively, you can apply tags to every resource and remove them from whatever `terraform plan` complains about.