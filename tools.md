# Tool Recommendations
AS officially recommends using the tools listed below. 

| Capability             | Tool of Choice                  | 
|------------------------|---------------------------------| 
| Cloud Provider         | AWS                             | 
| Infrastructure as Code | Terraform                       | 
| Version control        | Git & GitHub                    | 
| Git Client             | GitHub Desktop                  | 
| Editor                 | VS Code                         | 
| CI/CD                  | Jenkins - declarative pipelines | 
| Error Monitoring       | Sentry                          |

While you may opt to use different tools, the EACD team will not be able to support them.

The Eclipse Git plugin is specifically **not recommended**. Issues (both technical & UI) have been observed with some versions of this plugin. All developers are encouraged to make use of the standalone [Github Desktop](https://desktop.github.com/). The Github Desktop client integrates closely with key GitHub features like pull requests & branch protection.

## VS Code Extensions
All developers should install the following extensions:

- [Declarative Jenkinsfile Support](https://marketplace.visualstudio.com/items?itemName=jmMeessen.jenkins-declarative-support)
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [Terraform](https://marketplace.visualstudio.com/items?itemName=mauve.terraform)
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

## Sentry
[Sentry](https://sentry.io/welcome/) is a SaaS provider that you can integrate into your application's default exception handler. Any errors or exceptions that occurr are sent up to their dashboard, where reports & alerts can be generated.

This service is maintained by the EACD team and can be made available to any developer in AS upon request.

Once you have been added to the Northwestern IT organization, Sentry will allow you to create new projects and will provide documentation for your language/framework of choice.