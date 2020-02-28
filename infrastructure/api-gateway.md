# API Gateway
The AWS [API Gateway](https://docs.aws.amazon.com/apigateway/) is Amazon's serverless platform for API development and delivery. It has many features found in [Apigee](https://cloud.google.com/apigee/), and can be used to similar purpose.

:::tip HTTP APIs for API Gateway
Amazon has a simplified and less-expensive version of API Gateway in beta, called [HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html). It drops support for most of the features we already rely on Apigee for.

We have not deployed this service anywhere yet, but it sounds like a strong candidate to replace all API Gateway usage.
:::

## Usage
Our typical use-case for API Gateway is as the load balancer for serverless APIs running on Lambda. We do not use most of the features it offers: documentation, API key management, rate limiting, and request/response re-writing are all handled in Apigee.

API Gateway imposes a 29-second max on requests. If you have some requests that may exceed this limitation, API Gateway is not appropriate for your use-case. There are [other limitations](https://docs.amazonaws.cn/en_us/apigateway/latest/developerguide/limits.html) on maximumn request/response size (and a number of other items) that should be reviewed before deciding to use API Gateway. [ALBs](./alb.md) can get around most of these limitations, but are an always-on service.

In the past, we have created individual REST API resources in API Gateway. This has created complexity without giving us much value. Going forward, it is recommended that you create [simple API Gateway proxies](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html) and handle routing/authorization in your application.

### Apigee
APIs should be registered in our API management platform, Apigee.

Most of our APIs have been machine-to-machine integrations. We set up a single API key per environment in API Gateway. This allows Apigee to authenticate to the API. Further restriction on a per-application basis is handled in Apigee. The API Service Registry [has instructions on setting this up](https://apiserviceregistry.northwestern.edu/documentation/producer/prod-awssetup.html) on the Apigee side.

In the case of single-page applications with an API Gateway service, we have *not* historically registered their APIs in Apigee. Apigee does not have a `*.northwestern.edu` domain, so authenticating individual users with SSO against an Apigee endpoint is impossible -- the API will not have access to any of the SSO cookies.

:::tip Apigee Vanity Domain
We are in the process of setting up an `api-{env}.northwestern.edu` vanity domain for Apigee. 

Once this is available, you should register APIs intended for use by SPAs through Apigee.

Services being available to other developers for [mashup-](https://en.wikipedia.org/wiki/Mashup_(web_application_hybrid)) or [MASA-](https://www.gartner.com/document/3980382)style apps is highly valued by AS leadership.
:::

## Deployments
The API Gateway configuration must be deployed before it goes into effect. You need an [API Gateway Deployment resource](https://www.terraform.io/docs/providers/aws/r/api_gateway_deployment.html) in Terraform to trigger the deployment. However, Terraform only deploys changed resources -- it needs to see a change with the deployment in order to trigger and re-deploy your API Gateway settings.

This can be achived by adding a variable with the current time. Terraform will always re-deploy the API when `terraform apply` is run:

```hcl
resource "aws_api_gateway_deployment" "deployment" {
    # Other parameters . . .

    variables {
        # Ensures TF re-deploys w/ the new timestamp every time it runs
        deployed_at = timestamp()
    }

    lifecycle {
        create_before_destroy = true
    }
}
```