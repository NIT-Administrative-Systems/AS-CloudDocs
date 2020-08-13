# Available Modules
The EACD-CloudOps teams maintains [several modules](https://github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules) for common functionality / app designs. As new patterns are identified, modules will be added.

- [Application Load Balancer](https://github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules/tree/stable/alb)
- [Certificates for `entapp.northwestern.edu`](https://github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules/blob/stable/entapp_certificate)
- [OpsGenie Integration for CloudWatch Alarms](https://github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules/tree/stable/opsgenie)
- [Private Subnet Assignment](https://github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules/blob/stable/private_subnet)
- [Fargate Task](https://github.com/NIT-Administrative-Systems/AS-fargate-modules/tree/master)
- [Fargate Service](https://github.com/NIT-Administrative-Systems/AS-fargate-modules/tree/master)

All teams are welcome to use these modules. Support can be provided by the EACD-CloudOps group.

## Using a Module
To use one of these modules, you can put a reference to Github in as the local module's source:

```hcl
module "alb" {
    // The double slash IS significant <https://www.terraform.io/docs/modules/sources.html#modules-in-package-sub-directories>
    source = "github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules//alb?ref=tf-0.12"

    region = "us-east-2"
    account_label = var.account_label
    vpc_id = var.vpc_id
    subnets = var.alb_subnets
}
```

The repository is private, so you will need to make Github credentials available to `terraform init` in your Jenkins pipeline:

```groovy
stage ('Init') {
    steps {
        withCredentials([
            usernamePassword(credentialsId: 'GitHub-awsCloudOpsCJT', passwordVariable: 'GITHUB_PASSWORD', usernameVariable: 'GITHUB_USERNAME'),
            [$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'terraform', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
        ]) {
            // Need to set up the Git credential helper since terraform init will be cloning the shared modules itself
            // Kinda kludgey that the pipeline has to whitelist the module URLs, but :/
            sh """export GITHUB_USERNAME='${GITHUB_USERNAME}' &&
            export GITHUB_PASSWORD='${GITHUB_PASSWORD}' &&
            git config --global credential.https://github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules.git.helper '!f() { echo "username=""" + '${GITHUB_USERNAME}' + """"; echo "password=""" + '${GITHUB_PASSWORD}' + """"; }; f' &&
            cd ./${build_env} &&
            terraform init -no-color &&
            git config --global --unset credential.https://github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules.git.helper
            """
        }
    }
}
```