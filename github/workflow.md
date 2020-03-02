# Workflow
There are many ways to use Git & GitHub. AS has tried several branching/merging workflows, and concluded that the workflow explained below best meets our needs. 

This workflow is intended for use with medium-to-large repositories that utilize CI/CD tools. For very small projects, you may decide to omit sections involving sub-production environment branches -- this is a decision best made by the leads responsible for the project. The workflow assumes that [our requirement to enable branch protection](./settings-permissions.md#branch-protection) for branches deployed automatically has been followed.

## Process
The process should be familiar if you have used git before: developers will create a branch for their work (known as a *topic branch*), commit to the branch, and then submit a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) (PR) to the dev environment. The leads group for the project will review the changes and provide either feedback or approval. The developer can then merge the PR into the dev branch. This merge should trigger a deployment to the dev environment.

In addition to the dev branch, our projects will typically have a QA and production branch. To promote code to these environments, you can repeat the PR process for the QA/production branches. For bigger projects, you may find managing dozens of topic branches difficult -- as an alternative, you can PR the dev branch to QA, and then the QA branch to production.

<!-- See docs/.vuepress/public/gh-workflow.html to make changes. -->
<iframe src="/gh-workflow.html" onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));' style="height:200px;width:100%;border:none;overflow:hidden;"></iframe> 

If adjustments to this process are needed for a specific repository, they should be documented in its README file. A preference to merge the whole dev branch to QA (and then QA to prod) should be documented in the REAMDE file as well.

## Creating a Topic Branch
Developers must make a decision when creating their topic branch: where to branch from. **The safest place to branch from is your production branch**. 

Unless you have a specific reason for branching from dev/QA or another topic, you should start with production. There are situations where this is necessary (e.g. you depend on new code recently added to dev), but it should always be a mindful decision.

If you create your topic branch from the dev environment's branch, you implicitly include all other work done in development. This makes it difficult for you to merge individual topics to production ahead of other work.

Below is an example topic branch, `edit-screen` that started from the dev branch. If you mouse over the commits in dev, you will see there is an experimental widget. This experimental code has been included in the topic branch.

<!-- See docs/.vuepress/public to make changes. -->
<iframe src="/git-branching-from-dev-problem.html" onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));' style="height:200px;width:100%;border:none;overflow:hidden;"></iframe>

The [GitHub Desktop client](https://desktop.github.com/) will help you be more cognizant of this by prompting you when you create a topic branch.

## Pull Request Reviews
When branch protection is enabled [per the AS recommendations](./settings-permissions.md#branch-protection), developers may not push directly to the dev/qa/production environment branches. Instead, they open pull requests from their topic branch back to an environment.

The `CODEOWNERS` file will automatically assign the leads team as reviwers for the pull request, and it cannot be merged until at least one lead has approved. The developers & leads are free to request reviews from other subject-matter experts, but a lead must approve before the PR can be merged.