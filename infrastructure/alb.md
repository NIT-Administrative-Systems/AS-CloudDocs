# Application Load Balancers
Application Load Balancers (ALBs) are Amazon's latest load balancer offering. They are a significant upgrade over the classic Elastic Load Balancers (ELBs) -- one running ALB can inspect an HTTP request's `Host` header and route to the correct application, eliminating the need for several always-on load balancers.

If your application requires a load balancer, an ALB should be the first choice. There may be some advanced cases where a Network Load Balancer (NLB) is appropriate instead.

The EACD-CloudOps group provisions an ALB intended to be shared by several applications in each AWS account. The information needed to use this shared ALB is available through your shared account resource IaC module.

## ALB Concepts
Application Load Balancers have a few moving parts that you will need to understand.

- The ALB resource itself, which lives in multiple AZs and has a hostname assigned to it
- Listeners bound to a port/protocol (e.g. HTTPS on 443) with an associated TLS certificate
- Rules tied to a listener that route traffic based on the `Host` header
- Target groups -- your application -- to deliver the load-balanced traffic to

ALBs are not able to support an infinite amount of listeners/rules/target groups, so it is important that you create the minimum you require per account. The EACD-CloudOps group will monitor capacity and provision a second shared ALB if/when that becomes necessary. 

If your application is running on an AWS service that supports it, instances (ECS tasks, EC2s, etc) can register themselves with the target group. You can statically register instances to the target group as well.

For a standard application in the non-prod environment, you would create:

- One listener with one SAN certificate for the dev & qa environments
- Two rules, one for each the dev & qa environments
- Two target groups, one for each the dev & qa envrionments

If you need more environments in nonprod, that is fine -- you should still only use one listener. 

## Using the ALB
Using the ALB is a two-step process. 

You will need to run a module for the AWS account (nonprod & prod), as well as a per-environment module.

### Per Account
The per-account module will create a listener and certificate, then publish the listener's ARN:

```hcl
data "terraform_remote_state" "account_resources" {
  backend = "s3"

  config = {
    bucket = "${var.alb_state_bucket}"
    key    = "${var.alb_state_file}"
    region = "${var.alb_state_region}"
  }
}

module "certificate" {
    // The double slash IS significant <https://www.terraform.io/docs/modules/sources.html#modules-in-package-sub-directories>
    source = "github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules//entapp_certificate"

    hostnames = ["my-app-dev.entapp.northwestern.edu", "my-app-qa.entapp.northwestern.edu"]
}

resource "aws_lb_listener" "lb_listener" {
    load_balancer_arn = "${data.terraform_remote_state.account_resources.lb_arn}"
    port              = "443"
    protocol          = "HTTPS"
    ssl_policy        = "ELBSecurityPolicy-2016-08"
    certificate_arn   = "${module.certificate.certificate_arn}"

    default_action {
        type = "fixed-response"
        fixed_response {
            content_type = "text/plain"
            message_body = "No targets are responding to this request."
            status_code = "502"
        }
    }
}

output "alb_listener_arn" {
    value = "${aws_lb_listener.lb_listener.arn}"
}
```

### Per Environment
The per-environment module will reference the listener ARN by loading its tfstate as a remote data:

```hcl
# Need the VPC ID
data "terraform_remote_state" "account_resources" {
  backend = "s3"

  config = {
    bucket = "${var.account_resources_state_bucket}"
    key    = "${var.account_resources_state_file}"
    region = "${var.account_resources_state_region}"
  }
}

# For the listener ARN
data "terraform_remote_state" "alb_listener" {
  backend = "s3"

  config = {
    bucket = "${var.shared_state_bucket}"
    key    = "${var.shared_state_file}"
    region = "${var.shared_state_region}"
  }
}

# So TF knows when to re-generate the target group name
resource "random_id" "target_group_id" {
  keepers {
    name = "${local.lb_target_group_name}"
    vpc_id ="${data.terraform_remote_state.account_resources.vpc_id}"
    target_type = "${local.lb_target_group_target_type}"
  }
  byte_length = 4
}

resource "aws_lb_target_group" "lb_target_group" {
  name     = "${local.lb_target_group_name}-${random_id.target_group_id.hex}"
  port     = "8080"
  protocol = "HTTP"
  deregistration_delay = "${var.deregistration_delay}"
  target_type = "${local.lb_target_group_target_type}"
  vpc_id = "${data.terraform_remote_state.account_resources.vpc_id}"

  health_check {
    healthy_threshold = "${var.hc_healthy_threshold}"
    unhealthy_threshold = "${var.hc_unhealthy_threshold}"
    timeout = "${var.hc_timeout}"
    interval = "${var.hc_interval}"
    path = "${var.hc_path}"
    matcher = "${var.hc_matcher}"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener_rule" "lb_group_rule" {
  listener_arn = "${data.terraform_remote_state.alb_listener.alb_listener_arn}"

  action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.lb_target_group.arn}"
  }
  
  condition {
    field  = "host-header"
    values = ["${var.hostnames}"]
   }
}

# In this example, we're using a Fargate ECS cluster as a target.
# Other services support registering with the target group too.
resource "aws_ecs_service" "ecs_task_serv" {
    name = "${local.ecs_task_name}"
    
    # . . .

    load_balancer {
        target_group_arn = "${aws_lb_target_group.lb_target_group.arn}"
        container_name   = "${local.container_name}"
        container_port   = 80
    }
}
```