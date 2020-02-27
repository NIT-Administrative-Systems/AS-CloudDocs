---
sidebarDepth: 0
---

# Frequently Asked Questions

## Why do I need to open a ticket for certificates?
Amazon may only issue a certificate for a domain that you own -- otherwise, their Certificate Authority may be revoked by major browsers. 

To prove ownership, we need to add some special DNS records to the domain. If you wanted a certificate for `foobar.northwestern.edu`, we must enter a DNS record specifically for Amazon. They give us a random subdomain on `foobar.northwestern.edu`, with a random value.

This process is cumbersome, since we are not currently permitted to automate DNS changes for `northwestern.edu`. That is why the [docs on certificate requests](../infrastructure/certificates.md) tell you to open a ticket with the SOC -- a human with a high level of acces must adjust DNS for `northwestern.edu`!

## I'm changing my API Gateway, but it's not working...
First, ensure you have an [API Gateway Deployment resource](https://www.terraform.io/docs/providers/aws/r/api_gateway_deployment.html). 

The deployment resource will only be built if the *deployment* resource itself changes. It does not automatically detect that the associates API Gateway resources have been updated. So, it's possible that your API changes have been applied, but not deployed yet. The [API Gateway](../infrastructure/api-gateway.md#Deployments) article has a workaround for this.