# Terraform Import
Terraform can import existing infrastructure, which means you can import AWS resources created by some other method to be henceforth managed by Terraform and your IaC.  

The `terraform import` command modifies the state and must be executed by an AWS Account Admin.

1. (Developer) Write a resource block and push the code changes:
```hcl
# Example
resource "aws_cloudwatch_log_group" "example" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 14
}
```

2. (Admin) Login to the AWS account with the `aws-adfs` utility; select Admin role.
3. (Admin) `terraform import` doesn't work with a dynamic provider config (known limitation). 
    - Temporarily/locally hard-code the region in the provider block:
    ```hcl
    # DOES NOT WORK with import command:
    provider "aws" {
        region = var.region
    }

    # WORKS with import command:
    provider "aws" {
        region = "us-east-2"
    }
    ``` 
4. (Admin) Locally, in the `iac/{env}` directory where the state file is, run:
   1. `terraform init`
   2. `terraform import <resource address in your IaC> <existing id in AWS>`
    ```bash
    # Example
    terraform import module.build_lambda.aws_cloudwatch_log_group.example /aws/lambda/example-fxn
    ```
5. (Developer) Build/deploy.
   - Now that the existing resource is recorded in your state, `terraform apply` shouldn't yield a `ResourceAlreadyExistsException`. 
6. (Admin) Discard the change to hard-code the provider region. 

<!-- the Details block does not work in IE -->
::: details Example Use Case: Expire Lambda Logs
### Scenario
AWS Lambda functions automatically store log output in Amazon CloudWatch Logs by creating a CloudWatch Logs group for your Lambda function, named `/aws/lambda/{lambda-function-name}`.

Optionally, you could explicitly manage the CloudWatch Log group for a Lambda in your IaC. 

```hcl
resource "aws_lambda_function" "datahub_lambda" {
    function_name    = var.lambda_function_name
    ...
}

# optional 
resource "aws_cloudwatch_log_group" "example" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 14
}
```

Managing the Log Group in your IaC could be beneficial in order to set a log retention (logs that never expire accumulate and become difficult to search).

### Problem
The log group you create via Terraform for your Lambda function must be named `/aws/lambda/{lambda-function-name}`. 

If the Lambda function is already live and has already created its CloudWatch Log Group with this name, when you add the Log Group resource to your IaC,  `terraform apply` will fail:
```
Error: Creating CloudWatch Log Group failed: 
ResourceAlreadyExistsException: The specified log group already exists.
```

### Solution
Import the existing Log Group to attach it to your IaC. This records the existing resource in your Terraform state file so it can be henceforth managed by Terraform.
:::
