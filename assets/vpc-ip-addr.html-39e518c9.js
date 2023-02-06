import{_ as c,M as t,p as l,q as u,R as s,t as e,N as a,V as o,a1 as i}from"./framework-bf3e1922.js";const d={},p=s("h1",{id:"vpcs-ip-addressing",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#vpcs-ip-addressing","aria-hidden":"true"},"#"),e(" VPCs & IP Addressing")],-1),h=i('<p>If you wish to run an application inside the VPC, you will need to be assigned a subnet. This is a smaller slice of the VPC&#39;s total IP pool. Depending on the application, you may be given shared subnets or a dedicated app-specific subnets. EC2s, ECS containers, Lambdas, and any AWS service utilizing these compute services can be provided with a VPC ID &amp; subnet IDs.</p><p>You will typically receive a pair of subnet IDs, with each subnet being configured to exist in a different availability zone.</p><h2 id="assignment" tabindex="-1"><a class="header-anchor" href="#assignment" aria-hidden="true">#</a> Assignment</h2><p>Your VPC has a limited amount of IP space on the Northwestern network. This resource is managed by the EACD-CloudOps group, so you should ask them for an appropriate subnet for your application.</p><p>Subnet assignments are done in your account&#39;s shared resources Github repository as infrastructure-as-code.</p><p>In cases where you are certain that you do not need to access resources in the campus datacenter, you do not need a subnet allocation -- Amazon can provide the IPs from their pool of public addresses.</p><h3 id="considerations" tabindex="-1"><a class="header-anchor" href="#considerations" aria-hidden="true">#</a> Considerations</h3><p>Each AWS account has a pair of &quot;general use&quot; subnets, generally labelled Pvt-AZ1/Pvt-AZ2 and Pub-AZ1/Pub-AZ2. You can make use of these if you are not concerned about firewalls or IP whitelisting to allow your application access to on-campus resources.</p><p>If you wanted a service on AWS to access an Oracle DB in the datacenter, you would likely want a dedicated subnet for your application. Then, this subnet could be permitted access to the Oracle server without granting any other apps access.</p><p>We do not give you a single IP address in a subnet. All firewall rules should be done for the assigned subnets (usually two; one per availability zone). Lambdas may use any IP from the subnet at any point, and EC2 or ECS machines will change addresses as you deploy new versions of your application (as you usually create a new instance before tearing down the old one).</p><h3 id="assignment-process" tabindex="-1"><a class="header-anchor" href="#assignment-process" aria-hidden="true">#</a> Assignment Process</h3><p>The EACD-CloudOps group will evaluate your request and determine if you need a dedicated subnet for your application, or if you can use an existing shared subnet. Factors such as application isolation and concurrent compute resource are considered.</p>',12),b={href:"http://www.davidc.net/sites/default/subnets/subnets.html",target:"_blank",rel:"noopener noreferrer"},m=s("p",null,"If all available IP space is exhausted, the PIPS-CloudOps group will be engaged. They will work with TNS to add additional subnet(s) to the VPC.",-1),v=s("h2",{id:"using-subnets",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#using-subnets","aria-hidden":"true"},"#"),e(" Using Subnets")],-1),y=i(`<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre class="language-hcl"><code><span class="token keyword">data <span class="token type variable">&quot;terraform_remote_state&quot;</span></span> <span class="token string">&quot;account_resources&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">backend</span> <span class="token punctuation">=</span> <span class="token string">&quot;s3&quot;</span>

  <span class="token property">config</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">bucket</span> <span class="token punctuation">=</span> var.account_resources_state_bucket
    <span class="token property">key</span>    <span class="token punctuation">=</span> var.account_resources_state_file
    <span class="token property">region</span> <span class="token punctuation">=</span> var.account_resources_state_region
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">&quot;aws_ecs_service&quot;</span></span> <span class="token string">&quot;ecs_task_serv&quot;</span> <span class="token punctuation">{</span>
    <span class="token property">name</span> <span class="token punctuation">=</span> local.ecs_task_name
    
    <span class="token comment">// . . .</span>

    <span class="token keyword">network_configuration</span> <span class="token punctuation">{</span>
        <span class="token property">subnets</span> <span class="token punctuation">=</span> data.terraform_remote_state.account_resources.docconv_subnets
        <span class="token comment">// . . .</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function f(k,g){const n=t("RouterLink"),r=t("ExternalLinkIcon");return l(),u("div",null,[p,s("p",null,[e("As mentioned in the "),a(n,{to:"/infrastructure/aws-account-design.html"},{default:o(()=>[e("AWS account design")]),_:1}),e(" article, each account will have a Virtual Private Cloud (VPC) with a large block of Northwestern LAN IPs assigned to it. These addresses can route back to the campus datacenters by way of a VPN.")]),h,s("p",null,[e("A "),s("a",b,[e("subnetting tool"),a(r)]),e(" will help determine how to split remaining IP space up. Amazon only allows us to split subnets as small as a /28. An entry will be added to your account's shared resource IaC and the subnet will be provisioned.")]),m,v,s("p",null,[e("To use subnets in your IaC modules, you will want to create a "),a(n,{to:"/iac/as-tf-modules.html"},{default:o(()=>[e("remote resource to load the tfstate")]),_:1}),e(" from your shared account resources module. The remote resource will make the subnet IDs available for use.")]),y])}const w=c(d,[["render",f],["__file","vpc-ip-addr.html.vue"]]);export{w as default};
