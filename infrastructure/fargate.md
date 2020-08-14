# Fargate for ECS
AWS Fargate is a serverless solution for running containerized applications without managing servers. 

Several IaC modules for common Fargate implementations are available. See the [AS shared modules](../iac/available-modules.md).

## Amazon ECS
Amazon ECS is a container management service (manages the lifecycle of your containers, e.g. placing tasks, starting/stopping containers). ECS runs the containers on a cluster of EC2 instances and gives you the choice between two models for running your containers: 
| ECS Launch Type | You | AWS |
| --------------- | -----------| ----------- |
| EC2 | You manage the EC2s for running the containers and you manage the containers. | |
| Fargate | You manage the containers. | AWS manages the underlying EC2s for running the containers. |

Fargate is typically our preferred model, as it involves less configuration and management, and makes it easy to scale. It is sometimes more cost effective (particularly for variable traffic, small test environments, or smaller workloads) but you should always compare estimated costs for different services for your particular use case in order to select the best option. 

## Key Terms
| Term | Definition |
| --------------- | -----------| ----------- |
| Task Definition | The "blueprint": a template specifying the Docker images to use, cpu, memory, environment variables, ports, secrets, etc. |
| Task | An application instance. Often there is one container per task, though we could also run multiple containers per task in order to run a sidecar for the application e.g. running a main container for the application traffic and another for detailed monitoring or metrics. |
| Service | A service runs some number of copies of the task definition, providing horizontal scalability. If a task is unhealthy, the service will kill it and start a new task to guarantee the specified number of tasks are always running. |

## Fargate Task vs. Fargate Service
   - A job that is invoked, does some work, and completes/exits (e.g. a daily ETL) should be run as a task.
   - Continuously running processes (e.g. a web server) should be run as a service. 

## Fargate Task vs. Lambda
   - A job that is invoked, does some work, and completes/exits is also a good candidate for running as a Lambda function. Both are serverless solutions where you pay for only the compute used. However, the pricing models are different and you should compare the estimated charges to determine the best option for your specific use case. 
   - A Lambda function is less overhead to get started, as you can run your code without containers. 
   - However, Lambda has strict limits on timeout, cpu, and RAM, which Fargate does not. A Fargate Task is better suited to long-running workloads or those needing more compute, which exceed the Lambda timeout/limits.

## Fargate Service Concepts
### Load Balancing
A dedicated load balancer enables you to attach a domain to your Fargate Service (you could attach a public IP to the service but it would change every time you redeployed the service) and distributes traffic across the tasks in your containers. 

The load balancer also performs health checks on the tasks in your service; it sends periodic requests and verifies that the expected response is returned. It communicates with the ECS service scheduler to restart unhealthy tasks in order to maintain the desired number of healthy tasks in your service. When a task is unhealthy, ECS removes the task from the load balancer, waits for a deregistration delay (time for the load balancer to drain active connections), and starts a new task which it registers with the load balancer. 

### Auto Scaling
Reduce costs and meet demand by scaling the number of tasks running your application up/down in response to demand.

Multiple policies can be combined - when multiple policies trigger a scale out or scale in simultaneously Auto Scaling will take instruction from the one that yields the largest number of tasks running. It is not recommended to mix target tracking and step scaling policies.

There are three approaches to Auto Scaling a Fargate service:
#### Target Tracking
This approach increases/decreases the number of tasks running (between a max and min you specify) in order to keep metrics like cpu and memory utilization at a specified level. This is the "out of the box" approach and is typically sufficient. Target tracking is a good option when your target metrics like cpu and memory utilization fluctuate predictably for a given load and proportionally to the number of instances running your application. 
- You specify a single target value for your metric, e.g. maintain 75% average CPU utilization across all tasks. AWS does the rest, like creating/managing the CloudWatch alarms to monitor the metric and scaling in/out. 
- There are several predefined metrics (average cpu utilization, average memory utilization, request count per target) or you can define your own. The metrics are aggregated across all of the tasks your service is running.
- Setting the metrics: typically, you would want a metric like CPU utilization to use a threshold no higher than 75% so that you still have some left to handle traffic spikes. 

#### Step Scaling
Step scaling is a good option when you need more fine-grained control, or your metrics fluctuate unpredictably for a given load.
 - Instead of a single target for the metric, you define high and low thresholds. You also define the behavior when the threshold is exceeded - how much capacity to add or remove. 
 - The Step Adjustments refer to creating a set of scaling adjustments such that the aggressiveness of the capacity response depends on the size of the alarm breach. 
 - You create and manage the CloudWatch alarms for the scaling policies. 
 - Step scaling is also the best option when working with a WebSocket application.

#### Scheduled Scaling
App Autoscaling Scheduled Actions increase or decrease the minimum/maximum capacity based on the date/time (can be a one-time event or a cron).
### Using Scheduled Scaling for Cost Savings
We recommend using scheduled scaling for cost savings in the lower environments. For example, if the lower environments of your ECS Service are used only during business hours for development purposes, scheduled scaling actions can shut down the service on nights and weekends, yielding significant savings. 

#### How it works: 
ECS Fargate Services are stopped by setting the count of running tasks to 0. 

The service's capacity can be set to 0 on a schedule (one-time event or cron) by creating an App Autoscaling Scheduled Action which sets the max capacity of the service to 0. When the action is triggered, the new max capacity is below the service's current capacity, so autoscaling scales in to the new maximum (0). 
   ```hcl
   resource "aws_appautoscaling_target" "ecs_target_example" {
      service_namespace  = "ecs"
      resource_id        = "service/${aws_ecs_cluster.example.name}/${aws_ecs_service.example.name}"
      scalable_dimension = "ecs:service:DesiredCount"
      min_capacity       = var.min_capacity
      max_capacity       = var.max_capacity
   }

   resource "aws_appautoscaling_scheduled_action" "shutdown_example" {
      name               = "${var.service_name}-shutdown-example-${var.env}"
      service_namespace  = aws_appautoscaling_target.ecs_target_example.service_namespace
      resource_id        = aws_appautoscaling_target.ecs_target_example.resource_id
      scalable_dimension = aws_appautoscaling_target.ecs_target_example.scalable_dimension
      schedule           = var.shutdown_schedule
      
      scalable_target_action {
         max_capacity = 0
      }
   }
   ```
A scheduled action does not keep track of the original values or return them after a certain time. So to start your service you must have a second action to return to the previous capacity. 

To start the service, create a second App Autoscaling Scheduled Action which returns the min and max capacity values to their previous values. Since the new minimum capacity is above the current capacity (0), the task count will be raised to the new minimum. Your other autoscaling rules (target tracking or step scaling) will trigger further scaling out as needed.
   ```hcl
   resource "aws_appautoscaling_scheduled_action" "startup_example" {
      name               = "${var.service_name}-startup-example-${var.env}"
      service_namespace  = aws_appautoscaling_target.ecs_target_example.service_namespace
      resource_id        = aws_appautoscaling_target.ecs_target_example.resource_id
      scalable_dimension = aws_appautoscaling_target.ecs_target_example.scalable_dimension
      schedule           = var.startup_schedule

      scalable_target_action {
         min_capacity = var.min_capacity 
         max_capacity = var.max_capacity
      }
   }
   ```

  

