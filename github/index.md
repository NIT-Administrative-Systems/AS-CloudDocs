# Overview
The [NIT-Administrative-Systems](https://github.com/NIT-Administrative-Systems) GitHub organization is maintained by the Cloud Services & Integration team. It is available to all staff in Administrative Systems. It is part of the [Northwestern enterprise](https://github.com/enterprises/northwestern-university), which is where most of the billing takes place.

:::warning Non-AS Staff
Before Northwestern signed the enterprise agreement, this org was used by all of NUIT.

Non-AS staff are being migrated to their own organizations in an ongoing process. You may still see some non-AS projects here.
:::

Git is a free tool for version control. GitHub offers hosting for git repositories and a number of value-added features.

## Access
If you need access to GitHub, your manager or supervisor should open a ticket in TeamDynamix for `NUIT-AS-ADO-EACD-Cloud-Services-and-Integrations`. If there are any special needs for access, please include those in the ticket. AS isn't that large and CSI will give them appropriate access based on the org chart.

Our GitHub organization does not use SSO yet. Everybody must create an account and enable 2FA to join the organization. 

:::tip GitHub Username
Years ago, we asked people to create GitHub accounts with their netID as their username.

**This is no longer necessary**. 

You may join the organization with any username. If it is not obvious from your username who you are, please put your name in your profile. This makes it easy for others to find & tag you. 

If you already have an account for personal use, you are welcome to join the organization with it. To avoid flooding your personal email inbox, you should add your Northwestern email address [update your notification settings](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications#choosing-where-your-organizations-email-notifications-are-sent) so NIT-Administrative-Systems emails only go there. 
:::

### Team Structure
The team structure in GitHub roughly mirrors the organizational chart. 

At the lowest nodes on the chart are teams of contributors. In GitHub, these will be split into two teams: the team itself (e.g. `EACD-CSI`), and a corresponding leads group (e.g. `EACD-CSI-Leads`). The leads group can be used as a default for reviewing pull requests, and receives admin rights on their repositories.

If your team wants to deviate from our default structure, open a ticket in TeamDynamix for `NUIT-AS-ADO-EACD-Cloud-Services-and-Integrations` and describe your ideal setup. They will be able to configure it for you. 

## Services
Beyond the obvious parts of GitHub -- hosting git & code review tools -- there are several premium services that we want to draw attention to:

- [GitHub Private Pages](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site), which allows you to deploy a static site available only to people with access to the repository. This is a fantastic tool to combine with VuePress for technical documentation.
- [GitHub Actions](https://github.com/features/actions), a CI/CD tool similar to Jenkins. We have a large pool of complimentary GitHub Actions capacity for you to take advantage of.

## Tools
You can engage with GitHub with any git client -- the `git` CLI tool, integrations built-in to your IDE, Tortoise, or anything else. There are a huge number of options.

If you need a recommendation: [GitHub Desktop](https://desktop.github.com/) is excellent. It supports performing most git operations in the UI[^5] and integrates with the GitHub site itself. You can quickly add new repositories to it with a one-click button on GitHub.com, and the GitHub Desktop client is aware of pull requests, CI/CD checks, etc.

[^5]: Including advanced operations, like interactive rebases.

## Training
Here are some recommended training resources for Git & GitHub:

- [Atlassian's 'Learn Git' guide](https://www.atlassian.com/git/tutorials/what-is-version-control) is a good introduction to using git
  - The Beginner, Getting Started, and Collaborating sections are the most relevant. Their training is in support of BitBucket, a similar product to GitHub -- but these three sections focus on git itself.
- [GitHub Skills](https://skills.github.com/) has training for pull requests, GitHub Actions, and other features of GitHub.com