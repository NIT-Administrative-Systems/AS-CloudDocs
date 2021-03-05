# Shared Library
The [AS-jenkins-shared](https://github.com/NIT-Administrative-Systems/AS-jenkins-shared) repository contains common code that can be used in any pipeline.

## Usage
This repository is intended to be used by declarative pipelines. 

You will need to declare that you are using the library at the top of your pipeline. Jenkins will load the entire lib and make all of its functions available. For example:

<<< @/assets/sample-secret-pipeline.groovy

## Functions
These are the major pieces of shared functionality.

| Function                                                                                                                             | Purpose                                                               | Requirements                             | 
|--------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------| 
| [`publishSecretsToSSM`](https://github.com/NIT-Administrative-Systems/AS-jenkins-shared/blob/stable/vars/publishSecretsToSSM.groovy) | Implements [secret management strategy](../infrastructure/secrets.md) | Terraform module has `parameters` output | 
| [`parseJson`](https://github.com/NIT-Administrative-Systems/AS-jenkins-shared/blob/stable/vars/parseJson.groovy)                     | Parse JSON & return it in a serializable format                       | None                                     | 
| [`publishSecretsToVapor`](https://github.com/NIT-Administrative-Systems/AS-jenkins-shared/blob/stable/vars/publishSecretsToVapor.groovy) | Implements [secret management strategy](../infrastructure/secrets.md) for Laravel Vapor | `.env.{deploy-env}` file has `VAPOR_SECRETS=` list |
| [`publishSecretsToSecretsManager`](https://github.com/NIT-Administrative-Systems/AS-jenkins-shared/blob/stable/vars/publishSecretsToSecretsManager.groovy) | Implements [secret management strategy](../infrastructure/secrets.md) | Terraform module has `secrets` output | 