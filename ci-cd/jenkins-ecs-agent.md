# Jenkins ECS Agent
With the [Elastic Container Plugin agent for Jenkins](https://github.com/jenkinsci/amazon-ecs-plugin), the work involved in running a Jenkins pipeline (partially or entirely) can be offloaded from the primary Jenkins server to remote compute spun up on-demand. When the pipeline is done running, the compute will be torn down.

For our implementation, we have chosen ECS Fargate. We do not maintain the EC2s or much infrastructure -- we just ask AWS to run a Docker image in our VPC with a specific amount of CPU/memory.

- **Pro**
    - Only billed for the compute we need; no EC2s sitting around idling
    - Rogue jobs filling up disk / using all available CPU/memory will not impact other jobs or crash Jenkins
    - Can get more CPU/memory than the priamry Jenkins server has available

- **Con**
    - Pipeline takes longer to start; has to wait for compute to spin up
    - Requires JNLP-enabled Docker images; mostly have to write & maintain ourselves
    - ECS Agent plugin [does not currently support Fargate Spot market](https://github.com/jenkinsci/amazon-ecs-plugin/issues/138)

## Using ECS Agent
If you want to use a remote ECS agent, you should adjust the `agent` block in your pipeline.

:::warning Work in Progress
This implementation is a work in progress. It is available in the ADO Jenkins environments.

Please contact EACD for a current list of applicable `inheritFrom` containers. We are working to get the Docker image used under dev control.
:::

```groovy
#!groovy
pipeline {
    agent {
        ecs {
            inheritFrom 'jenkins-workers-php'
            cpu 2048
            memoryReservation 4096
        }
    }

    stages {
        stage ('Do stuff') {
            steps {
                sh 'yarn install'
                sh '...'
            }
        }
    }
}
```

You may override any of the ECS plugin's settings. For a list of available settings, see [the properties for ECSDeclarativeAgent](https://github.com/jenkinsci/amazon-ecs-plugin/blob/master/src/main/java/com/cloudbees/jenkins/plugins/amazonecs/pipeline/ECSDeclarativeAgent.java#L28).

You **cannot** pick totally-arbitrary values for CPU/memory. ECS Fargate has an upper bound on how much memory is available based on the CPU shares requested. See Fargate documentation for [a list of valid CPU/memory size combinations](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html#fargate-tasks-size).

:::tip Accessing On-Prem Resources
The remote ECS agents will run in the same subnet that the primary Jenkins server lives in. 

If you need to access secure on-campus resources, submit your firewall requests using the subnet instead of the server's individual IP.
:::

As with any other Jenkins pipeline, you may choose a different agent in an individual stage block.

### Troubleshooting
If you are having problems using ECS remote workers, first check the log for the run in Jenkins. It will indicate if any pipeline errors have occurred.

If that log does not give you an indication of the issue, log in to your AWS account and check the `jenkins-workers` ECS cluster. You can see if your task is pending or active, which indicate it's still running. You can search for stopped tasks as well. Their logs may include useful error messages.

If you do not see an ECS task being queued at all when you run the pipeline, it is possible the API call to create the ECS task is failing. Double-check your `cpu`/`memoryReservation` combination is valid. If it is, contact the EACD or PIPS-CloudOps teams and ask them to review the Jenkins server logs -- AWS API errors are only made available in this logfile.

## Adding Jenkins JNLP Agent to Docker image
To use a Docker image as an ECS remote worker, it will need the Jenkins JNLP agent installed and configured as the entrypoint.

Select a suitable base Docker image to extend that includes the language/tool versions you want. You can find an image on Dockerhub, or write your own.

### Debian Images
This is an example of setting up Java & the agent for a PHP environment maintained by the Gitlab community. Their docker image is a Debian-based system that uses `apt`.

```docker
FROM edbizarro/gitlab-ci-pipeline-php:7.2

## Install the Jenkins agent on a Debian-family image
USER root # Extended image may leave us as an unpriviledged user

# https://github.com/geerlingguy/ansible-role-java/issues/64
RUN mkdir -p /usr/share/man/man1

RUN DEBIAN_FRONTEND=noninteractive apt-get update # fetch package lists
RUN DEBIAN_FRONTEND=noninteractive apt-get install -yqq apt-utils default-jre # install Java runtime

 # Copy agent JARs from official Jenkins worker images 
COPY --from=jenkins/slave:latest /usr/share/jenkins/agent.jar /usr/share/jenkins/agent.jar
COPY --from=jenkins/jnlp-slave:latest /usr/local/bin/jenkins-agent /usr/bin/jenkins-agent

RUN chmod +x /usr/bin/jenkins-agent && ln -s /usr/bin/jenkins-agent /usr/bin/jenkins-slave

# Create workspace for Jenkins to use.
# The `php` user is something from the extended image -- an unprivledges user.
RUN mkdir /home/jenkins
RUN chown php:php /home/jenkins

WORKDIR /home/jenkins

# Launch w/ the Jenkins agent JAR
ENTRYPOINT ["jenkins-agent"]
```

### Alpine Linux
Alpine Linux is a minamalist Linux distribution. It is popular in the Docker community, since the minimalism keeps image size down.

:::warning TODO
We don't have an alpine example yet.
:::