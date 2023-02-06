import{_ as i,M as a,p as r,q as l,R as e,t as n,N as t,V as c,a1 as u}from"./framework-bf3e1922.js";const p={},d=e("h1",{id:"cloudfront-cdn",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#cloudfront-cdn","aria-hidden":"true"},"#"),n(" CloudFront CDN")],-1),h=e("p",null,"CloudFront is Amazon's content delivery network. It allows you to cache static files like images, JS, and CSS in locations physically close to users, improving load times for your website.",-1),m={href:"https://vuepress.vuejs.org/",target:"_blank",rel:"noopener noreferrer"},f=e("p",null,"API Gateway offers an edge-optimized version of the product when you're using a custom domain name. This is powered by CloudFront; requests to your API hit Amazon's edge locations and then follow curated network paths back to the AWS region your app exists in.",-1),b=e("h2",{id:"usage",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#usage","aria-hidden":"true"},"#"),n(" Usage")],-1),v=e("p",null,"You should use it for every web application's static content, unless there is a compelling reason to do otherwise.",-1),_=e("p",null,"You can set it up for API Gateway. If your API is primarily going to be used via Apigee, it is not as valuable and can be omitted.",-1),g={href:"https://aws.amazon.com/cloudfront/pricing/",target:"_blank",rel:"noopener noreferrer"},k=u(`<p>Whenever you change the underlying S3 content, you need to issue a cache invalidation to tell CloudFront that it needs to refresh their caches. This is typically done in your Jenkins pipeline, after you have done an S3 sync. Your terraform module should output the S3 bucket &amp; CloudFront distribution name:</p><div class="language-groovy line-numbers-mode" data-ext="groovy"><pre class="language-groovy"><code>stage <span class="token punctuation">(</span><span class="token string">&#39;Upload Site&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    steps <span class="token punctuation">{</span>
        <span class="token function">withCredentials</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">[</span>
            <span class="token punctuation">$</span><span class="token keyword">class</span><span class="token punctuation">:</span> <span class="token string">&#39;AmazonWebServicesCredentialsBinding&#39;</span><span class="token punctuation">,</span>
            credentialsId<span class="token punctuation">:</span> <span class="token string">&#39;terraform&#39;</span><span class="token punctuation">,</span>
            accessKeyVariable<span class="token punctuation">:</span> <span class="token string">&#39;AWS_ACCESS_KEY_ID&#39;</span><span class="token punctuation">,</span>
            secretKeyVariable<span class="token punctuation">:</span> <span class="token string">&#39;AWS_SECRET_ACCESS_KEY&#39;</span>
        <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            sh <span class="token string">&#39;export BUCKET_NAME=\`terraform output content_bucket_name\` &amp;&amp; aws s3 sync .build/site &quot;s3://\\$BUCKET_NAME&quot; --delete&#39;</span>
            sh <span class="token string">&#39;export CF_DIST_NAME=\`terraform output cf_distribution_name\` &amp;&amp; aws cloudfront create-invalidation --distribution-id &quot;\\$CF_DIST_NAME&quot; --paths &quot;/*&quot;&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="lambda-edge" tabindex="-1"><a class="header-anchor" href="#lambda-edge" aria-hidden="true">#</a> Lambda@Edge</h2>`,3),y={href:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html#limits-lambda-at-edge",target:"_blank",rel:"noopener noreferrer"},w=e("p",null,"This is a tool of last resort. It is powerful, but building application logic into CloudFront -- potentially across several different Lambda@Edge functions, each of which hooks in to a different part of the HTTP request -- is a bad practice. Application logic is best kept in the application, so developers will be able to see the entire picture when developing locally.",-1);function C(A,S){const s=a("ExternalLinkIcon"),o=a("RouterLink");return r(),l("div",null,[d,h,e("p",null,[n("The secondary function of CloudFront is that it enables you to run Lambda@Edge functions along with requests for cached files. We have used this to deploy "),e("a",m,[n("static websites"),t(s)]),n(" to an S3 bucket, then serve the content with CloudFront and a webSSO Lambda@Edge function.")]),f,b,e("p",null,[n("At our scale, CloudFront is very cheap. It is not difficult to set up: you just need a "),t(o,{to:"/infrastructure/certificates.html"},{default:c(()=>[n("certificate")]),_:1}),n(" and a hostname.")]),v,_,e("p",null,[n("There are "),e("a",g,[n("three price classes"),t(s)]),n(" for CloudFront that control which geographical regions will have your data cached. If your application is primarily going to be used on campus, the cheapest class includes North America. Users in other regions will still be able to use your app.")]),k,e("p",null,[n("Lambda@Edge runs alongside Amazon's caches. Because it's part of the HTTP request, "),e("a",y,[n("the limits are more restrictive"),t(s)]),n(".")]),w])}const I=i(p,[["render",C],["__file","cloudfront.html.vue"]]);export{I as default};
