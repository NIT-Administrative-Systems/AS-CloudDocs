import{_ as t,M as o,p as r,q as l,R as n,t as e,N as a,a1 as i}from"./framework-bf3e1922.js";const c={},p=n("h1",{id:"jenkins-ecs-agent",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#jenkins-ecs-agent","aria-hidden":"true"},"#"),e(" Jenkins ECS Agent")],-1),d={href:"https://github.com/jenkinsci/amazon-ecs-plugin",target:"_blank",rel:"noopener noreferrer"},u=n("p",null,"For our implementation, we have chosen ECS Fargate. We do not maintain the EC2s or much infrastructure -- we just ask AWS to run a Docker image in our VPC with a specific amount of CPU/memory.",-1),m=n("li",null,[n("p",null,[n("strong",null,"Pro")]),n("ul",null,[n("li",null,"Only billed for the compute we need; no EC2s sitting around idling"),n("li",null,"Rogue jobs filling up disk / using all available CPU/memory will not impact other jobs or crash Jenkins"),n("li",null,"Can get more CPU/memory than the priamry Jenkins server has available")])],-1),h=n("p",null,[n("strong",null,"Con")],-1),k=n("li",null,"Pipeline takes longer to start; has to wait for compute to spin up",-1),v=n("li",null,"Requires JNLP-enabled Docker images; mostly have to write & maintain ourselves",-1),g={href:"https://github.com/jenkinsci/amazon-ecs-plugin/issues/138",target:"_blank",rel:"noopener noreferrer"},b=i(`<h2 id="using-ecs-agent" tabindex="-1"><a class="header-anchor" href="#using-ecs-agent" aria-hidden="true">#</a> Using ECS Agent</h2><p>If you want to use a remote ECS agent, you should adjust the <code>agent</code> block in your pipeline.</p><div class="hint-container warning"><p class="hint-container-title">Work in Progress</p><p>This implementation is a work in progress. It is available in the ADO Jenkins environments.</p><p>Please contact EACD for a current list of applicable <code>inheritFrom</code> containers. We are working to get the Docker image used under dev control.</p></div><div class="language-groovy line-numbers-mode" data-ext="groovy"><pre class="language-groovy"><code><span class="token shebang comment">#!groovy</span>
pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span>
        ecs <span class="token punctuation">{</span>
            inheritFrom <span class="token string">&#39;jenkins-workers-php&#39;</span>
            cpu <span class="token number">2048</span>
            memoryReservation <span class="token number">4096</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    stages <span class="token punctuation">{</span>
        stage <span class="token punctuation">(</span><span class="token string">&#39;Do stuff&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">&#39;yarn install&#39;</span>
                sh <span class="token string">&#39;...&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),f={href:"https://github.com/jenkinsci/amazon-ecs-plugin/blob/master/src/main/java/com/cloudbees/jenkins/plugins/amazonecs/pipeline/ECSDeclarativeAgent.java#L28",target:"_blank",rel:"noopener noreferrer"},y=n("strong",null,"cannot",-1),w={href:"https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html#fargate-tasks-size",target:"_blank",rel:"noopener noreferrer"},_=i(`<div class="hint-container tip"><p class="hint-container-title">Accessing On-Prem Resources</p><p>The remote ECS agents will run in the same subnet that the primary Jenkins server lives in.</p><p>If you need to access secure on-campus resources, submit your firewall requests using the subnet instead of the server&#39;s individual IP.</p></div><p>As with any other Jenkins pipeline, you may choose a different agent in an individual stage block.</p><h3 id="troubleshooting" tabindex="-1"><a class="header-anchor" href="#troubleshooting" aria-hidden="true">#</a> Troubleshooting</h3><p>If you are having problems using ECS remote workers, first check the log for the run in Jenkins. It will indicate if any pipeline errors have occurred.</p><p>If that log does not give you an indication of the issue, log in to your AWS account and check the <code>jenkins-workers</code> ECS cluster. You can see if your task is pending or active, which indicate it&#39;s still running. You can search for stopped tasks as well. Their logs may include useful error messages.</p><p>If you do not see an ECS task being queued at all when you run the pipeline, it is possible the API call to create the ECS task is failing. Double-check your <code>cpu</code>/<code>memoryReservation</code> combination is valid. If it is, contact the EACD or PIPS-CloudOps teams and ask them to review the Jenkins server logs -- AWS API errors are only made available in this logfile.</p><h2 id="adding-jenkins-jnlp-agent-to-docker-image" tabindex="-1"><a class="header-anchor" href="#adding-jenkins-jnlp-agent-to-docker-image" aria-hidden="true">#</a> Adding Jenkins JNLP Agent to Docker image</h2><p>To use a Docker image as an ECS remote worker, it will need the Jenkins JNLP agent installed and configured as the entrypoint.</p><p>Select a suitable base Docker image to extend that includes the language/tool versions you want. You can find an image on Dockerhub, or write your own.</p><h3 id="debian-images" tabindex="-1"><a class="header-anchor" href="#debian-images" aria-hidden="true">#</a> Debian Images</h3><p>This is an example of setting up Java &amp; the agent for a PHP environment maintained by the Gitlab community. Their docker image is a Debian-based system that uses <code>apt</code>.</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> edbizarro/gitlab-ci-pipeline-php:7.2</span>

<span class="token comment">## Install the Jenkins agent on a Debian-family image</span>
<span class="token instruction"><span class="token keyword">USER</span> root # Extended image may leave us as an unpriviledged user</span>

<span class="token comment"># https://github.com/geerlingguy/ansible-role-java/issues/64</span>
<span class="token instruction"><span class="token keyword">RUN</span> mkdir -p /usr/share/man/man1</span>

<span class="token instruction"><span class="token keyword">RUN</span> DEBIAN_FRONTEND=noninteractive apt-get update # fetch package lists</span>
<span class="token instruction"><span class="token keyword">RUN</span> DEBIAN_FRONTEND=noninteractive apt-get install -yqq apt-utils default-jre # install Java runtime</span>

 <span class="token comment"># Copy agent JARs from official Jenkins worker images </span>
<span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">jenkins/slave:latest</span></span> /usr/share/jenkins/agent.jar /usr/share/jenkins/agent.jar</span>
<span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">jenkins/jnlp-slave:latest</span></span> /usr/local/bin/jenkins-agent /usr/bin/jenkins-agent</span>

<span class="token instruction"><span class="token keyword">RUN</span> chmod +x /usr/bin/jenkins-agent &amp;&amp; ln -s /usr/bin/jenkins-agent /usr/bin/jenkins-slave</span>

<span class="token comment"># Create workspace for Jenkins to use.</span>
<span class="token comment"># The \`php\` user is something from the extended image -- an unprivledges user.</span>
<span class="token instruction"><span class="token keyword">RUN</span> mkdir /home/jenkins</span>
<span class="token instruction"><span class="token keyword">RUN</span> chown php:php /home/jenkins</span>

<span class="token instruction"><span class="token keyword">WORKDIR</span> /home/jenkins</span>

<span class="token comment"># Launch w/ the Jenkins agent JAR</span>
<span class="token instruction"><span class="token keyword">ENTRYPOINT</span> [<span class="token string">&quot;jenkins-agent&quot;</span>]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="alpine-linux" tabindex="-1"><a class="header-anchor" href="#alpine-linux" aria-hidden="true">#</a> Alpine Linux</h3><p>Alpine Linux is a minamalist Linux distribution. It is popular in the Docker community, since the minimalism keeps image size down.</p><div class="hint-container warning"><p class="hint-container-title">TODO</p><p>We don&#39;t have an alpine example yet.</p></div>`,15);function j(C,E){const s=o("ExternalLinkIcon");return r(),l("div",null,[p,n("p",null,[e("With the "),n("a",d,[e("Elastic Container Plugin agent for Jenkins"),a(s)]),e(", the work involved in running a Jenkins pipeline (partially or entirely) can be offloaded from the primary Jenkins server to remote compute spun up on-demand. When the pipeline is done running, the compute will be torn down.")]),u,n("ul",null,[m,n("li",null,[h,n("ul",null,[k,v,n("li",null,[e("ECS Agent plugin "),n("a",g,[e("does not currently support Fargate Spot market"),a(s)])])])])]),b,n("p",null,[e("You may override any of the ECS plugin's settings. For a list of available settings, see "),n("a",f,[e("the properties for ECSDeclarativeAgent"),a(s)]),e(".")]),n("p",null,[e("You "),y,e(" pick totally-arbitrary values for CPU/memory. ECS Fargate has an upper bound on how much memory is available based on the CPU shares requested. See Fargate documentation for "),n("a",w,[e("a list of valid CPU/memory size combinations"),a(s)]),e(".")]),_])}const P=t(c,[["render",j],["__file","jenkins-ecs-agent.html.vue"]]);export{P as default};