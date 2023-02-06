import{_ as i,M as a,p as s,q as d,R as t,t as e,N as r,a1 as n}from"./framework-bf3e1922.js";const c={},l=t("h1",{id:"overview",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#overview","aria-hidden":"true"},"#"),e(" Overview")],-1),h={href:"https://www.cloud.northwestern.edu/",target:"_blank",rel:"noopener noreferrer"},u=n('<p>This is a living document. It will grow and evolve as our cloud practice matures. All Northwestern developers are welcome to contribute to this website.</p><h2 id="purpose" tabindex="-1"><a class="header-anchor" href="#purpose" aria-hidden="true">#</a> Purpose</h2><p>The purpose of this site is to document requirements, recommendations, and best practices for Administrative Systems&#39; cloud applications.</p><p>It will explain specific practices for cloud-native app architetcure, lift &amp; shifts for legacy workloads, CI/CD, version control, IaC, and operations. This is not intended to replace training for cloud providers or tools.</p><p>To foster collaboration between other IT groups, both inside Northwestern &amp; with other universities, this website is a public resource.</p><h2 id="terminology" tabindex="-1"><a class="header-anchor" href="#terminology" aria-hidden="true">#</a> Terminology</h2><table><thead><tr><th>Term</th><th>Other Terms</th><th>Definition</th></tr></thead><tbody><tr><td>Infrastructure as Code (IaC)</td><td>Terraform, CloudFormation</td><td>Code that declares what cloud resources you want &amp; how they connect together.</td></tr><tr><td>Continuous Integration (CI) / Continuous Deployment (CD)</td><td><em>n/a</em></td><td>The practice of running automated tests / deployments whenever your code is updated.</td></tr></tbody></table><h2 id="contributing" tabindex="-1"><a class="header-anchor" href="#contributing" aria-hidden="true">#</a> Contributing</h2>',8),p={href:"https://vuepress.vuejs.org/",target:"_blank",rel:"noopener noreferrer"},m=n(`<p>The fastest way to contribute is by clicking the &#39;Edit Page&#39; link at the bottom of a page. This will bring you directly to GitHub with an editor open.</p><p>For more involved changes, you can run a local copy of the website. You will need node and yarn:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">yarn</span> <span class="token function">install</span>
<span class="token function">yarn</span> run docs:dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,3);function f(b,v){const o=a("ExternalLinkIcon");return s(),d("div",null,[l,t("p",null,[e("Welcome to the Northwestern IT Administrative Systems cloud documentation. This site is a resource for Administrative Systems staff who are building & operating applications in the cloud as part of our greater "),t("a",h,[e("NUIT cloud initatives"),r(o)]),e(".")]),u,t("p",null,[e("Pull requests are welcome! This site is mostly just markdown files, so it's easy to modify & preview right on GitHub. The site is built on "),t("a",p,[e("VuePress"),r(o)]),e(".")]),m])}const g=i(c,[["render",f],["__file","index.html.vue"]]);export{g as default};
