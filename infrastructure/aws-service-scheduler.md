# AWS Service Scheduler
For cost savings, we recommend stopping AWS services in the lower environments during periods of unuse. For example, if an EC2 instance is only used for development purposes during business hours, stopping it over nights and weekends yields significant savings.

The AS AWS Service Scheduler utility enables you to easily stop/start supported AWS services on a schedule via tags.

## Supported AWS Resources
| Service | Resource Type | Regions |
| ------- | ------------- | ------ |
| EC2 | Instance | us-east-2, us-east-1 |

For stopping and starting ECS Fargate Services, see the [ECS Fargate documentation](./ecs-fargate#using-scheduled-scaling-for-cost-savings) on Scheduled Scaling for Cost Savings.

To request support for other AWS services or regions, please submit a request to EACD for evaluation.

## Supported AWS Accounts
The Service Scheduler is only available in non-production accounts:
| AWS Account | Service Scheduler |
| ------- | ------------- |
| ADO Sandbox | Yes |
| ADO Nonprod | Yes |
| ADO Prod | No |
| DMA Sandbox | Yes |
| DMA Nonprod | Yes |
| DMA Prod | No |

## How To Schedule Your Resources
### Method 1: Preset Schedule Tags (recommended)
Add a tag to your Terraform resource:

| Tag Name | Tag Value |
| -------- | --------- |
| ServiceScheduler | See the predefined schedules below. |

Example:
```hcl
resource "aws_instance" "example" {
  ami           = data.aws_ami.amazon-linux-2.id
  instance_type = "t2.micro"
  ...

  tags = {
    ServiceScheduler = "business_hours"
  }
}
```
### Available Preset Schedules
| Name | Service On Hours | Terraform Tag Value |
| ---- | -------- | ------------- |
| Business Hours | M-F 8am-5pm | business_hours |
| Extended Business Hours | M-F 6am-7pm | extended_business_hours |
| Weekdays Only | Monday 5am - Friday 10pm | weekdays_only |

### Method 2: Customized schedule and resources
1. In your IaC, leverage Terraform remote state to get the stop_lambda_arn and start_lambda_arn output for our Lambda functions. Create CloudWatch rules invoking our STOP and START Lambda functions on your own schedule.
2. The input event can specify a list of tags and/or a list of resource arns:
    - For search tags provided, the lambda will search for resources with ALL of the specified search tags and start or stop them (regardless of ARNs provided)
      - **DO NOT provide a list of generic tags**: You are responsible for specifying search tags specific to only your application. For instance, if you only specify "Environment": "dev" in the search tags, you will stop all resources in the account with that tag and not just your application. Use with caution!
    - For resource ARNs provided, the lambda will start or stop each ARN (regardless of tags provided)

Example Input Event:
```JSON
{
    "searchTags": { // use tags specific to your services
        "Application": "MY EXAMPLE API",
        "Environment": "sbx",
    },
    "resourceArns": [
        "arn:aws:ec2:region:account:instance/instance_1234",
        "arn:aws:ec2:region:account:instance/instance_4321"
    ]
}
```

