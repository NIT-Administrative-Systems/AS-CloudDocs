# Alerts
AWS CloudWatch collects metrics and logs from your application & infrastructure. You can configure [alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) based on AWS' built-in metrics, [custom metrics your app reports to CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html), forecasts (powered by machine learning), or a combination of all three. These alarms can trigger alerts in OpsGenie.

The available metrics vary between AWS products, and most products should have a section in their documentation that explains what metrics are available. For example, [Lambda has metrics](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html) for invocations, run time, and concurrent executions.

Beyond alerting, alarms are used to trigger auto-scaling up & down when certain conditions are met. You can attach several actions to an alarm: if auto-scaling is triggered, you can *also* send an OpsGenie alert at the same time.

## Alerting to OpsGenie
CloudWatch alarms can be dispatched to an SNS topic, which can make API calls. The OpsGenie API supports automatic approval to receive data from SNS by way of its [AWS integration](https://docs.opsgenie.com/docs/aws-cloudwatch-integration).

The EACD-CloudOps team sets up and maintains the SNS topics. They are terraformed as part of the shared account resource IaC module, and the ARNs are published as outputs. 

If you need your OpsGenie team set up, contact EACD-CloudOps. You will need to provide a contact with admin rights to the team so they can add the AWS CloudWatch integration and provide the URL & API key.

Once set up, you just provide the SNS topic ARN in the `alarm_actions`. It is recommended to have a flag you can set to disable all of your application's alerts.

Here is an example module that alerts when there are >0 failed steps in an AWS Step Function.

```hcl
variable "alert_on_failure" {
    default = false
    description = "Whether or not CloudWatch should send alerts via OpsGenie."
}

data "terraform_remote_state" "shared_resources" {
  backend = "s3"

  config = {
    bucket = var.account_resources_state_bucket
    key    = var.account_resources_state_file
    region = var.account_resources_state_region
  }
}

resource "aws_cloudwatch_event_target" "app_runner_target" {
  rule     = aws_cloudwatch_event_rule.app_runner_rule.name
  arn      = aws_sfn_state_machine.runner_step_function.id
  role_arn = aws_iam_role.step_function_role.arn
}

resource "aws_cloudwatch_metric_alarm" "failed_executions_alarm" {
  alarm_name          = "MyFunction-${var.env}-ExecutionsFailed"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "ExecutionsFailed"
  namespace           = "AWS/States"
  period              = "120"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "Monitors for MyFunction ${var.env} step function errors."
  treat_missing_data  = "ignore"
  actions_enabled     = var.alert_on_failure
  alarm_actions       = [data.terraform_remote_state.shared_resources.outputs.opsgenie_team_sns_arns.eacd]

  dimensions = {
    StateMachineArn = aws_sfn_state_machine.runner_step_function.id
  }
}
```