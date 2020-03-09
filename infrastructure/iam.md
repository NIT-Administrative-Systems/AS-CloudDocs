# Identity & Access Management (IAM)
The AWS Identity & Access Management (IAM) service is at the heart of every AWS implementation. It controls who can log in to your account, what AWS services you can access, what AWS services *other* services can access, and a bunch more.

## Policies
You will need to write IAM policies for almost every IaC module, doing things like [giving Lambdas access to write logs to CloudWatch](./lambda.md#cloudwatch-logs) or permitting ECS to talk to an EC2 instance you've set up for it.

A policy is a series of statements, granting some permissions (or *actions*) to some resources. In some cases, you may need to specify the principal (e.g., what is getting these permissions) -- other times, the policy will be attached to a role, like the *AS-ADO-Devs-EACD* role that staff log in to the AWS console as.

```json
{
  "Version": "2012-10-17",
  "Id": "S3-Account-Permissions",
  "Statement": [{
    "Sid": "1",
    "Effect": "Allow",
    "Principal": {"AWS": ["arn:aws:iam::ACCOUNT-ID-WITHOUT-HYPHENS:root"]},
    "Action": "s3:*",
    "Resource": [
      "arn:aws:s3:::mybucket",
      "arn:aws:s3:::mybucket/*"
    ]
  }]
}
```

When writing policies, the best practice is to follow the rule of least privilege: only grant the minimum permissions, to the fewest number of resources, for something to work. 

You should never write a policy that grants access to `Resource = *`. We run multiple applications in our AWS accounts, and it is never appropriate for something like your Lambda's execution role to have access to every DyanmoDB table in the account.

There are a few exception to that rule: [Lambdas need wildcard access to create network interfaces](./lambda.md#running-in-the-vpc), and an execution role for an AWS account admin would want access to all resources. Contact the EACD-CloudOps team if you think you may have a situation that requires wildcard access, and they will try to provide solution.