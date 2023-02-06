import{_ as i,M as o,p as l,q as d,R as e,t as a,N as n,V as c,a1 as t}from"./framework-bf3e1922.js";const u={},p=e("h1",{id:"databases",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#databases","aria-hidden":"true"},"#"),a(" Databases")],-1),h={href:"https://aws.amazon.com/products/databases/",target:"_blank",rel:"noopener noreferrer"},m=e("ul",null,[e("li",null,[a("Being mindful of the limitations Amazon imposes, "),e("em",null,"especially"),a(" for their serverless products")]),e("li",null,"Ensuring that you have an appropriate backup strategy in place"),e("li",null,"Cost")],-1),b=e("h2",{id:"dynamodb",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#dynamodb","aria-hidden":"true"},"#"),a(" DynamoDB")],-1),g={href:"https://aws.amazon.com/dynamodb/",target:"_blank",rel:"noopener noreferrer"},v=e("p",null,"You should not think of it as a cheap drop-in replacement for an RDBMS; it is fundementally different. DynamoDB is not a good fit if you need to do a rich faceted search or query relational data.",-1),f=e("p",null,"Dynamo tables have two billing modes: you can pay-per-request, or you can reserve read & write capacity units and receive a consistent monthly bill. For all of our applications so far, the pay-per-request option has been adequate.",-1),y={href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html",target:"_blank",rel:"noopener noreferrer"},w={href:"https://www.trek10.com/blog/dynamodb-single-table-relational-modeling/",target:"_blank",rel:"noopener noreferrer"},_=e("blockquote",null,[e("p",null,"DynamoDB is a powerful tool when used properly, but if you don’t know what you’re doing it’s a deceptively user-friendly guide into madness.")],-1),k={href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html",target:"_blank",rel:"noopener noreferrer"},S=e("em",null,"after",-1),D=e("p",null,"To summerize, the AS recommendations for DynamoDB are:",-1),A=e("ul",null,[e("li",null,"Only use this if you have a deep understanding of your data access patterns"),e("li",null,"Use pay-per-request until you have a demonstrated need to reserve capacity units"),e("li",null,"Enable point-in-time recovery")],-1),q=e("h2",{id:"relational-database-service-rds",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#relational-database-service-rds","aria-hidden":"true"},"#"),a(" Relational Database Service (RDS)")],-1),R=e("p",null,"Amazon RDS has all your favorite flavours of RDBMS, plus Aurora with both MySQL & Postgres compatability. RDS is an always-on service; even its serverless offering has a non-trivial cost.",-1),x=e("p",null,"As a general recommendation, you should select Aurora Postgres for your RDBMS. If you are working with an existing application or open-source/vendor product that requires MySQL, that is an acceptable option as well. MS SQL Server is available and may be chosen if an application requires it, but additional license costs are rolled in to the price.",-1),B=e("p",null,"Northwestern's Oracle license does not cover DBs running on AWS. While RDS offers Oracle, we do not use it under any circumstances.",-1),z={href:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html",target:"_blank",rel:"noopener noreferrer"},T=e("h3",{id:"traditional-rds",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#traditional-rds","aria-hidden":"true"},"#"),a(" Traditional RDS")],-1),P={href:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts.General.FeatureSupport.Extensions.11x",target:"_blank",rel:"noopener noreferrer"},M=t('<h3 id="aurora-serverless" tabindex="-1"><a class="header-anchor" href="#aurora-serverless" aria-hidden="true">#</a> Aurora Serverless</h3><p>Aurora Serverless uses Amazon&#39;s compute to power your Aurora RDBMS. It still behaves exactly like a normal Postgres/MySQL database.</p><p>For most of our use-cases, there are very few downsides to choosing Aurora RDS over traditional RDS:</p><ul><li>You cannot customize the DB config to the same degree as a traditional RDS database</li><li>Instead of choosing your EC2 instances, you allocate capacity units, which are more difficult to predict when budgeting/cost forecasting</li></ul><p>The upsides are compelling:</p><ul><li>No developer involvement in maintenance</li><li>No developer involvement in scaling (beyond setting a minimum/maximum)</li><li>DBs that are not being used can be configured to scale down to 0 capacity units</li></ul><p>There seems to be only one major downside:</p><ul><li>Serverless does not support backing up to, or restoring from, S3 buckets.</li></ul><h3 id="backups-and-security" tabindex="-1"><a class="header-anchor" href="#backups-and-security" aria-hidden="true">#</a> Backups and Security</h3><p>Aurora Serverless comes with more safety features out of the box than RDS, with 6 data copies spread across 3 availability zones (AZ) and automatic backups to an S3 bucket. If an AZ goes down, Aurora will automatically recreate the database instance in another zone. Snapshots sent to the S3 are stored in Parquet format. Data can be recovered from this S3 bucket through creating a new Aurora cluster. Aurora also has faster replication than RDS and more replicas, 15, compared to RDS&#39;s 5. Both Aurora and RDS have failover, but due to Aurora&#39;s read replicas no last minute data is lost with Aurora while RDS may incur some data loss.</p><p>By default, Aurora does not enable performance insights and monitoring. Default backup retentions (point-in-time recovery) for RDS instances under Aurora is 7 days (1 day backup retention is free).</p><p>RDS databases within an Aurora cluster can have Deletion Protection enabled, preventing the database from being deleted accidentally. To delete the database, the Aurora cluster itself must be modified and Deletion Prevention turned off.</p><h3 id="traditional-vs-serverless" tabindex="-1"><a class="header-anchor" href="#traditional-vs-serverless" aria-hidden="true">#</a> Traditional vs. Serverless</h3><p>Amazon recommends the <code>db.m5.large</code> instance type for a dev/QA RDS. Ignoring storage, this is ~$83/m for compute. You would ideally want two compute instances in QA/prod to avoid as much downtime as possible in your application, bringing the total for dev/qa/prod up to ~$420/month.</p><p>You can use smaller compute notes for RDS, like a <code>db.t3.medium</code>. If you were to use these for dev/QA and keep the <code>db.m5.large</code> for production, your compute costs would be around $278.44/m.</p><p>The minimum capacity units for a postgres RDS Aurora Serverless DB is two, which will cost ~$87/month if run non-stop. You should be able to configure your dev/QA environments to stop when idle, costing nothing outside of business hours. With production being the only always-on environment, the total for dev/qa/prod should be $174/month.</p><p>Both traditional and serverless RDS have an HTTP endpoint that can be enabled to allow web services to interface with your database/cluster. This can be used to run SQL statements without managing connections as well as integrate with other AWS services (e.g. Lambda) without needing to configure the service within the same Virtual Private Cloud (VPC) as your database/cluster.</p><h3 id="summary" tabindex="-1"><a class="header-anchor" href="#summary" aria-hidden="true">#</a> Summary</h3><p>To summarize, the AS recommendations for RDS are:</p><ul><li>Use this anywhere you&#39;d use a relational DB</li><li>RDS Aurora Serverless should be used unless you need additional control over your DB</li><li>Configure your Aurora Serverless RDS clusters to sleep when they are inactive &amp; verify that is happening</li><li>Enable automated backups &amp; set an appropriate retention period</li></ul><h3 id="aurora-serverless-maintenance-policy" tabindex="-1"><a class="header-anchor" href="#aurora-serverless-maintenance-policy" aria-hidden="true">#</a> Aurora Serverless Maintenance Policy</h3><p>When spinning up an Aurora serverless RDS cluster, be aware of the following limitations. Below is currently only for Postgresql.</p>',22),E=e("li",null,"Minor Upgrades: Minor upgrades will be performed automatically during the specified maintenance window. Minor Postgresql version updates will cause a 20-30 second downtime during the maintenance window. Database engine upgrades should have no downtime.",-1),L={href:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.html",target:"_blank",rel:"noopener noreferrer"},I=t("<li>Terraform tags: <ul><li><code>allow_major_version_upgrade</code> is set to false by default. Enabling this allows major engine upgrades when changing engine versions.</li><li><code>apply_immediately</code> is set to false by default. If false, any modifications to the cluster are made during the next maintenance window.</li><li><code>engine_version</code> does not need to be explicitly set. Defaults to most recent Aurora PostgreSQL engine version, which is the only choice for serverless RDS. Stored in tfstate file, so if a major upgraded is needed, this will need to be manually set with <code>allow_major_version_upgrade</code> set to true for the next deployment.</li><li><code>preferred_backup_window</code> will default to a random 30-minute window selected at random from an 8 hour block of time per region</li><li><code>preferred_maintenance_window</code> seems to follow the same rules as above, a random 30-minute interval if left unspecified</li></ul></li>",1),N=t(`<h3 id="monitoring-aurora-serverless-events-in-cloudwatch" tabindex="-1"><a class="header-anchor" href="#monitoring-aurora-serverless-events-in-cloudwatch" aria-hidden="true">#</a> Monitoring Aurora Serverless events in CloudWatch</h3><p>To enable log monitoring with cloudwatch, an RDS cluster parameter group will need to be created and assigned to your cluster, this can be done with terraform. The following log types can be published: audit, error, general, and slow query logs.</p><p>For example, for PostgreSQL:</p><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre class="language-hcl"><code><span class="token keyword">resource <span class="token type variable">&quot;aws_rds_cluster_parameter_group&quot;</span></span> <span class="token string">&quot;my_group&quot;</span> <span class="token punctuation">{</span>
    <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">&quot;rds-cluster-pg&quot;</span>
    <span class="token property">family</span> <span class="token punctuation">=</span> <span class="token string">&quot;aurora-postgresql10&quot;</span>

    <span class="token keyword">parameter</span> <span class="token punctuation">{</span>
        <span class="token comment"># note, the AWS docs use &quot;log_statements&quot; but the parameter in the console reads &quot;log_statement&quot; so both might work or the docs may have a typo</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">&quot;log_statement&quot;</span> 
        <span class="token property">value</span> <span class="token punctuation">=</span> <span class="token string">&quot;all&quot;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Then, just set the <code>db_cluster_parameter_group_name</code> argument within your RDS cluster.</p><p>If you have already created a cluster without a custom parameter group, it will be assigned to a default parameter group where no logs are sent to CloudWatch. Switching from a default parameter group to a custom parameter group will apply the changes to to each new DB isntance that&#39;s added to the serverless cluster. This is a &quot;seamless scale&quot; so there should be no downtime, but there may be dropped connections if no scaling point can be found during the scaling period. Likewise, if you need to make modifications to specific parameters within a custom parameter group, changes to dynamic parameters will be applied immediately whereas changes to static parameters will be applied during the next maintenance window unless <code>apply_immediately</code> is set to true. If applied immediately, there will be downtime as the static parameter changes are applied.</p><h3 id="rds-event-subscription" tabindex="-1"><a class="header-anchor" href="#rds-event-subscription" aria-hidden="true">#</a> RDS Event Subscription</h3>`,7),W={href:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.Messages.html",target:"_blank",rel:"noopener noreferrer"},C=t(`<div class="hint-container warning"><p class="hint-container-title">Note</p><p>One note about OpsGenie Alerts: RDS Clusters will NOT trigger RDS integrations, only RDS instances will. Instead, use regular SNS integrations for serverless clusters. As of 7/7/21 OpsGenie does not have this information in their documentation.</p></div><p>An example:</p><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre class="language-hcl"><code><span class="token keyword">resource <span class="token type variable">&quot;aws_db_event_subscription&quot;</span></span> <span class="token string">&quot;SUBSCRIPTION_NAME&quot;</span> <span class="token punctuation">{</span>
<span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">&quot;rds-event-subscription&quot;</span>
<span class="token property">sns_topic</span> <span class="token punctuation">=</span> OPS_GENIE_ARN

<span class="token comment"># could also use db-parameter-group, db-security group, db-instance, db-snapshot, db-cluster-snapshot or leave blank to subscribe to all sources</span>
<span class="token property">source_type</span> <span class="token punctuation">=</span> <span class="token string">&quot;db-cluster&quot;</span>        
<span class="token property">source_ids</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>aws_rds_cluster.CLUSTER_NAME.id<span class="token punctuation">]</span> 

<span class="token comment"># these are all event categories for a cluster source type </span>
<span class="token property">event_categories</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;configuration change&quot;</span>,   <span class="token comment"># probably not necessary</span>
    <span class="token string">&quot;creation&quot;</span>,               <span class="token comment"># probably not necessary</span>
    <span class="token string">&quot;deletion&quot;</span>,               <span class="token comment"># business hours alert</span>
    <span class="token string">&quot;failover&quot;</span>,               <span class="token comment"># business hours alert</span>
    <span class="token string">&quot;failure&quot;</span>,                <span class="token comment"># 24/7 alert</span>
    <span class="token string">&quot;global-failover&quot;</span>,        <span class="token comment"># business hours alert</span>
    <span class="token string">&quot;maintenance&quot;</span>,            <span class="token comment"># business hours alert</span>
    <span class="token string">&quot;notification&quot;</span>            <span class="token comment"># business hours alert</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3);function Q(U,O){const s=o("ExternalLinkIcon"),r=o("RouterLink");return l(),d("div",null,[p,e("p",null,[a("AWS has "),e("a",h,[a("a number of options for databases"),n(s)]),a(", beyond even what this article will address. When choosing from the options below, or other AWS services not covered, there are three key things to consider:")]),m,b,e("p",null,[e("a",g,[a("DynamoDB"),n(s)]),a(" is a serverless NoSQL key-value & document store. When used correctly, it can automatically scale to handle extreme amounts of both traffic and data. There is very little set-up required, and AWS will manage backups & restorations for you.")]),v,f,e("p",null,[a("There are a number of restrictions that need to be factored in to your table design when building your application: Dynamo lets you have one primary key (composed of a partition key & sort key), and a limited number of "),e("a",y,[a("secondary indexes"),n(s)]),a(". You need to get these indexes right when you are creating the table initially; modifying these once you have data is a complicated process that significant engineering time will be spent on.")]),e("p",null,[e("a",w,[a("Forrest Brazeal wrote about converting a relational database to DynamoDB"),n(s)]),a(", which illustrates some of the limitations of DynamoDB.")]),_,e("p",null,[a("You should avoid doing "),e("a",k,[a("table scans"),n(s)]),a(" with DynamoDB. While scan queries support filtering, the filter is applied "),S,a(" the table scan -- so you are paying the full cost of reading all records before any filtering is applied. Repeatedly doing a scan against a table with thousand of rows will be expensive.")]),D,A,q,R,x,B,e("p",null,[a('Aurora is a proprietary Amazon-developed RDBMS backend, which then has Postgres/MySQL as the "front end". To developers and applications, Aurora is indistinguishable from a normal database. Behind the scenes, '),e("a",z,[a("data durability things"),n(s)]),a(" are happening.")]),T,e("p",null,[a("The traditional (as opposed to serverless) RDS product allows you to choose your EC2 size. Amazon has a DB-optimized series of compute nodes, and you build your cluster from these plus storage. You have a high degree of flexibility and customization for your DB config. For example, AWS supports "),e("a",P,[a("most popular Postgres extensions"),n(s)]),a(" out of the box, and these can be added to your database.")]),e("p",null,[a("With traditional RDS, developers will still be involved in DBA work: maintenance windows must be scheduled for reboots, config changes, certificate updates, and migration from unhealthy compute. These tasks are infrequent and easy to complete if the developer understands the problem, but they do take time away from "),n(r,{to:"/design-for-cloud.html#on-infrastructure"},{default:c(()=>[a("more productive work")]),_:1}),a(".")]),M,e("ul",null,[E,e("li",null,[a("Major upgrades: "),e("a",L,[a("AWS provides documentation on major upgrades"),n(s)]),a(". Briefly, ensure that the DB instance you're using is compatible with the version of Postgresql you're upgrading to. Make sure you have committed or rolled back any transactions before upgrading. Remove all reg* data types. Back up the database. (create a snapshot of before and after upgrading). Ensure any extensions and data types used in the database are supported by the upgraded version.")]),I]),N,e("p",null,[a("In addition to CloudWatch, RDS event subscriptions can be configured to send alerts to OpsGenie via SNS (or any other service desired). "),e("a",W,[a("A list of events that can be subscribed to can be found here"),n(s)])]),C])}const j=i(u,[["render",Q],["__file","databases.html.vue"]]);export{j as default};