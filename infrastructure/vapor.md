# Laravel Vapor
[Laravel Vapor](https://vapor.laravel.com/) is the deployment tool of choice for Laravel applications. This is a SaaS orchestration tool that will deploy a serverless web applciation on AWS. All of the necessary AWS infrastructure will be created for you by Vapor, making this a fast & easy way to get your application deployed.

A full explanation of what Vapor provides is available [in their documentation](https://docs.vapor.build/1.0/introduction.html#what-is-vapor).

If you would like to use Vapor, contact the EACD-CloudOps team for access.

## Implementation
We have structured our Vapor account [similar to AWS](./aws-account-design.md): a nonprod team and a prod team, each tied to the matching AWS account. This does require creating an application's project in both teams, which gives them different project IDs.

The initial setup for an application requires you to:

- Create a project (in prod & nonprod)
- Create any optional resources (RDS instances / elasticache clusters)
- Generate certificate request(s) for each environment & validate them (make sure your vapor CLI is logged in to the proper team `vapor team:current` to switch the team `vapor team:switch`)
    - `vapor cert my-subdomain.northwestern.edu` from the CLI w/ subsequent request to SOC for the validation records

Vapor natively supports RDS. For smaller applications & dev/test environments, you can use RDS Aurora Serverless at cost similar to DyanmoDB. 

You are free to terraform additional AWS resources (e.g. DynamoDB tables) for use by your application. The AWS PHP SDK can be used from your app to access these additional resources.

Review the [Vapor documentation](https://docs.vapor.build/) for more information on Vapor-izing your app, what AWS resources are natively supported, and how to configure your `vapor.yml` file.

If adding a new environment to a branch (like playground env to prod branch):

	1) use the CLI to set up the new environment in the appropriate vapor account:
		./vendor/bin/vapor team:switch			To switch to the correct vapor account
		./vendor/bin/vapor env playground		WHERE 'playground' is the name of the new environment
		
	2) then update the vapor.yml to include the new environment, for the initial build COMMENT OUT seeding and imports,
 	as the vapor command sequence doesn't validate before it tries to run, causing an error:
	    	- 'php artisan db:seed --class=\\Database\\Seeders\\StakeholderSeeder --force'
		- 'php artisan import:example:update'
		
	3) after inital build, go back into the vapor.yml and UNCOMMENT the seeing and imports lines from step 2
	
	4) all total, you will send three requests to the SOC
		a) new CNAME for AWS cert validation
		b) new CNAME for Auth0 cert validation
		c) DNS entry from ugly cloudfront address to pretty final URL   (Note that you do NOT need to send the custom domain that vapor creates.)
	
	5) after the new environment is built and you have the pretty URL back from SOC, don't forget to add the callback URL to AzureAD!

## Limitations
Deploying an application on Vapor comes with the following limitations. 

These limitations are combination of a serverless architecture & Vapor product decisions:

- API Gateway (HTTP request -> the lambda) has a timeout of 29 seconds
- Lambdas can only run for 15 minutes max
    - Long-running async events dispatched from SQS may need to be cut up if they're liable to go over the limit
    - The same is true for any long-running jobs from the scheduler
- App lives in its own dedicated Vapor VPC
	- You can (*probably, untested*) peer the Vapor VPC with the Northwestern VPC
    - But if your app is consuming on-prem services through APIs, this will not be an issue
        - DataHub can help with accessing data from PeopleSoft systems
