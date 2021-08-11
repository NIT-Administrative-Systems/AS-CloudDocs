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
| Cross-browser Testing  | BrowserStack & LambdaTest       |

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

## BrowserStack
[BrowserStack](https://www.browserstack.com/) is a "box of devices" service that lets you test web applications on a wide variety of phones, tablets, and desktop browsers. It is similar to [AWS Device Farm](https://docs.aws.amazon.com/devicefarm/), but offers more devices & a manual testing UX. Both IE11 and Safari are available, filling in the Windows vs. Mac browser testing gap.

You do not need to deploy an application to the public internet to test it. BrowserStack has browser extensions available that allow them to use you as a proxy. You can take advantage of this to perform cross-browser testing during your development workflow; you do not need to deploy *anything* in order to test.

## LambdaTest
[LambdaTest](https://www.lambdatest.com/) is a cloud based cross browser testing platform that that lets you test web applications on a wide variety of phones, tablets, and desktop browsers. It is similar to [AWS Device Farm](https://docs.aws.amazon.com/devicefarm/). Users can choose from a combination of 2000+ browsers & OS to perform both manual testing and automation testing UX. Both IE11 and Safari are available, filling in the Windows vs. Mac browser testing gap.

The ADO-EACD team maintains a BrowserStack subscription. Please contact them if you wish to use the service.
