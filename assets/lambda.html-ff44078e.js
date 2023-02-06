import{_ as p,M as i,p as l,q as c,R as n,t as s,N as e,V as t,a1 as o}from"./framework-bf3e1922.js";const u={},r=n("h1",{id:"lambda",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#lambda","aria-hidden":"true"},"#"),s(" Lambda")],-1),d=n("p",null,"Lambda is the AWS serverless compute platform.",-1),k=n("h2",{id:"public-cloud-vs-vpc",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#public-cloud-vs-vpc","aria-hidden":"true"},"#"),s(" Public Cloud vs. VPC")],-1),m=n("p",null,"By default, Lambdas will run on AWS' public infrastructure. It will be given an IP from AWS' general pool, and it will not have access to campus datacenter resources over the VPN.",-1),v=n("p",null,"If you don't think your Lambda will ever need VPN access, this is fine. Running this way reduces the complexity of your infrastructure.",-1),b=n("a",{href:"#running-in-the-vpc"},"additional network permissions",-1),h=n("h2",{id:"execution-role",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#execution-role","aria-hidden":"true"},"#"),s(" Execution Role")],-1),y=n("p",null,"Lambdas assume an IAM role when they run. This role is what governs their access to other AWS services like CloudWatch (for logging) or DyanmoDB (for your data).",-1),_=n("h3",{id:"cloudwatch-logs",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#cloudwatch-logs","aria-hidden":"true"},"#"),s(" CloudWatch Logs")],-1),g=n("p",null,"Every Lambda should be given access to write its console output to CloudWatch. There are two best practices we recommend here:",-1),w=n("ol",null,[n("li",null,"Explicitly create your CloudWatch log groups with a retention policy"),n("li",null,"Only grant your Lambda access to the necessary log groups")],-1),f=n("code",null,"logs:*/*",-1),q=o(`<p>Here is a working Terraform example that implements these recommendations:</p><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre class="language-hcl"><code><span class="token comment"># Role for the Lambda to assume</span>
<span class="token keyword">resource <span class="token type variable">&quot;aws_iam_role&quot;</span></span> <span class="token string">&quot;lambda_execution_role&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>               <span class="token punctuation">=</span> <span class="token string">&quot;<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">lambda_name</span><span class="token punctuation">}</span></span>-lambda-execution-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">env</span><span class="token punctuation">}</span></span>&quot;</span>
  <span class="token property">assume_role_policy</span> <span class="token punctuation">=</span> data.aws_iam_policy_document.lambda_execution_role.json
  <span class="token property">description</span>        <span class="token punctuation">=</span> <span class="token string">&quot;<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">env</span><span class="token punctuation">}</span></span> - <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">lambda_name</span><span class="token punctuation">}</span></span> Lambda Execution Role&quot;</span>
<span class="token punctuation">}</span>

<span class="token comment"># Boilterplate-y policy that allows Lambda to assume this role</span>
<span class="token keyword">data <span class="token type variable">&quot;aws_iam_policy_document&quot;</span></span> <span class="token string">&quot;lambda_execution_role&quot;</span> <span class="token punctuation">{</span>
  <span class="token keyword">statement</span> <span class="token punctuation">{</span>
    <span class="token property">effect</span> <span class="token punctuation">=</span> <span class="token string">&quot;Allow&quot;</span>

    <span class="token keyword">principals</span> <span class="token punctuation">{</span>
      <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">&quot;Service&quot;</span>

      <span class="token property">identifiers</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
        <span class="token string">&quot;lambda.amazonaws.com&quot;</span>,
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>

    <span class="token property">actions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">&quot;sts:AssumeRole&quot;</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment"># Log group name **MUST** match the Lambda&#39;s name</span>
<span class="token comment"># This is just how Lambda works, you cannot overwrite/change the group your Lambda will log to.</span>
<span class="token keyword">resource <span class="token type variable">&quot;aws_cloudwatch_log_group&quot;</span></span> <span class="token string">&quot;lambda_log_group&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">&quot;/aws/lambda/<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">lambda_name</span><span class="token punctuation">}</span></span>-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">env</span><span class="token punctuation">}</span></span>&quot;</span>

  <span class="token comment"># Set to whatever is appropriate for your project</span>
  <span class="token property">retention_in_days</span> <span class="token punctuation">=</span> <span class="token number">14</span> 
<span class="token punctuation">}</span>

<span class="token comment"># CloudWatch log policy</span>
<span class="token keyword">data <span class="token type variable">&quot;aws_iam_policy_document&quot;</span></span> <span class="token string">&quot;lambda_access_policy&quot;</span> <span class="token punctuation">{</span>
  <span class="token keyword">statement</span> <span class="token punctuation">{</span>
    <span class="token property">effect</span>    <span class="token punctuation">=</span> <span class="token string">&quot;Allow&quot;</span>
    <span class="token property">actions</span>   <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">&quot;logs:CreateLogStream&quot;</span>, <span class="token string">&quot;logs:PutLogEvents&quot;</span><span class="token punctuation">]</span>
    <span class="token property">resources</span> <span class="token punctuation">=</span> aws_cloudwatch_log_group.lambda_log_group.arn
  <span class="token punctuation">}</span>

  <span class="token comment"># You could include other statements too (KMS/SSM, network interface stuff, SES, etc)</span>
<span class="token punctuation">}</span>

<span class="token comment"># Attach the policy to the role</span>
<span class="token keyword">resource <span class="token type variable">&quot;aws_iam_role_policy&quot;</span></span> <span class="token string">&quot;lambda_kms_policy&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>   <span class="token punctuation">=</span> <span class="token string">&quot;<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">lambda_name</span><span class="token punctuation">}</span></span>-lambda-kms-policy-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">env</span><span class="token punctuation">}</span></span>&quot;</span>
  <span class="token property">role</span>   <span class="token punctuation">=</span> aws_iam_role.lambda_execution_role.id
  <span class="token property">policy</span> <span class="token punctuation">=</span> data.aws_iam_policy_document.lambda_access_policy.json
