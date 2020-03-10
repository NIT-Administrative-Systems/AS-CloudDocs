# Lambda
Lambda is the AWS serverless compute platform.

## Public Cloud vs. VPC
By default, Lambdas will run on AWS' public infrastructure. It will be given an IP from AWS' general pool, and it will not have access to campus datacenter resources over the VPN.

If you don't think your Lambda will ever need VPN access, this is fine. Running this way reduces the complexity of your infrastructure.

If you do need access to campus resources, you will need to specify the VPC ID, [obtain subnets](./vpc-ip-addr.md), and give your Lambda some [additional network permissions](#running-in-the-vpc). 

## Execution Role
Lambdas assume an IAM role when they run. This role is what governs their access to other AWS services like CloudWatch (for logging) or DyanmoDB (for your data).

### CloudWatch Logs
Every Lambda should be given access to write its console output to CloudWatch. There are two best practices we recommend here:

1. Explicitly create your CloudWatch log groups with a retention policy
1. Only grant your Lambda access to the necessary log groups

If you do not explicitly create the log group, AWS may create it for you implicitly. This is problematic later on: you will eventually want to set up a retention policy so the logs aren't kept forever, but Terraform won't be able to create the group since it already exists. If this has already happened, contact the EACD-CloudOps team and they can help [import the resource into terraform](../iac/tf-import.md).

Your IAM role is probably too broad if it's able to create the log group too: you may have granted your Lambda access to something like `logs:*/*`, which will cover every log group in the account. [This is not permitted](./iam.md) in AS, but older IaC modules may have been implemented this way. 

Here is a working Terraform example that implements these recommendations:

```hcl
# Role for the Lambda to assume
resource "aws_iam_role" "lambda_execution_role" {
  name               = "${var.lambda_name}-lambda-execution-${var.env}"
  assume_role_policy = data.aws_iam_policy_document.lambda_execution_role.json
  description        = "${var.env} - ${var.lambda_name} Lambda Execution Role"
}

# Boilterplate-y policy that allows Lambda to assume this role
data "aws_iam_policy_document" "lambda_execution_role" {
  statement {
    effect = "Allow"

    principals {
      type = "Service"

      identifiers = [
        "lambda.amazonaws.com",
      ]
    }

    actions = ["sts:AssumeRole"]
  }
}

# Log group name **MUST** match the Lambda's name
# This is just how Lambda works, you cannot overwrite/change the group your Lambda will log to.
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name = "/aws/lambda/${var.lambda_name}-${var.env}"

  # Set to whatever is appropriate for your project
  retention_in_days = 14 
}

# CloudWatch log policy
data "aws_iam_policy_document" "lambda_access_policy" {
  statement {
    effect    = "Allow"
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = aws_cloudwatch_log_group.lambda_log_group.arn
  }

  # You could include other statements too (KMS/SSM, network interface stuff, SES, etc)
}

# Attach the policy to the role
resource "aws_iam_role_policy" "lambda_kms_policy" {
  name   = "${var.lambda_name}-lambda-kms-policy-${var.env}"
  role   = aws_iam_role.lambda_execution_role.id
  policy = data.aws_iam_policy_document.lambda_access_policy.json
}

# The Lambda itself
resource "aws_lambda_function" "app_lambda" {
  function_name    = "${var.lambda_name}-${var.env}"
  role             = aws_iam_role.lambda_execution_role.arn

  # . . . and all the other settings you need
}
```

### Running in the VPC
If your Lambda is going to [run in the VPC](./vpc-ip-addr.md) so it has VPN access to the campus datacenters, you will need to give it some of the EC2 network permissions. This may seem counter-intuitive -- Lambda isn't EC2 -- but all of the network interface stuff is "part" of the EC2 service.

Here is a policy document you can attach to your Lambda's execution role. This is a rare situation in which granting something access to `*` is acceptable:

```hcl
data "aws_iam_policy_document" "lambda_access_policy" {
  statement {
    effect = "Allow"

    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface",
      "ec2:DetachNetworkInterface",
    ]

    resources = ["*"]
  }
}
```