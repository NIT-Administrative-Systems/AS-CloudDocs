# Roles & Responsibilities
There are four groups primarily involved in cloud operations:

- **EACD-CloudOps** represents AS' interests, sets standards for AS infrastructure, creates shared IaC modules, and maintains the GitHub organization
- **PIPS-CloudOps** is responsible for Northwestern's entire AWS account infrastructure, the VPNs back to the datacenters, and maintains the Jenkins servers
- **Lead Developers** are responsible for their applications, application-specific infrastructure, and CI/CD pipelines
- **Developers** create & maintain apps, app-specific infrastructure, and CI/CD pipelines

## RACI
Here is a responsibility assignment matrix that covers common tasks/functions.

- **R**: Responsible, does the work
- **A**: Accountable, assigns/approves the work
- **C**: Consulted, subject matter expects who provide input
- **I**: Informed, kept up-to-date

| *Function*                                                         | EACD-CloudOps | PIPS-CloudOps | Lead Developers | Developers | 
|--------------------------------------------------------------------|---------------|---------------|-----------------|------------| 
| Submit requests for new staff access to cloud resources            |               |               | AR              |            | 
| Approve & process requests for new staff access to cloud resources | A             | R             | I               |            | 
| Remove staff access to cloud resources                             | A             | R             | C               |            | 
| Jenkins server (EC2 & Jenkins service) maintenance                 | C             | A             | I               | I          | 
| Jenkins plugin maintenance                                         | A             | C             | I               | I          | 
| Creating Jenkins jobs (unconfigured) & setting permissions         | AR            |               | C               | I          | 
| Writing & maintaining Jenkins pipelines                            | C             |               | A               | R          | 
| VPC & VPN set-up/maintenance                                       | C             | AR            | C               | I          | 
| Assigning subnets for applications                                 | A             |               | I               | I          | 
| Maintaining shared AWS resources (e.g. ALB, SES)                   | A             |               | I               | I          | 
| Creating & maintaning application IaC                              | C             |               | A               | R          | 
| Reviewing pull requests affecting IaC                              | C             |               | AR              | I          | 
| Reviewing pull requests for applications                           |               |               | AR              | I          | 
| Application deployments                                            |               |               | A               | R          | 

