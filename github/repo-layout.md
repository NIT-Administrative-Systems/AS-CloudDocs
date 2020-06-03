# Repository Structure
The folder structure of your repository will be determined by your choice of programming language or framework. In all cases, we recommend strictly adhering to any of the language/framework's recommended practices.

For pure IaC repositories, you are expected to follow the [AS Terraform Module standards](../iac/as-tf-modules.md).

There are a some files that will be common to most repositories. We recommend:

- Creating a `.github/` folder with
    - A [`CODEOWNERS` file](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners) with your leads group as the owner of all files
    - At least one pull [request template](https://help.github.com/en/github/building-a-strong-community/creating-a-pull-request-template-for-your-repository)
    - A [`dependabot.yml` file](https://help.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates)
- Creating a `.jenkins/` folder to hold all `Jenkinsfile`s
- Creating a `README.md` file at the project root that contains information about the tech stack & steps for running a development environment

In cases where you need a small IaC module in an application repository, you should create an `iac/` folder and follow the [AS Terraform Module standards](../iac/as-tf-modules.md) inside of it.

## Templates
The CODEOWNERS file should look like this, replacing the team name with your team's leads. You can customize this further, if specific files or directories would have a different owner:

```
*   @NIT-Administrative-Systems/eacd-leads
```

A good pull request template will give developers guidance on what is expected from them. This is an example, and should be customized for your project's needs:

```md
## Overview
<!-- Briefly describe the what & why for this PR. -->

## Checklist
<!-- This is here to help you. Make sure you've done all of the below: -->
- [ ] Adds/updates tests
- [ ] Database migrations tested (up & down)
```

The Dependabot configuration file will vary depending on what technologies you use in the project. You should refer to [their documentation](https://help.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates) when creating this file, but here is a template for a PHP app that has both a `composer.json` (PHP) and `package.json` (NodeJS) file at the root of the repository:

```yaml
version: 2
updates:
- package-ecosystem: composer
  directory: "/"
  schedule:
    interval: daily
    time: '11:00'
  open-pull-requests-limit: 10
- package-ecosystem: npm
  directory: "/"
  schedule:
    interval: daily
    time: '11:00'
  open-pull-requests-limit: 10
```