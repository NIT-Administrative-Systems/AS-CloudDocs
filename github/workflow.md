# Workflow
There are many ways to use Git & GitHub. AS has tried several branching/merging workflows, and concluded that the workflow explained below best meets our needs. 

This workflow is intended for use with medium-to-large repositories that utilize CI/CD tools. For very small projects, you may decide to omit sections involving sub-production environment branches -- this is a decision best made by the leads responsible for the project. The workflow will reflect [our requirement to enable branch protection](./settings-permissions.md#branch-protection) for branches deployed automatically.

<!-- See docs/.vuepress/public/gh-workflow.html to make changes. -->
<iframe src="/gh-workflow.html" onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));' style="height:200px;width:100%;border:none;overflow:hidden;"></iframe>