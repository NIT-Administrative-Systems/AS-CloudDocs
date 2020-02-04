#!groovy
library identifier: "AS-jenkins-shared@stable", retriever: modernSCM([$class: 'GitSCMSource', credentialsId: 'GitHub-awsCloudOpsCJT', remote: 'https://github.com/NIT-Administrative-Systems/AS-jenkins-shared.git'])

pipeline {
    agent any

    stages {
        stage ('Terraform') {
            sh 'tfenv install && terraform -version'
            sh 'terraform init -no-color'
            sh 'terraform apply -no-color -auto-approve'
            sh 'terraform output -no-color'
        }

        stage ('Publish Secrets to SSM') {
            steps {
                // This function is part of our shared library
                publishSecretsToSSM('us-east-2', 'dev/')
            }
        }
    }
}