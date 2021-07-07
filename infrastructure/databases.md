# Databases
AWS has [a number of options for databases](https://aws.amazon.com/products/databases/), beyond even what this article will address. When choosing from the options below, or other AWS services not covered, there are three key things to consider:

- Being mindful of the limitations Amazon imposes, *especially* for their serverless products
- Ensuring that you have an appropriate backup strategy in place
- Cost 
## DynamoDB
[DynamoDB](https://aws.amazon.com/dynamodb/) is a serverless NoSQL key-value & document store. When used correctly, it can automatically scale to handle extreme amounts of both traffic and data. There is very little set-up required, and AWS will manage backups & restorations for you.

You should not think of it as a cheap drop-in replacement for an RDBMS; it is fundementally different. DynamoDB is not a good fit if you need to do a rich faceted search or query relational data.

Dynamo tables have two billing modes: you can pay-per-request, or you can reserve read & write capacity units and receive a consistent monthly bill. For all of our applications so far, the pay-per-request option has been adequate.

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

There seems to be only one major downside:

- Serverless does not support backing up to, or restoring from, S3 buckets.

### Backups and Security
Aurora Serverless comes with more safety features out of the box than RDS, with 6 data copies spread across 3 availability zones (AZ) and automatic backups to an S3 bucket. If an AZ goes down, Aurora will automatically recreate the database instance in another zone. Snapshots sent to the S3 are stored in Parquet format. Data can be recovered from this S3 bucket through creating a new Aurora cluster. Aurora also has faster replication than RDS and more replicas, 15, compared to RDS's 5. Both Aurora and RDS have failover, but due to Aurora's read replicas no last minute data is lost with Aurora while RDS may incur some data loss. 

By default, Aurora does not enable performance insights and monitoring. Default backup retentions (point-in-time recovery) for RDS instances under Aurora is 7 days (1 day backup retention is free). 

RDS databases within an Aurora cluster can have Deletion Protection enabled, preventing the database from being deleted accidentally. To delete the database, the Aurora cluster itself must be modified and Deletion Prevention turned off. 

### Traditional vs. Serverless
Amazon recommends the `db.m5.large` instance type for a dev/QA RDS. Ignoring storage, this is ~$83/m for compute. You would ideally want two compute instances in QA/prod to avoid as much downtime as possible in your application, bringing the total for dev/qa/prod up to ~$420/month.

You can use smaller compute notes for RDS, like a `db.t3.medium`. If you were to use these for dev/QA and keep the `db.m5.large` for production, your compute costs would be around $278.44/m.

The minimum capacity units for a postgres RDS Aurora Serverless DB is two, which will cost ~$87/month if run non-stop. You should be able to configure your dev/QA environments to stop when idle, costing nothing outside of business hours. With production being the only always-on environment, the total for dev/qa/prod should be $174/month.

Both traditional and serverless RDS have an HTTP endpoint that can be enabled to allow web services to interface with your database/cluster. This can be used to run SQL statements without managing connections as well as integrate with other AWS services (e.g. Lambda) without needing to configure the service within the same Virtual Private Cloud (VPC) as your database/cluster. 

### Summary
To summarize, the AS recommendations for RDS are:

- Use this anywhere you'd use a relational DB
- RDS Aurora Serverless should be used unless you need additional control over your DB
- Configure your Aurora Serverless RDS clusters to sleep when they are inactive & verify that is happening
- Enable automated backups & set an appropriate retention period

### Aurora Serverless Maintenance Policy
When spinning up an Aurora serverless RDS cluster, be aware of the following limitations. Below is currently only for Postgresql.

- Minor Upgrades: Minor upgrades will be performed automatically during the specified maintenance window. Minor Postgresql version updates will cause a 20-30 second downtime during the maintenance window. Database engine upgrades should have no downtime. 
- Major upgrades: [AWS provides documentation on major upgrades](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.html). Briefly, ensure that the DB instance you're using is compatible with the version of Postgresql you're upgrading to. Make sure you have committed or rolled back any transactions before upgrading. Remove all reg* data types. Back up the database. (create a snapshot of before and after upgrading). Ensure any extensions and data types used in the database are supported by the upgraded version.  
- Terraform tags:
  - `allow_major_version_upgrade` is set to false by default. Enabling this allows major engine upgrades when changing engine versions. 
  - `apply_immediately` is set to false by default. If false, any modifications to the cluster are made during the next maintenance window.
  - `engine_version` does not need to be explicitly set. Defaults to most recent Aurora PostgreSQL engine version, which is the only choice for serverless RDS. Stored in tfstate file, so if a major upgraded is needed, this will need to be manually set with `allow_major_version_upgrade` set to true for the next deployment.
  - `preferred_backup_window` will default to a random 30-minute window selected at random from an 8 hour block of time per region
  - `preferred_maintenance_window` seems to follow the same rules as above, a random 30-minute interval if left unspecified

### Monitoring Aurora Serverless events in CloudWatch
To enable log monitoring with cloudwatch, an RDS cluster parameter group will need to be created and assigned to your cluster, this can be done with terraform. The following log types can be published: audit, error, general, and slow query logs.

For example, for PostgreSQL:
```hcl
resource "aws_rds_cluster_parameter_group" "my_group" {
    name = "rds-cluster-pg"
    family = "aurora-postgresql10"

    parameter {
        # note, the AWS docs use "log_statements" but the parameter in the console reads "log_statement" so both might work or the docs may have a typo
        name = "log_statement" 
        value = "all"
    }
}
```
Then, just set the `db_cluster_parameter_group_name` argument within your RDS cluster. 

If you have already created a cluster without a custom parameter group, it will be assigned to a default parameter group where no logs are sent to CloudWatch. Switching from a default parameter group to a custom parameter group will apply the changes to to each new DB isntance that's added to the serverless cluster. This is a "seamless scale" so there should be no downtime, but there may be dropped connections if no scaling point can be found during the scaling period. Likewise, if you need to make modifications to specific parameters within a custom parameter group, changes to dynamic parameters will be applied immediately whereas changes to static parameters will be applied during the next maintenance window unless `apply_immediately` is set to true. If applied immediately, there will be downtime as the static parameter changes are applied. 

### RDS Event Subscription
In addition to CloudWatch, RDS event subscriptions can be configured to send alerts to OpsGenie via SNS (or any other service desired). [A list of events that can be subscribed to can be found here](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.Messages.html)

::: warning
One note about OpsGenie Alerts: RDS Clusters will NOT trigger RDS integrations, only RDS instances will. Instead, use regular SNS integrations for serverless clusters. As of 7/7/21 OpsGenie does not have this information in their documentation.
:::

An example:
```hcl
resource "aws_db_event_subscription" "SUBSCRIPTION_NAME" {
name = "rds-event-subscription"
sns_topic = OPS_GENIE_ARN

# could also use db-parameter-group, db-security group, db-instance, db-snapshot, db-cluster-snapshot or leave blank to subscribe to all sources
source_type = "db-cluster"        
source_ids = [aws_rds_cluster.CLUSTER_NAME.id] 

# these are all event categories for a cluster source type 
event_categories = [
    "configuration change",   # probably not necessary
    "creation",               # probably not necessary
    "deletion",               # business hours alert
    "failover",               # business hours alert
    "failure",                # 24/7 alert
    "global-failover",        # business hours alert
    "maintenance",            # business hours alert
    "notification"            # business hours alert
  ]
}
```
