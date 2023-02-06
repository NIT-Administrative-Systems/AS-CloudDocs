import{_ as r,M as s,p as i,q as a,R as e,t,N as n}from"./framework-bf3e1922.js";const l={},u=e("h1",{id:"github-actions",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#github-actions","aria-hidden":"true"},"#"),t(" GitHub Actions")],-1),c=e("p",null,"GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline. You can create workflows that build and test every pull request to your repository, or deploy merged pull requests to production.",-1),h=e("p",null,"GitHub Actions goes beyond just DevOps and lets you run workflows when other events happen in your repository. For example, you can run a workflow to automatically add the appropriate labels whenever someone creates a new issue in your repository.",-1),d=e("p",null,"GitHub provides Linux, Windows, and macOS virtual machines to run your workflows, or you can host your own self-hosted runners in your own data center or cloud infrastructure.",-1),p=e("h2",{id:"suggested-learning-path",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#suggested-learning-path","aria-hidden":"true"},"#"),t(" Suggested Learning Path")],-1),f={href:"https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions",target:"_blank",rel:"noopener noreferrer"},b={href:"https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#workflows",target:"_blank",rel:"noopener noreferrer"},g={href:"https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#events",target:"_blank",rel:"noopener noreferrer"},_={href:"https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows",target:"_blank",rel:"noopener noreferrer"},m=e("ul",null,[e("li",null,"Scheduled like CRON"),e("li",null,"Manually create by clicking a button"),e("li",null,"Triggered by an action ex. opening a pull request")],-1),w={href:"https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#jobs",target:"_blank",rel:"noopener noreferrer"},k=e("ul",null,[e("li",null,"Can have more than one in a workflow"),e("li",null,"Can run serially or in parellel"),e("li",null,"An example might be a job that runs tests")],-1),y={href:"https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#actions",target:"_blank",rel:"noopener noreferrer"},v={href:"https://github.com/marketplace?type=actions",target:"_blank",rel:"noopener noreferrer"},A=e("li",null,"Step -",-1),C={href:"https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#runners",target:"_blank",rel:"noopener noreferrer"},S={href:"https://docs.github.com/en/actions/security-guides/encrypted-secrets",target:"_blank",rel:"noopener noreferrer"},G={href:"https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment",target:"_blank",rel:"noopener noreferrer"},H=e("ul",null,[e("li",null,"By using a named environment secret you can have a single workflow file, that uses different secrets based on the environment the workflow is executed in.")],-1),x={href:"https://docs.github.com/en/actions/quickstart",target:"_blank",rel:"noopener noreferrer"},I={href:"https://lab.github.com/githubtraining/github-actions:-hello-world",target:"_blank",rel:"noopener noreferrer"},T={href:"https://lab.github.com/githubtraining/github-actions:-continuous-integration",target:"_blank",rel:"noopener noreferrer"},N={href:"https://lab.github.com/githubtraining/github-actions:-using-github-script",target:"_blank",rel:"noopener noreferrer"},E=e("hr",null,null,-1),R=e("h2",{id:"comparisons-with-jenkins",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#comparisons-with-jenkins","aria-hidden":"true"},"#"),t(" Comparisons with Jenkins")],-1),B=e("ul",null,[e("li",null,"Both allow creating custom/reusable functionality. Jenkins often accomplishes this via plug-ins in GitHub they are Marketplace Actions, Composite & Reuasable Workflows"),e("li",null,"Both support describing a process in a document that can be checked into source control. In Jenkins they are called pipelines (Jenkinsfile), GitHub Actions calls them workflows (.gitub/workflows/{your-workflow}.yml)"),e("li",null,"Both support timed and manually triggered jobs. Jenkins can be triggered by checking code into GitHub (and can likely do more via Plug-ins); however, GitHub Actions natively supports a more diverse and granular set of events, and seems better suited for automations"),e("li",null,`Both Jenkins and GitHub Actions support "secrets". GitHub's approach seems more secure.`)],-1),P=e("hr",null,null,-1),J=e("h2",{id:"tips-resources-useful-actions",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#tips-resources-useful-actions","aria-hidden":"true"},"#"),t(" Tips, Resources, & Useful Actions")],-1),L={href:"https://github.com/actions/checkout",target:"_blank",rel:"noopener noreferrer"},O={href:"https://github.com/hashicorp/setup-terraform",target:"_blank",rel:"noopener noreferrer"},W={href:"https://github.com/actions/cache",target:"_blank",rel:"noopener noreferrer"},j={href:"https://github.com/actions/github-script",target:"_blank",rel:"noopener noreferrer"},M={href:"https://docs.github.com/en/rest",target:"_blank",rel:"noopener noreferrer"},U={href:"https://github.com/octokit/octokit.js",target:"_blank",rel:"noopener noreferrer"},q={href:"https://github.com/actions/",target:"_blank",rel:"noopener noreferrer"},D={href:"https://docs.github.com/en/actions",target:"_blank",rel:"noopener noreferrer"},V={href:"https://github.com/actions/starter-workflows",target:"_blank",rel:"noopener noreferrer"},Y=e("li",null,"If you add a Repository Secret with the name ACTIONS_STEP_DEBUG and the value of 'true' this will turn on debugging logs for your Workflows.",-1),z={href:"https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml",target:"_blank",rel:"noopener noreferrer"},F=e("hr",null,null,-1),K=e("h2",{id:"reusable-workflows-and-custom-nu-actions",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#reusable-workflows-and-custom-nu-actions","aria-hidden":"true"},"#"),t(" Reusable Workflows and Custom NU Actions")],-1),Q=e("p",null,"Non-authoratative list of NUIT developed workflows and actions that perform common actions",-1),X={href:"https://github.com/NIT-Administrative-Systems/aws-secrets-sync-action",target:"_blank",rel:"noopener noreferrer"},Z={href:"https://github.com/NIT-Administrative-Systems/ado-reusable-workflows-terraform",target:"_blank",rel:"noopener noreferrer"};function $(ee,te){const o=s("ExternalLinkIcon");return i(),a("div",null,[u,c,h,d,p,e("ul",null,[e("li",null,[e("a",f,[t("High-level overview of GitHub Actions"),n(o)]),e("ul",null,[e("li",null,[t("Key Concepts "),e("ul",null,[e("li",null,[e("a",b,[t("Workflows"),n(o)]),t(" - Automated process, such as build and deploy an application")]),e("li",null,[e("a",g,[t("Events"),n(o)]),t(" - Casue workflows to execute. "),e("a",_,[t("Event Types"),n(o)]),t(" include: "),m]),e("li",null,[e("a",w,[t("Jobs"),n(o)]),t(" - Set of steps comprising a logic unit of work in your process. "),k]),e("li",null,[e("a",y,[t("Actions"),n(o)]),t(" - Custom application that provides functionality, can write your own or use pre-built ones from the "),e("a",v,[t("Marketplace"),n(o)])]),A,e("li",null,[e("a",C,[t("Runners"),n(o)]),t(" - Server virtua/hosted/on-prem where the workflow is executed")]),e("li",null,[e("a",S,[t("Secrets"),n(o)]),t(" - Sensitive environment variables like passwords, API keys, and tokens. GitHub provides a mechanism for securely secrets with your source code. Secrets can be stored at the organization, repository and environment level. Once created secrets can then be used in your workflows.")]),e("li",null,[e("a",G,[t("Environments"),n(o)]),t(" - Are collections of settings (allowed branches, secrets, and protection rules.) An environment in GitHub likely correlates to the environment your workflow will act against. "),H])])])])]),e("li",null,[e("a",x,[t("Quickstart"),n(o)]),t(" - Create your first workflow")]),e("li",null,[e("a",I,[t("Write your own action"),n(o)]),t(" - Chances are you will not often need to do this, but understanding how the actions you are using a built will give you a better understanding of how to use them and why something might not work as expected.")]),e("li",null,[e("a",T,[t("Continuous Integration"),n(o)]),t(" - This will guide you in creating your first workflow.")]),e("li",null,[e("a",N,[t("GitHub Script"),n(o)]),t(" - Create a workflow that uses the GitHub script action (more about this below).")])]),E,R,B,P,J,e("ul",null,[e("li",null,[e("a",L,[t("GitHub Checkout Action"),n(o)]),t(" - Checks your code out of your repo so it can be used in your workflow. Likely you will use this in most workflows.")]),e("li",null,[e("a",O,[t("Terraform Setup"),n(o)]),t(" - Sets up the terraform CLI making it easy to execute your IAC")]),e("li",null,[e("a",W,[t("GitHub Cache Action"),n(o)]),t(" - Allows you to cache artifacts across runs in the same branch. Useful to speed up your builds.")]),e("li",null,[e("a",j,[t("GitHub Script Action"),n(o)]),t(` - Exposes GitHub's RESTful APIs inside a Script block of a workflow "step". This is very useful for automations `),e("ul",null,[e("li",null,[e("a",M,[t("RESTful API documentation"),n(o)]),t(" - General API documentation")]),e("li",null,[e("a",U,[t("Octokit Documentation"),n(o)]),t(" - NodeJS implementation of GitHub RESTful API.")])])]),e("li",null,[e("a",q,[t("GitHub Action Org"),n(o)]),t(" - Owner of all the GitHub developed repositories containing Actions related code")]),e("li",null,[e("a",D,[t("GitHub Actions Documentation"),n(o)])]),e("li",null,[e("a",V,[t("Starter/Template Workflows"),n(o)]),t(" - Contains templated workflows for common tasks")]),Y,e("li",null,[t("YAML is all about indentation, and it is easy to cause yourself headaches due to missing a space. Use a YAML linter like "),e("a",z,[t("this"),n(o)]),t(" for VSCode")])]),F,K,Q,e("ul",null,[e("li",null,[e("a",X,[t("aws-secrets-sync-action"),n(o)]),t(" Custom action to add secrets to AWS Parameter Store after successfully executing IAC")]),e("li",null,[e("a",Z,[t("ado-reusable-workflows-terraform"),n(o)]),t(" Reusable workflow that performs the common steps of executing terraform IAC as part of a PR or Build process")])])])}const ne=r(l,[["render",$],["__file","gha.html.vue"]]);export{ne as default};