<span class="token punctuation">}</span>

<span class="token comment"># The Lambda itself</span>
<span class="token keyword">resource <span class="token type variable">&quot;aws_lambda_function&quot;</span></span> <span class="token string">&quot;app_lambda&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">function_name</span>    <span class="token punctuation">=</span> <span class="token string">&quot;<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">lambda_name</span><span class="token punctuation">}</span></span>-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">env</span><span class="token punctuation">}</span></span>&quot;</span>
  <span class="token property">role</span>             <span class="token punctuation">=</span> aws_iam_role.lambda_execution_role.arn

  <span class="token comment"># . . . and all the other settings you need</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="running-in-the-vpc" tabindex="-1"><a class="header-anchor" href="#running-in-the-vpc" aria-hidden="true">#</a> Running in the VPC</h3>`,3),x=o(`<p>Here is a policy document you can attach to your Lambda&#39;s execution role. This is a rare situation in which granting something access to <code>*</code> is acceptable:</p><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre class="language-hcl"><code><span class="token keyword">data <span class="token type variable">&quot;aws_iam_policy_document&quot;</span></span> <span class="token string">&quot;lambda_access_policy&quot;</span> <span class="token punctuation">{</span>
  <span class="token keyword">statement</span> <span class="token punctuation">{</span>
    <span class="token property">effect</span> <span class="token punctuation">=</span> <span class="token string">&quot;Allow&quot;</span>

    <span class="token property">actions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">&quot;ec2:CreateNetworkInterface&quot;</span>,
      <span class="token string">&quot;ec2:DescribeNetworkInterfaces&quot;</span>,
      <span class="token string">&quot;ec2:DeleteNetworkInterface&quot;</span>,
      <span class="token string">&quot;ec2:DetachNetworkInterface&quot;</span>,
    <span class="token punctuation">]</span>

    <span class="token property">resources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function L(C,S){const a=i("RouterLink");return l(),c("div",null,[r,d,k,m,v,n("p",null,[s("If you do need access to campus resources, you will need to specify the VPC ID, "),e(a,{to:"/infrastructure/vpc-ip-addr.html"},{default:t(()=>[s("obtain subnets")]),_:1}),s(", and give your Lambda some "),b,s(".")]),h,y,_,g,w,n("p",null,[s("If you do not explicitly create the log group, AWS may create it for you implicitly. This is problematic later on: you will eventually want to set up a retention policy so the logs aren't kept forever, but Terraform won't be able to create the group since it already exists. If this has already happened, contact the EACD-CloudOps team and they can help "),e(a,{to:"/iac/tf-import.html"},{default:t(()=>[s("import the resource into terraform")]),_:1}),s(".")]),n("p",null,[s("Your IAM role is probably too broad if it's able to create the log group too: you may have granted your Lambda access to something like "),f,s(", which will cover every log group in the account. "),e(a,{to:"/infrastructure/iam.html"},{default:t(()=>[s("This is not permitted")]),_:1}),s(" in AS, but older IaC modules may have been implemented this way.")]),q,n("p",null,[s("If your Lambda is going to "),e(a,{to:"/infrastructure/vpc-ip-addr.html"},{default:t(()=>[s("run in the VPC")]),_:1}),s(` so it has VPN access to the campus datacenters, you will need to give it some of the EC2 network permissions. This may seem counter-intuitive -- Lambda isn't EC2 -- but all of the network interface stuff is "part" of the EC2 service.`)]),x])}const A=p(u,[["render",L],["__file","lambda.html.vue"]]);export{A as default};