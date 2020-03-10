# Databases
AWS has [a number of options for databases](https://aws.amazon.com/products/databases/), beyond even what this article will address. When choosing from the options below, or other AWS services not covered, there are two key things to consider:

- Being mindful of the limitations Amazon imposes, *especially* for their serverless products
- Ensuring that you have an appropriate backup strategy in place

## DynamoDB
[DynamoDB](https://aws.amazon.com/dynamodb/) is a serverless NoSQL key-value & document store. When used correctly, it can automatically scale to handle extreme amounts of both traffic and data. There is very little set-up required, and AWS will manage backups & restorations for you.

You should not think of it as a cheap drop-in replacement for an RDBMS; it is fundementally different. DynamoDB is not a good fit if you need to do a rich faceted search or query relational data.

Dynamo tables have two billing modes: you can pay-per-request, or you can reserve read & write capacity units and receive a consistent monthly bill. For all of our applications so far, the per-per-request option has been adequate.

There are a number of restrictions that need to be factored in to your table design when building your application: Dynamo lets you have one primary key (composed of a partition key & sort key), and a limited number of [secondary indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html). You need to get these indexes right when you are creating the table initially; modifying these once you have data is a complicated process that significant engineering time will be spent on.

[Forrest Brazeal wrote about converting a relational database to DynamoDB](https://www.trek10.com/blog/dynamodb-single-table-relational-modeling/), which illustrates some of the limitations of DynamoDB.

> DynamoDB is a powerful tool when used properly, but if you don’t know what you’re doing it’s a deceptively user-friendly guide into madness.

You should avoid doing [table scans](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html) with DynamoDB. While scan queries support filtering, the filter is applied *after* the table scan -- so you are paying the full cost of reading all records before any filtering is applied. Repeatedly doing a scan against a table with thousand of rows will be expensive.

To summerize, the AS recommendations for DynamoDB are:

- Only use this if you have a deep understanding of your data access patterns 
- Use pay-per-request until you have a demonstrated need to reserve capacity units
- Enable point-in-time recovery

## Relational Database Service (RDS)
Amazon RDS has all your favorite flavours of RDBMS, plus Aurora with both MySQL & Postgres compatability. RDS is an always-on service; even its serverless offering has a non-trivial cost.

As a general recommendation, you should select Aurora Postgres for your RDBMS. If you are working with an existing application or open-source/vendor product that requires MySQL, that is an acceptable option as well. MS SQL Server is available and may be chosen if an application requires it, but additional license costs are rolled in to the price.

Northwestern's Oracle license does not cover DBs running on AWS. While RDS offers Oracle, we do not use it under any circumstances.

Aurora is a proprietary Amazon-developed RDBMS backend, which then has Postgres/MySQL as the "front end". To developers and applications, Aurora is indistinguishable from a normal database. Behind the scenes, [data durability things](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html) are happening.

### Traditional RDS
The traditional (as opposed to serverless) RDS product allows you to choose your EC2 size. Amazon has a DB-optimized series of compute nodes, and you build your cluster from these plus storage. You have a high degree of flexibility and customization for your DB config. For example, AWS supports [most popular Postgres extensions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts.General.FeatureSupport.Extensions.11x) out of the box, and these can be added to your database.

With traditional RDS, developers will still be involved in DBA work: maintenance windows must be scheduled for reboots, config changes, certificate updates, and migration from unhealthy compute. These tasks are infrequent and easy to complete if the developer understands the problem, but they do take time away from [more productive work](../design-for-cloud.md#on-infrastructure).

### Aurora Serverless
Aurora Serverless uses Amazon's compute to power your Aurora RDBMS. It still behaves exactly like a normal Postgres/MySQL database.

For most of our use-cases, there are very few downsides to choosing Aurora RDS over traditional RDS:

- You cannot customize the DB config to the same degree as a traditional RDS database
- Instead of choosing your EC2 instances, you allocate capacity units, which are more difficult to predict when budgeting/cost forecasting

The upsides are compelling:

- No developer involvement in maintenance
- No developer involvement in scaling (beyond setting a minimum/maximum)
- DBs that are not being used can be configured to scale down to 0 capacity units

### Traditional vs. Serverless
Amazon recommends the `db.m5.large` instance type for a dev/QA RDS. Ignoring storage, this is ~$83/m for compute. You would ideally want two compute instances in QA/prod to avoid as much downtime as possible in your application, bringing the total for dev/qa/prod up to ~$420/month.

You can use smaller compute notes for RDS, like a `db.t3.medium`. If you were to use these for dev/QA and keep the `db.m5.large` for production, your compute costs would be around $278.44/m.

The minimum capacity units for an RDS Aurora Serverless DB is two, which will cost ~$87/month if run non-stop. You should be able to configure your dev/QA environments to stop when idle, costing nothing outside of business hours. With production being the only always-on environment, the total for dev/qa/prod should be $174/month.

### Summary
To summarize, the AS recommendations for RDS are:

- Use this anywhere you'd use a relational DB
- RDS Aurora Serverless should be used unless you need additional control over your DB
- Configure your Aurora Serverless RDS clusters to sleep when they are inactive & verify that is happening
- Enable automated backups & set an appropriate retention period