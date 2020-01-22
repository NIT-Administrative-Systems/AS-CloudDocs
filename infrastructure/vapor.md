# Laravel Vapor
[Laravel Vapor](https://vapor.laravel.com/) is the deployment tool of choice for Laravel applications. This is a SaaS orchestration tool that will deploy a serverless web applciation on AWS. All of the necessary AWS infrastructure will be created for you by Vapor, making this a fast & easy way to get your application deployed.

A full explanation of what Vapor provides is available [in their documentation](https://docs.vapor.build/1.0/introduction.html#what-is-vapor).

If you would like to use Vapor, contact the EACD-CloudOps team for access.

## Implementation
We have structured our Vapor account [similar to AWS](./aws-account-design.md): a nonprod team and a prod team, each tied to the matching AWS account. This does require creating an application's project in both teams, which gives them different project IDs.

The initial setup for an application requires you to:

- Create a project (in prod & nonprod)
- Create any optional resources (RDS instances / elasticache clusters)
- Generate certificate request(s) for each environment & validate them
    - `vapor cert my-subdomain.northwestern.edu` from the CLI w/ subsequent request to SOC for the validation records

Vapor natively supports RDS. For smaller applications & dev/test environments, you can use RDS Aurora Serverless at cost similar to DyanmoDB. 

You are free to terraform additional AWS resources (e.g. DynamoDB tables) for use by your application. The AWS PHP SDK can be used from your app to access these additional resources.

Review the [Vapor documentation](https://docs.vapor.build/) for more information on Vapor-izing your app, what AWS resources are natively supported, and how to configure your `vapor.yml` file.

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

## Deploying from Jenkins
Vapor deployments should be triggered from the Jenkins server.

You will need both your non-prod & prod project IDs. We recommend putting the non-prod project ID into `vapor.yml` and substituting it only during prod deployments:

This example assumes your Jenkins server has a `vapor-api-key` credential with the nonprod / prod Vapor team's API key. It also assumes that your branch names match the environments in `vapor.yml`.

```groovy
pipeline {
    agent {
        docker {
            image 'edbizarro/gitlab-ci-pipeline-php:7.4'
            args '-u root:root'
        }
    }

    options {
        disableConcurrentBuilds()
    }

    stages {
        stage ('Test') {
            steps {
                sh 'composer install'
                sh 'cp .env.example .env && php artisan key:generate'
                sh './vendor/bin/phpunit'
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
                    sh "PATH=\$PATH:\$COMPOSER_HOME/vendor/bin/ vapor deploy --no-ansi ${BRANCH_NAME} --commit='${GIT_COMMIT}'"
                }
            }
        }
    }
}
```