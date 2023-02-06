import{_ as n,p as e,q as s,a1 as a}from"./framework-bf3e1922.js";const t="/AS-CloudDocs/assets/sharing-resources-45e542ff.png",o={},i=a('<h1 id="example-terraform-module" tabindex="-1"><a class="header-anchor" href="#example-terraform-module" aria-hidden="true">#</a> Example Terraform Module</h1><p>To illustrate the resource and module sharing concepts, think about an application deployed on the Elastic Container Service (ECS). You need the following resources:</p><ul><li><p>Per account</p><ul><li>Load balancer listener for the application (nonprod&#39;s would cover dev/qa)</li><li>HTTPS certificate for the load balancer</li></ul></li><li><p>Per application environment</p><ul><li>Load balancer target group</li><li>ECS &amp; EC2 resources</li><li>CloudWatch alarms</li></ul></li></ul><p>That is two modules you would require -- one for shared account resources, and one for the application&#39;s dev/QA/production/etc environments. Both of these modules will need information about the account&#39;s VPC, and what subnet IDs have been allocated for the application by the AS Cloud Services team.</p><p>The load balancer will require a certificate. There is a ready-made module for generating certificate requests under the <code>entapp.northwestern.edu</code> domain available in Github, so that can be used.</p><p>The per-application environment module will need to know the ARN for the load balancer listenen, so it can tie the target groups to it.</p><p><img src="'+t+`" alt="Terraform module relationships"></p><p>Generating the certificate with the module that the AS Cloud Services team has already provided is easy:</p><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre class="language-hcl"><code><span class="token comment"># The hostname(s) will be passed in, as you&#39;d want different ones for sandbox/nonprod/prod.</span>
<span class="token comment"># This module will automatically decide if you need a SAN cert (supports multiple hostnames) or a regular</span>
<span class="token comment"># cert (with one hostname).</span>
<span class="token keyword">module<span class="token type variable"> &quot;certificate&quot; </span></span><span class="token punctuation">{</span>
    <span class="token comment">// The double slash IS significant &lt;https://www.terraform.io/docs/modules/sources.html#modules-in-package-sub-directories&gt;</span>
    <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">&quot;github.com/NIT-Administrative-Systems/AS-Common-AWS-Modules//entapp_certificate?ref=tf-0.12&quot;</span>

    <span class="token property">hostnames</span> <span class="token punctuation">=</span> var.hostnames
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This will expose the certificate&#39;s ARN as an attribute, which will be used in the next example.</p><p>The per-account module can access the remote state of your account&#39;s shared resources by declaring a <code>terraform_remote_state</code> resource and providing it with the location of that module&#39;s state file:</p><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre class="language-hcl"><code><span class="token comment"># You would pass the correct S3 bucket and file for the account in.</span>
<span class="token comment">#</span>
<span class="token comment"># Sandbox / nonprod / prod would all be slightly different bucket</span>
<span class="token comment"># names and keys.</span>
<span class="token keyword">data <span class="token type variable">&quot;terraform_remote_state&quot;</span></span> <span class="token string">&quot;account_wide_alb&quot;</span> <span class="token punctuation">{</span>
  <span class="token property">backend</span> <span class="token punctuation">=</span> <span class="token string">&quot;s3&quot;</span>

  <span class="token property">config</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">bucket</span> <span class="token punctuation">=</span> var.alb_state_bucket
    <span class="token property">key</span>    <span class="token punctuation">=</span> var.alb_state_file
    <span class="token property">region</span> <span class="token punctuation">=</span> var.alb_state_region
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment"># And then you can access any attributes that your shared account resource module</span>
<span class="token comment"># exposes with data.terraform_remote_state.{module_name}.{attribute}, as shown here</span>
<span class="token comment"># in the load_balancer_arn argument.</span>
<span class="token comment">#</span>
<span class="token comment"># This also uses the certificate_arn attribute of the cert module we invoked in the</span>
<span class="token comment"># previous example.</span>
<span class="token keyword">resource <span class="token type variable">&quot;aws_lb_listener&quot;</span></span> <span class="token string">&quot;lb_listener&quot;</span> <span class="token punctuation">{</span>
    <span class="token property">load_balancer_arn</span> <span class="token punctuation">=</span> data.terraform_remote_state.account_wide_alb.outputs.lb_arn
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

<span class="token comment"># Exports the listener&#39;s ARN as an attribute. </span>
<span class="token comment">#</span>
<span class="token comment"># You will need to access this in the per-environment module.</span>
<span class="token keyword">output<span class="token type variable"> &quot;alb_listener_arn&quot; </span></span><span class="token punctuation">{</span>
    <span class="token property">value</span> <span class="token punctuation">=</span> aws_lb_listener.lb_listener.arn
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Using another <code>terraform_remote_state</code> resource, you can access the <code>alb_listener_arn</code> attribute in your per-environment module.</p>`,13),l=[i];function c(p,r){return e(),s("div",null,l)}const d=n(o,[["render",c],["__file","example-tf.html.vue"]]);export{d as default};