- File uploads must be [done through S3](https://docs.vapor.build/1.0/resources/storage.html#file-uploads)
- You cannot customize what PHP extensions are loaded, what binaries are available, or the `php.ini`
    - See the [vapor-php-build](https://github.com/laravel/vapor-php-build/blob/master/php74/php.Dockerfile) repository to see what the Vapor runtime includes
- You cannot have a second-level subdomain
    - Vapor apps must be `subdomain.northwestern.edu`
    - Using entapp (e.g. `subdomain.entapp.northwestern.edu`) will not work

## Best Practices
The environment variables & secrets for a Laravel app are managed by Vapor. A copy of the `.env` file for your Vapor environments should be kept in your app's git repository as `.env.{vapor-env}`. 

According to our [secrets management strategy](./secrets.md), env variables like credentials & API keys should not be kept in this file; instead, define a `VAPOR_SECRETS` env var and set it to a comma-separated list of secret names:

```ini
# These are the env vars for a Vapor environment.
# This file is managed in Git, so *DO NOT* put any secrets here.
# Secrets must be managed through Jenkins' credential store.

APP_DEBUG=false
APP_KEY=base64:...
MAIL_MAILER=log

AN_API_URL=https://api.dev.northwestern.edu/example-api

# The next line is for Jenkins so it knows which secrets to sync to Vapor.
VAPOR_SECRETS=ECATS_API_SYSTEM_USER_KEY,ECATS_API_APIGEE_KEY
```

The Jenkins pipeline below will utilize the `VAPOR_SECRETS` variable to sync secrets from the Jenkins credential store to Vapor. Instructions on adding your secrets to the Jenkins credential store may be found [here, under the Jenkins Setup header](./secrets.md#jenkins-setup) -- but the other steps (Terraform setup, Jenkins) in that article are not applicable to Vapor deployments.

## Deploying from Jenkins
Vapor deployments should be triggered from the Jenkins server.

This example assumes your Jenkins server has a `vapor-api-key` credential with the nonprod / prod Vapor team's API key. It also assumes that your branch names match the environments in `vapor.yml`.

You will need both your non-prod & prod project IDs. We recommend putting the non-prod project ID into `vapor.yml` and substituting it only during prod deployments. To make this example work for production, adjust the IDs on the highlighted lines. Vapor is not built with our nonprod / prod AWS account spit in mind, so every app is two projects split across our nonprod & prod teams, each project getting its own ID. The nonprod ID is part of the `vapor.yml` file, so when we deploy prod, Jenkins will modify that line and put in the appropriate production Vapor project ID.

```groovy{69-70}
#!groovy
library identifier: "AS-jenkins-shared@stable", retriever: modernSCM([$class: 'GitSCMSource', credentialsId: 'GitHub-awsCloudOpsCJT', remote: 'https://github.com/NIT-Administrative-Systems/AS-jenkins-shared.git'])

pipeline {
    agent any

    environment {
        TEAMS_WEBHOOK_URL = credentials('teams-build-webhook')
    }

    triggers {
        pollSCM('H/10 * * * *')
    }


    options {
        disableConcurrentBuilds()
    }

    stages {
        stage ('Send Notifications') {
            steps {
                office365ConnectorSend status: "Started", webhookUrl: "${env.TEAMS_WEBHOOK_URL}"
            }
        }

        stage ('Test and Deploy')
        {
            agent {
                docker {
                    image 'edbizarro/gitlab-ci-pipeline-php:7.4'
                    args '-u root:root'
                }
            }

            stages {
                stage ('Test Mix') {
                    steps {
                        sh 'yarn install'
                        sh 'yarn run prod'
                    }
                }

                stage ('Test App') {
                    steps {
                        sh 'composer install'
                        sh 'cp .env.example .env && php artisan key:generate'
                        sh './vendor/bin/phpunit --coverage-text --color=never'
                        sh 'rm .env'
                    }
                }

                stage ('Deploy') {
                    when {
                        anyOf {
                            branch 'develop'
                            branch 'qa'
                            branch 'production'
                        }
                    }

                    steps {
                        script {
                            GIT_COMMIT=checkout(scm).GIT_COMMIT
                        }

                        sh 'composer global require --prefer-dist --no-ansi --no-interaction --no-progress laravel/vapor-cli'

                        // Hack to support using two Vapor teams -- the project ID differs between non-prod and prod
                        sh "[ \"${BRANCH_NAME}\" = 'production' ] && sed -i 's/id: 1234/id: 5678/' vapor.yml || true"

                        withCredentials([string(credentialsId: 'vapor-api-key', variable: 'VAPOR_API_TOKEN')]) {
                            publishSecretsToVapor("${BRANCH_NAME}");

                            sh '''export PATH=\$PATH:\$COMPOSER_HOME/vendor/bin/ &&
                            vapor env:push ${BRANCH_NAME} &&
                            vapor deploy --no-ansi ${BRANCH_NAME} --commit='${GIT_COMMIT}'
                            '''
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            office365ConnectorSend status: "Success!", webhookUrl: "${env.TEAMS_WEBHOOK_URL}"
        }

        failure {
            office365ConnectorSend status: "Failed", webhookUrl: "${env.TEAMS_WEBHOOK_URL}"
        }
    }
}

```
