# Design Principles
These are general principles you should adhere to when developing applications, even for our on-prem applications.

All developers should review the [Twelve-Factor App](https://12factor.net/) and strictly adhere to its principles. They are applicable to serverless apps, server-ful apps, and traditional on-prem apps.

## Development Environment
Every project must have clear instructions in its README file for developers to set up a local copy of the app. 

These local copies should be independent of other DBs & services, to the greatest extent possible. If an application heavily replies on its database, the instructions should cover setting up your own database. If it relies heavily on an API, the instructions should cover setting up their own environment with the 3rd party, or the app should include a mocked service.

In most frameworks, things like file storage have swappable drivers. You can swap an S3 driver for a local file system driver. DynamoDB has a [downloadable local version](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html). If the SSM parameter store is not already injecting app config as environment variables, you can mock out your configuration loader with an ini file.

## Connectivity Failures
Services outages & network connectivity issues are an problem that we will increasingly see; our applications reach out to other AWS services, on-campus resources, Apigee, and other 3rd-party APIs. Applications must do their best to handle temporary failures.

If a resource is critical to the application and is down, the app should display a meaningful error page. There must be monitoring in place to alert somebody that the application is down.

When calling an API, developers should always include re-try logic. Temporary network failures can typically be mitigated with an immediate re-try. Some HTTP clients allow you to attach middleware to automatically do this. Some frameworks include a retry function that will catch exceptions and make more attempts before letting the exception through to your code.

## APIs & Messaging
Applications must not reach into other app' DBs to pull data out -- instead, they should be consuming data from other applications through APIs or messaging.

You should use messaging to alert other applications (or be alerted) to events. Since some applications may wait and read messages in batches, messages should include the minimum amount of data possible -- information in messages left sitting can become stale if users update it or cancel the action that triggered a message. The consumer should request more information by calling an API to guarantee they are receiving the most up-to-date data.

Applications must never auto-acknowledge messages. Messages should only be acknowledges once the application has dealt with them. Otherwise, messages can be lost when an unexpected exception or crash occurs.

Talking to other applications via messaging de-couples our applications from each other. In the past, when the HR database is taken down for maintenance, it would impact other application. With messaging, if the HR system is unavailable, the messages can sit in queue until HR is available again.