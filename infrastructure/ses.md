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

Here is the current disposition. Accounts that are still in the email sandbox may only send mail to a small number of email addressed that have opted in.

| Account        | Domain Setup | In Email Sandbox | 
|----------------|--------------|------------------| 
| DMA Sandbox    | No           | Yes              | 
| DMA Nonprod    | No           | Yes              | 
| DMA Production | No           | Yes              | 
| ADO Sandbox    | Not verified | Yes              | 
| ADO Nonprod    | Yes          | No               | 
| ADO Production | Yes          | No               | 

If you need an account set up for SES, contact the EACD-CloudOps team. The setup may take a few days; requests to leave the SES email sandbox are manually reviewed & approved by AWS customer support.

Our sandbox accounts will not be removed from the SES email sandbox. You can set up verified recipients to send mail to, if that is an important aspect of your proof-of-concept.

## Domain Setup
You may wish to send emails from a domain other than `northwestern.edu`. For example, a project involving a microsite for a student group may have its own domain name. 

If you want to send from a different domain, contact the EACD-CloudOps team to have it set up. You will need to provide a contact that can manage DNS for the domain to EACD-CloudOps.

There are two parts to the domain setup: verification, and setting up SPF/DKIM records (to avoid emails being flagged as spam). 

The SES domain should be terraformed in the account's shared resources module. The ARN for the new domain should be published as an output, so other developers can reference it in their IaC modules. The verification DNS record and DKIM DNS records will be available in the AWS console once created.

Our preferred method for verification is one of SES' alternative approaches: create a TXT record for the domain prefixed with `amazonses`. This approach allows for multiple AWS accounts (prod & nonprod) to send mail for a single domain. For example, `northwestern.edu` is set up like this:

```
$ dig +short -t txt northwestern.edu | grep amazonses
"amazonses:PD1svM8Ux6TaXc7Gzh7bEKYK8ki2nt1gzZx0bKpaJPg="
"amazonses:0G1rTZw4h/ZJ8pnm67+KKxSL41IP0Ok7GZUZ7IF/kZc="
"amazonses:eKCoAQOpP+sWBz54nKIZTfjnWJSS7Nrflp9ziIraP1M="
"amazonses:7r2Zk09xSsTpfnWKtxmYJqXsJOGSGsquQGrckxhTLUI="
"amazonses:8oZtwYE9ip7ShHqAmkO/bCOQbr1zqwQ9D3DcOdg6eMg="
```

The [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail) instructions in the console should be followed, as the way DKIM works supports our prod/nonprod AWS account setup out of the box. 

To set up [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), adjust the domain's SPF record [according to Amazon's documentation](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-authentication-spf.html#send-email-authentication-spf-records) by adding an `include:amazonses.com` policy.