# Designing Apps for the Cloud
Heroku, one of the earliest cloud providers, came up with a set of principles for application architecture: [the Twelve-Factor App](https://12factor.net/).

> The twelve-factor methodology can be applied to apps written in any programming language, and which use any combination of backing services (database, queue, memory cache, etc).

All developers should review [the Twelve-Factor App](https://12factor.net/) and strictly adhere to its principles. They are applicable to serverless apps, server-ful apps, and traditional on-prem apps.

## Serverless vs. Serverful
When designing your application for the cloud, one of the biggest choices you can make is serverless vs. a more traditional model. 

AWS has [a page dedicated to extolling the virtues of their serverless platform](https://aws.amazon.com/serverless/). These benefits come with tradeoffs. For example:

- Lambda's maximum execution time is 15 minutes; longer-running work is unsuitable
- API Gateway requests time out after 29 seconds; long-running API calls are unsuitable

:::warning Design for the Limits
When choosing a AWS serverless service, you **must** research the limits outlined in that service's documentation.

Consider how your application will interact with these limits. If you have an asynchronous process using Lambda that merges PDFs, how can you guarantee it will complete its work within the 15-minute run period? If it exceeds the limit, how can your app gracefully handle the failure?

Most AWS services have a 'Requirements and Restrictions' (or similar) section that will document the limitations.
:::

There are also things that are *different* in a serverless model -- not necessarily better/worse, but may make shifting an on-prem application to serverless challenging. 

As an example: your on-prem application may assume [ghostscript](https://www.ghostscript.com/) is installed on its app server. Whenever a user uploads a file, you use ghostscript to build an "All Documents" download that compiles the new doc with several other ones, then store the file. In a serverless approach, this model doesn't work: we can't install utilities on the Lambda runtime, and Lambdas do not have persistent file storage. You would instead upload the file to S3, which could trigger a separate process that compiles the PDFs.

For new projects, Administrative Systems prefers serverless: the time we save by outsourcing OS patching & other traditional cyberinfrastructure work to Amazon is more time to spend on our applications.
The EACD-CloudOps team & Northwestern's AWS account team are both happy to help determine if serverless is an appropriate choice for your app.