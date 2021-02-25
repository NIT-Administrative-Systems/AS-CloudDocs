# Application Patterns
These are case studies for successful application architectures on the cloud. If you are developing a brand new app, one of these cases should get you started off on the right path.

We are making an effort to standardize around a small number stacks & patterns so it is easier for developers to work cross-team. These patterns adhere to our [design principles](./design-principles.md).

| Pattern                         | Language | Platforms               |
|---------------------------------|----------|-------------------------|
| [Laravel](./laravel-stack.md)   | PHP      | On-prem, AWS Serverless |
| [ExpressJS](./express-stack.md) | NodeJS   | AWS Serverless          |
| [Spring](./spring-stack.md)     | Java     | AWS Fargate             |

These patterns should define their frontend tools, but there is some flexibility based on use-case. Regardless of stack, developers should familarize themselves with the [frontend stack options](frontend-stacks.md), because JavaScript is omnipresent.

## Infrastructure & MASA Apps
We always want to expose an application's data via an API. This will allow other Northwestern developers to create [mashup-](https://en.wikipedia.org/wiki/Mashup_(web_application_hybrid)) or [MASA-](https://www.gartner.com/document/3980382) style applications, aggregating data from several sources to create something tailored to their audience. 

For example, a college's IT group may wish to build a homepage aggregating directory information for their faculty plus open faculty positions -- sets of data that traditionally come from very different systems. If both of these systems expose themselves with APIs, it's only a matter of browsing the API Service Registry for appropriate services and getting approval from the data owners.

An increasing number of our own applications follow this pattern. Here is a full infrastructure diagram for applications built this way: on the left is a dedicated API, written in NodeJS, that accesses an on-prem Oracle database. This database is a system-of-record, fully exposed (read & write) through a serverless API.

On the right is a Laravel Vapor app that serves as a UI. It interacts with the database exclusively through the NodeJS API.

![Frontend w/ API backend](../assets/laravel-infra.png)

All of the services attached to the Laravel app are automatically wired up by Vapor.  You do not need to think about setup for any of these services; just use the relevant framework features.

- Firing events or dispatching asynchronous jobs will write data to SQS and trigger additional Lambda executions
- Static assets are automatically deployed to CloudFront & the CDN domain injected into your views
- The cache (which includes Laravel sessions) uses DynamoDB by default
- The [scheduler](https://laravel.com/docs/8.x/scheduling) is set up with a CloudWatch scheduled event
- An optional S3 bucket for application data & file uploads can be opted in to from the `vapor.yml` config file

In the above example, there is no database for the Laravel UI and only one backing API. This is only done to create a simple diagram. If you want to store your own data or annotate data from another service, add a DB to your Laravel app, or grab data from another API. If you create data mash-ups, you should consider exposing these with your own API built on top of the Laravel app and register them in the API Service Registry for other developers to utilize.