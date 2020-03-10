# Simple Email Service (SES)
Amazon Simple Email Service (SES) is the most straightforward way to send email from AWS to faculty, staff, students, and the general public. Whenever possible, you should use SES via the AWS SDK or an API. If that is not possible, SES has an SMTP gateway, but to date AS has no experience with that.

SES sends email, but is not a mailing list or marketing platform -- it does not have any tools for creating responsive purple emails. You will still want to use tools like Laravel's mail templates or [MJML for JS](https://mjml.io/) to create your content. It is **not** recommended that you try to make HTML emails by hand; the rendering differences across Outlook/GMail/iOS Mail are *extensive*.

The service reports basic *technical* statistics: successful deliveries, bounces, and a few others. SES does not provide open rates or any meaningful analytics. If you want that data, you should consider a 3rd-party service like MailChimp (bulk mail) or MailGun (transactional mail) -- *neither of which we currently have a contract with*!

The most important thing to know when using SES is that it is available in a limited set of regions. Our SES setup & sending is all done in `us-east-1`. If you see errors about an SES domain not resolving, make sure you're not trying to use the `us-east-2` SES API endpoint.

## Usage
Using SES from another AWS service, like Lambda, is easy: you add a policy to the execution role that permits it to send from the `northwestern.edu` domain. The ARN for the verified SES domain resource is published in the account shared resources IaC module, and you will need to access the ARN to write the IAM policy correctly.

Here is an example policy that allows sending mail:

```hcl
data "terraform_remote_state" "shared_resources" {
  backend = "s3"

  config = {
    bucket = var.account_resources_state_bucket
    key    = var.account_resources_state_file
    region = var.account_resources_state_region
  }
}


data "aws_iam_policy_document" "lambda_access_policy" {
  statement {
    effect    = "Allow"
    actions   = ["ses:SendEmail", "ses:SendRawEmail"]
    resources = [data.terraform_remote_state.shared_resources.outputs.ses_northwestern_domain_arn]
  }
}
```

You can get more fine-grained than this. If you are issuing an access key so a 3rd party service can send emails through our AWS account, consider restricting what `ses:FromAddress` that can be used in the IAM policy. The [SES policy documentation](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/sending-authorization-policies.html#sending-authorization-policy-elements) lists all of the fields avaialble.

You should always grant the minimum access possible. In the case of SES, this principle is especially important: the sender reputation for `northwestern.edu` is at stake. 

## Account Status
The SES service needs to be set up for the `northwestern.edu` domain and removed from the [SES email sandbox](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html) before you can send mail. This is work that only needs to be done once per account.

Here is the current disposition:

| Account        | Domain Setup | Can send external mail | 
|----------------|--------------|------------------------| 
| DMA Sandbox    | No           | Yes                    | 
| DMA Nonprod    | No           | Yes                    | 
| DMA Production | No           | Yes                    | 
| ADO Sandbox    | Not verified | Yes                    | 
| ADO Nonprod    | Yes          | No                     | 
| ADO Production | Yes          | No                     | 

If you need an account set up for SES, contact the EACD-CloudOps team. The setup may take a few days; requests to leave the SES email sandbox are manually reviewed & approved by AWS customer support.

Our sandbox accounts will not be removed from the SES email sandbox. You can set up verified recipients to send mail to, if that is an important aspect of your proof-of-concept.

If you want to send from a different domain, contact the EACD-CloudOps team.