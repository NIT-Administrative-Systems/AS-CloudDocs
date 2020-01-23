# Overview
Welcome to the Northwestern IT Administrative Systems cloud documentation. This site is a resource for Administrative Systems staff who are building & operating applications in the cloud as part of our greater [NUIT cloud initatives](https://www.cloud.northwestern.edu/).

## Purpose
The purpose of this site is to document requirements, recommendations, and best practices for Administrative Systems' cloud applications. 

It will explain specific practices for cloud-native app architetcure, lift & shifts for legacy workloads, CI/CD, version control, IaC, and operations. This is not intended to replace training for cloud providers or tools.

To foster collaboration between other IT groups, both inside Northwestern & with other universities, this website is a public resource.

## Terminology
| Term                                                     | Other Terms               | Definition                                                                           | 
|----------------------------------------------------------|---------------------------|--------------------------------------------------------------------------------------| 
| Infrastructure as Code (IaC)                             | Terraform, CloudFormation | Code that declares what cloud resources you want & how they connect together.        | 
| Continuous Integration (CI) / Continuous Deployment (CD) | *n/a*                     | The practice of running automated tests / deployments whenever your code is updated. | 

## Contributing
Pull requests are welcome! This site is mostly just markdown files, so it's easy to modify & preview right on GitHub. The site is built on [VuePress](https://vuepress.vuejs.org/).

The fastest way to contribute is by clicking the 'Edit Page' link at the bottom of a page. This will bring you directly to GitHub with an editor open.

For more involved changes, you can run a local copy of the website. You will need node and yarn:

```sh
yarn install
yarn run docs:dev
```