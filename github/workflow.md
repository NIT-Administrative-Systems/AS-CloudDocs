# Workflow
There are many ways to use Git & GitHub. AS has tried several branching/merging workflows, and concluded that the workflow explained below best meets our needs. 

This workflow is intended for use with medium-to-large repositories that utilize CI/CD tools. For very small projects, you may decide to omit sections involving sub-production environment branches -- this is a decision best made by the leads responsible for the project. The workflow assumes that [our requirement to enable branch protection](./settings-permissions.md#branch-protection) for branches deployed automatically has been followed.

## Process
The process should be familiar if you have used git before: developers will create a branch for their work (known as a *topic branch*), commit to the branch, and then submit a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) (PR) to the dev environment. The leads group for the project will review the changes and provide either feedback or approval. The developer can then merge the PR into the dev branch. This merge should trigger a deployment to the dev environment.

In addition to the dev branch, our projects will typically have a QA and production branch. To promote code to these environments, you can repeat the PR process for the QA/production branches. For bigger projects, you may find managing dozens of topic branches difficult -- as an alternative, you can PR the dev branch to QA, and then the QA branch to production.

<!-- See .vuepress/public/gh-workflow.html to make changes. -->
<iframe :src="$withBase('/gh-workflow.html')" onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));' style="height:200px;width:100%;border:none;overflow:hidden;"></iframe> 

If adjustments to this process are needed for a specific repository, they should be documented in its README file. A preference to merge the whole dev branch to QA (and then QA to prod) should be documented in the REAMDE file as well.

## Creating a Topic Branch
Developers must make a decision when creating their topic branch: where to branch from. **The safest place to branch from is your production branch**. 

Unless you have a specific reason for branching from dev/QA or another topic, you should start with production. There are situations where this is necessary (e.g. you depend on new code recently added to dev), but it should always be a mindful decision.

If you create your topic branch from the dev environment's branch, you implicitly include all other work done in development. This makes it difficult for you to merge individual topics to production ahead of other work.

Below is an example topic branch, `edit-screen` that started from the dev branch. If you mouse over the commits in dev, you will see there is an experimental widget. This experimental code has been included in the topic branch.

<!-- See .vuepress/public to make changes. -->
<iframe :src="$withBase('/git-branching-from-dev-problem.html')" onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));' style="height:200px;width:100%;border:none;overflow:hidden;"></iframe>

The [GitHub Desktop client](https://desktop.github.com/) will help you be more cognizant of this by prompting you when you create a topic branch.

## Branch Protection
When branch protection is enabled [per the AS recommendations](./settings-permissions.md#branch-protection), developers may not push directly to the dev/qa/production environment branches. Instead, they open pull requests from their topic branch back to an environment.

You should configure a `CODEOWNERS` file to automatically assign the proper reviwers for pull requests.  Pull Requests should not be merged until at least one  reviewer has approved the changes. Reviewers are free to request reviews from other subject-matter experts.  A lead must approve Pull Requests to production branches before they can be merged.

## Pull Request and Reviews

A pull request (PR) is an audit and knowledge-sharing mechanism we use for promoting code from a feature branch into environment branches prior to deployment.  PRs should be viewed as a conversation between developers.  They are an opportunity for communicating information about a feature with fellow developers as well as a mechanism for gathering feedback and approval for those changes.  A PR could include the following:
- Description of the intended work
- List Code/configuration files changed
- Results of tests
- Feedback from reviewers
- etc
Once a PR is approved it can be merged into the target branch and the feature branch can be closed.

### PR Workflow

- Developer : The developer of a feature should create a *draft* pull request when they start development on a new feature.  They should add a description of what they plan to accomplish and a high-level description of their approach.  As a courtesy, if possible, this is also a good time to add reviewers.  Once the work is ***complete and tested*** the developer should click the **Ready for review** option.

- Reviewer : Is responsible for evaluating the committed changes.  Specifically they should look for:
  - Logical or Syntatical Errors (likely edge cases as the code should have been tested)
  - Standards and best practices maintained
  - No secrets or other sensitive information exposed
  - Documentation 
  - Error handling
  - Does the code produce the expected as described in the draft PR


- Developer & Reviewer : If no issues are found the reviewer will approve the pull request.  At this point the developer should merge their changes and close the feature branch.  If the reviewer believes changes are required or has questions for the developer the reviewer should leave comments for the developer.  The developer and reviewer should work together to resolve the reviewers concerns.  If rework is needed, once it is complete the developer should click the Re-request review button on the PR to signal to the reviewer the re-work is ready for review.

![Workflow Diagram](https://github.com/NIT-Administrative-Systems/AS-CloudDocs/blob/8fa5d683bd0b7e2720ed79d4ad77c0fde18140ff/assets/PR%20Workflow.png)


### Scenarios
- My PR has been approved, I have merged and deployed my code but it does not fix the issue.  I continue to add commits to my feature.  Do I need approval again?
  - Yes
- My PR has been approved; however, the reviewer has provided feedback.  Can I merge the code?  
  - Yes, but acknowledge/address the feedback.
- The reviewer did not approve my PR.  Can I merge the code?
  - No, you will need to work the reviewer and adress their concerns.  In the case where you cannot reach an acceptable resolution recruit additional feedback from other developers or a lead.
