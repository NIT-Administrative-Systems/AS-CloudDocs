## Suggested Learning Path
* [High-level overview of GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)
  - Key Concepts
    * [Workflows](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#workflows) - Automated process, such as build and deploy an application
    * [Events](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#events) - Casue workflows to execute. [Event Types](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) include:
      - Scheduled like CRON 
      - Manually create by clicking a button
      - Triggered by an action ex. opening a pull request
    * [Jobs](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#jobs) - Set of steps comprising a logic unit of work in your process. 
      - Can have more than one in a workflow
      - Can run serially or in parellel 
      - An example might be a job that runs tests
    * [Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#actions) - Custom application that provides functionality, can write your own or use pre-built ones from the [Marketplace](https://github.com/marketplace?type=actions)
    * Step - 
    * [Runners](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#runners) - Server virtua/hosted/on-prem where the workflow is executed
    * [Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) - Sensitive environment variables like passwords, API keys, and tokens.  GitHub provides a mechanism for securely secrets with your source code.  Secrets can be stored at the organization, repository and environment level.  Once created secrets can then be used in your workflows.
    * [Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) - Are collections of settings (allowed branches, secrets, and protection rules.)  An environment in GitHub likely correlates to the environment your workflow will act against.
      - By using a named environment secret you can have a single workflow file, that uses different secrets based on the environment the workflow is executed in.
* [Quickstart](https://docs.github.com/en/actions/quickstart) - Create your first workflow
* [Write your own action](https://lab.github.com/githubtraining/github-actions:-hello-world) - Chances are you will not often need to do this, but understanding how the actions you are using a built will give you a better understanding of how to use them and why something might not work as expected.
* [Continuous Integration](https://lab.github.com/githubtraining/github-actions:-continuous-integration) - This will guide you in creating your first workflow.
* [GitHub Script](https://lab.github.com/githubtraining/github-actions:-using-github-script) - Create a workflow that uses the GitHub script action (more about this below).
---
` `   
` `  

## Comparisons with Jenkins
* Both allow creating custom/reusable functionality. Jenkins often accomplishes this via plug-ins in GitHub they are Marketplace Actions, Composite & Reuasable Workflows
* Both support describing a process in a document that can be checked into source control.  In Jenkins they are called pipelines (Jenkinsfile), GitHub Actions calls them workflows (.gitub/workflows/{your-workflow}.yml)
* Both support timed and manually triggered jobs.  Jenkins can be triggered by checking code into GitHub (and can likely do more via Plug-ins); however, GitHub Actions natively supports a more diverse and granular set of events, and seems better suited for automations
* Both Jenkins and GitHub Actions support "secrets".  GitHub's approach seems more secure.
---
` `   
` `   

## Tips, Resources, & Useful Actions
* [GitHub Checkout Action](https://github.com/actions/checkout) - Checks your code out of your repo so it can be used in your workflow.  Likely you will use this in most workflows.
* [Terraform Setup](https://github.com/hashicorp/setup-terraform) - Sets up the terraform CLI making it easy to execute your IAC
* [GitHub Cache Action](https://github.com/actions/cache) - Allows you to cache artifacts across runs in the same branch.  Useful to speed up your builds.
* [GitHub Script Action](https://github.com/actions/github-script) - Exposes GitHub's RESTful APIs inside a Script block of a workflow "step".  This is very useful for automations
  - [RESTful API documentation](https://docs.github.com/en/rest) - General API documentation
  - [Octokit Documentation](https://github.com/octokit/octokit.js) - NodeJS implementation of GitHub RESTful API.
* [GitHub Action Org](https://github.com/actions/) - Owner of all the GitHub developed repositories containing Actions related code
* [GitHub Actions Documentation](https://docs.github.com/en/actions)
* [Starter/Template Workflows](https://github.com/actions/starter-workflows) - Contains templated workflows for common tasks
* If you add a Repository Secret with the name ACTIONS_STEP_DEBUG and the value of 'true' this will turn on debugging logs for your Workflows.
* YAML is all about indentation, and it is easy to cause yourself headaches due to missing a space.  Use a YAML linter like [this](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) for VSCode
