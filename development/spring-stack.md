# Spring Stack
Spring is an enterprise Java framework for enterprise enterprises.

:::warning WIP
This stack is a work in progress.
:::

## Stack
Spring provides many useful components, but you need to explicitly add them to the project.

:::tip The Administrative Systems Seal of Approval
These serve as a good set of "default" options for things.

There may be use-cases where something else is better, but unless & until a justification can be made to use something else, you should draw from this list. 

Using the same libraries will allow AS developers to transfer between projects more easily, as technical competencies developed in one project will be transferrable to other projects.
:::

| Package                                                                                                | Purpose                              | 
|--------------------------------------------------------------------------------------------------------|--------------------------------------| 
| AWS ECS Fargate                                                                                        | Server platform                      |
| Docker                                                                                                 | Release artifact                     |
| AWS DynamoDB                                                                                           | Document DB, session store, cache    |
| PostgreSQL *(available as Aurora Serverless RDS for PostgreSQL on AWS)*                                | Relational DB                        |
| [Spring Boot](https://spring.io/projects/spring-boot)                                                  | Web application framework            |