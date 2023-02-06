import{_ as e,M as t,p as o,q as p,R as n,t as s,N as i,V as l,a1 as r}from"./framework-bf3e1922.js";const c={},u=n("h1",{id:"application-load-balancers",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#application-load-balancers","aria-hidden":"true"},"#"),s(" Application Load Balancers")],-1),d=n("p",null,[s("Application Load Balancers (ALBs) are Amazon's latest load balancer offering. They are a significant upgrade over the classic Elastic Load Balancers (ELBs) -- one running ALB can inspect an HTTP request's "),n("code",null,"Host"),s(" header and route to the correct application, eliminating the need for several always-on load balancers.")],-1),v=n("p",null,"If your application requires a load balancer, an ALB should be the first choice. There may be some advanced cases where a Network Load Balancer (NLB) is appropriate instead.",-1),k=n("p",null,"The EACD-CloudOps group provisions an ALB intended to be shared by several microservice or API applications in each AWS account. The information needed to use this shared ALB is available through your shared account resource IaC module.",-1),m={class:"hint-container warning"},b=n("p",{class:"hint-container-title"},"Customer-Facing Applications",-1),h=n("p",null,[s("The shared account ALB is "),n("strong",null,"not"),s(" intended for use by customer-facing web applications.")],-1),_=n("p",null,"Only one app may create a listener for port 443. Using non-standard ports for APIs is a good trade-off of cost:convenience, since most of our services are going to be proxied through the API gateway provider anyway.",-1),g=r(`<h2 id="alb-concepts" tabindex="-1"><a class="header-anchor" href="#alb-concepts" aria-hidden="true">#</a> ALB Concepts</h2><p>Application Load Balancers have a few moving parts that you will need to understand.</p><ul><li>The ALB resource itself, which lives in multiple AZs and has a hostname assigned to it</li><li>Listeners bound to a port/protocol (e.g. HTTPS on 443) with an associated TLS certificate</li><li>Rules tied to a listener that route traffic based on the <code>Host</code> header</li><li>Target groups -- your application -- to deliver the load-balanced traffic to</li></ul><p>ALBs are not able to support an infinite amount of listeners/rules/target groups, so it is important that you create the minimum you require per account. The EACD-CloudOps group will monitor capacity and provision a second shared ALB if/when that becomes necessary.</p><p>If your application is running on an AWS service that supports it, instances (ECS tasks, EC2s, etc) can register themselves with the target group. You can statically register instances to the target group as well.</p><p>For a standard application in the non-prod environment, you would create:</p><ul><li>One listener with one SAN certificate for the dev &amp; qa environments</li><li>Two rules, one for each the dev &amp; qa environments</li><li>Two target groups, one for each the dev &amp; qa envrionments</li></ul><p>If you need more environments in nonprod, that is fine -- you should still only use one listener.</p><h2 id="using-the-shared-alb" tabindex="-1"><a class="header-anchor" href="#using-the-shared-alb" aria-hidden="true">#</a> Using the Shared ALB</h2><p>Using the shared ALB is a two-step process.</p><p>You will need to run a module for the AWS account (nonprod &amp; prod), as well as a per-environment module.</p><h3 id="per-account" tabindex="-1"><a class="header-anchor" href="#per-account" aria-hidden="true">#</a> Per Account</h3><p>The per-account module will create a listener and certificate, then publish the listener&#39;s ARN:</p><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre class="language-hcl"><code><span class="token keyword">data <span class="token type variable">&quot;terraform_remote_state&quot;</span></span> <span class="token string">&quot;account_resources&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">backend</span> <span class="token punctuation">=</span> <span class="token string">&quot;s3&quot;</span>

  <span class="token property">config</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">bucket</span> <span class="token punctuation">=</span> var.alb_state_bucket
    <span class="token property">key</span>    <span class="token punctuation">=</span> var.alb_state_file
    <span class="token property">region</span> <span class="token punctuation">=</span> var.alb_state_region
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">module<span class="token type variable"> &quot;certificate&quot; </span></span><span class="token punctuation">{</span>
    <span class="token comment">// The double slash IS significant &lt;https://www.terraform.io/docs/modules/sources.html#modules-in-package-sub-directories&gt;</span>
    <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">&quot;github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules//entapp_certificate?ref=tf-0.12&quot;</span>

    <span class="token property">hostnames</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">&quot;my-app-dev.entapp.northwestern.edu&quot;</span>, <span class="token string">&quot;my-app-qa.entapp.northwestern.edu&quot;</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">&quot;aws_lb_listener&quot;</span></span> <span class="token string">&quot;lb_listener&quot;</span> <span class="token punctuation">{</span>
    <span class="token property">load_balancer_arn</span> <span class="token punctuation">=</span> data.terraform_remote_state.account_resources.outputs.lb_arn
    <span class="token property">port</span>              <span class="token punctuation">=</span> <span class="token string">&quot;443&quot;</span>
    <span class="token property">protocol</span>          <span class="token punctuation">=</span> <span class="token string">&quot;HTTPS&quot;</span>
    <span class="token property">ssl_policy</span>        <span class="token punctuation">=</span> <span class="token string">&quot;ELBSecurityPolicy-2016-08&quot;</span>
    <span class="token property">certificate_arn</span>   <span class="token punctuation">=</span> module.certificate.certificate_arn

    <span class="token keyword">default_action</span> <span class="token punctuation">{</span>
        <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">&quot;fixed-response&quot;</span>
        <span class="token keyword">fixed_response</span> <span class="token punctuation">{</span>
            <span class="token property">content_type</span> <span class="token punctuation">=</span> <span class="token string">&quot;text/plain&quot;</span>
            <span class="token property">message_body</span> <span class="token punctuation">=</span> <span class="token string">&quot;No targets are responding to this request.&quot;</span>
            <span class="token property">status_code</span> <span class="token punctuation">=</span> <span class="token string">&quot;502&quot;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> &quot;alb_listener_arn&quot; </span></span><span class="token punctuation">{</span>
    <span class="token property">value</span> <span class="token punctuation">=</span> aws_lb_listener.lb_listener.arn
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="per-environment" tabindex="-1"><a class="header-anchor" href="#per-environment" aria-hidden="true">#</a> Per Environment</h3><p>The per-environment module will reference the listener ARN by loading its tfstate as a remote data:</p><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre class="language-hcl"><code><span class="token comment"># Need the VPC ID</span>
<span class="token keyword">data <span class="token type variable">&quot;terraform_remote_state&quot;</span></span> <span class="token string">&quot;account_resources&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">backend</span> <span class="token punctuation">=</span> <span class="token string">&quot;s3&quot;</span>

  <span class="token property">config</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">bucket</span> <span class="token punctuation">=</span> var.account_resources_state_bucket
    <span class="token property">key</span>    <span class="token punctuation">=</span> var.account_resources_state_file
    <span class="token property">region</span> <span class="token punctuation">=</span> var.account_resources_state_region
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment"># For the listener ARN</span>
<span class="token keyword">data <span class="token type variable">&quot;terraform_remote_state&quot;</span></span> <span class="token string">&quot;alb_listener&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">backend</span> <span class="token punctuation">=</span> <span class="token string">&quot;s3&quot;</span>

  <span class="token property">config</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">bucket</span> <span class="token punctuation">=</span> var.shared_state_bucket
    <span class="token property">key</span>    <span class="token punctuation">=</span> var.shared_state_file
    <span class="token property">region</span> <span class="token punctuation">=</span> var.shared_state_region
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment"># So TF knows when to re-generate the target group name</span>
<span class="token keyword">resource <span class="token type variable">&quot;random_id&quot;</span></span> <span class="token string">&quot;target_group_id&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">keepers</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">name</span> <span class="token punctuation">=</span> local.lb_target_group_name
    <span class="token property">vpc_id</span> <span class="token punctuation">=</span> data.terraform_remote_state.account_resources.outputs.vpc_id
    <span class="token property">target_type</span> <span class="token punctuation">=</span> local.lb_target_group_target_type
  <span class="token punctuation">}</span>
  <span class="token property">byte_length</span> <span class="token punctuation">=</span> <span class="token number">4</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">&quot;aws_lb_target_group&quot;</span></span> <span class="token string">&quot;lb_target_group&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>     <span class="token punctuation">=</span> local.lb_target_group_name<span class="token punctuation">}</span>-$<span class="token punctuation">{</span>random_id.target_group_id.hex
  <span class="token property">port</span>     <span class="token punctuation">=</span> <span class="token string">&quot;8080&quot;</span>
  <span class="token property">protocol</span> <span class="token punctuation">=</span> <span class="token string">&quot;HTTP&quot;</span>
  <span class="token property">deregistration_delay</span> <span class="token punctuation">=</span> var.deregistration_delay
  <span class="token property">target_type</span> <span class="token punctuation">=</span> local.lb_target_group_target_type
  <span class="token property">vpc_id</span> <span class="token punctuation">=</span> data.terraform_remote_state.account_resources.outputs.vpc_id

  <span class="token keyword">health_check</span> <span class="token punctuation">{</span>
    <span class="token property">healthy_threshold</span> <span class="token punctuation">=</span> var.hc_healthy_threshold
    <span class="token property">unhealthy_threshold</span> <span class="token punctuation">=</span> var.hc_unhealthy_threshold
    <span class="token property">timeout</span> <span class="token punctuation">=</span> var.hc_timeout
    <span class="token property">interval</span> <span class="token punctuation">=</span> var.hc_interval
    <span class="token property">path</span> <span class="token punctuation">=</span> var.hc_path
    <span class="token property">matcher</span> <span class="token punctuation">=</span> var.hc_matcher
  <span class="token punctuation">}</span>

  <span class="token keyword">lifecycle</span> <span class="token punctuation">{</span>
    <span class="token property">create_before_destroy</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">&quot;aws_lb_listener_rule&quot;</span></span> <span class="token string">&quot;lb_group_rule&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">listener_arn</span> <span class="token punctuation">=</span> data.terraform_remote_state.alb_listener.outputs.alb_listener_arn

  <span class="token keyword">action</span> <span class="token punctuation">{</span>
    <span class="token property">type</span>             <span class="token punctuation">=</span> <span class="token string">&quot;forward&quot;</span>
    <span class="token property">target_group_arn</span> <span class="token punctuation">=</span> aws_lb_target_group.lb_target_group.arn
  <span class="token punctuation">}</span>
  
  <span class="token keyword">condition</span> <span class="token punctuation">{</span>
    <span class="token property">field</span>  <span class="token punctuation">=</span> <span class="token string">&quot;host-header&quot;</span>
    <span class="token property">values</span> <span class="token punctuation">=</span> var.hostnames
   <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment"># In this example, we&#39;re using a Fargate ECS cluster as a target.</span>
<span class="token comment"># Other services support registering with the target group too.</span>
<span class="token keyword">resource <span class="token type variable">&quot;aws_ecs_service&quot;</span></span> <span class="token string">&quot;ecs_task_serv&quot;</span> <span class="token punctuation">{</span>
    <span class="token property">name</span> <span class="token punctuation">=</span> local.ecs_task_name
    
    <span class="token comment"># . . .</span>

    <span class="token keyword">load_balancer</span> <span class="token punctuation">{</span>
        <span class="token property">target_group_arn</span> <span class="token punctuation">=</span> aws_lb_target_group.lb_target_group.arn
        <span class="token property">container_name</span>   <span class="token punctuation">=</span> local.container_name
        <span class="token property">container_port</span>   <span class="token punctuation">=</span> <span class="token number">80</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17);function y(f,q){const a=t("RouterLink");return o(),p("div",null,[u,d,v,k,n("div",m,[b,h,_,n("p",null,[s("You can provision your own ALB directly with terraform, or by using our "),i(a,{to:"/iac/available-modules.html"},{default:l(()=>[s("ALB terraform module")]),_:1}),s(".")])]),g])}const A=e(c,[["render",y],["__file","alb.html.vue"]]);export{A as default};
