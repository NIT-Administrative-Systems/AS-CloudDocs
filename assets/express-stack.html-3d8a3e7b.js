import{_ as a,M as r,p as l,q as i,R as e,t as n,N as s,a1 as o}from"./framework-bf3e1922.js";const p={},c=e("h1",{id:"expressjs-stack",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#expressjs-stack","aria-hidden":"true"},"#"),n(" ExpressJS Stack")],-1),d={href:"https://expressjs.com/",target:"_blank",rel:"noopener noreferrer"},u={href:"https://github.com/dougmoscrop/serverless-http",target:"_blank",rel:"noopener noreferrer"},h=e("h2",{id:"getting-started",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#getting-started","aria-hidden":"true"},"#"),n(" Getting Started")],-1),b={href:"https://github.com/NIT-Administrative-Systems/AS-serverless-nodejs-api",target:"_blank",rel:"noopener noreferrer"},_=e("p",null,"You can create a new repository using this template from GitHub's new repository page.",-1),m=e("h2",{id:"stack",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#stack","aria-hidden":"true"},"#"),n(" Stack")],-1),g=e("p",null,"Express is a minimalistic framework. It does not bring its own opinions about libraries & design patterns to the table, leaving these up to the developer. Below are the libraries that are recommended for various purposes. When applicable to an application, these should be used.",-1),f=e("div",{class:"hint-container tip"},[e("p",{class:"hint-container-title"},"The Administrative Systems Seal of Approval"),e("p",null,'These serve as a good set of "default" options for things.'),e("p",null,"There may be use-cases where something else is better, but unless & until a justification can be made to use something else, you should draw from this list."),e("p",null,"Using the same libraries will allow AS developers to transfer between projects more easily, as technical competencies developed in one project will be transferrable to other projects.")],-1),v=e("thead",null,[e("tr",null,[e("th",null,"Package"),e("th",null,"Purpose")])],-1),k=e("tr",null,[e("td",null,"AWS Lambda"),e("td",null,"Platform")],-1),y=e("tr",null,[e("td",null,"AWS DynamoDB"),e("td",null,"Document DB, session store, cache")],-1),w=e("tr",null,[e("td",null,[n("PostgreSQL "),e("em",null,"(available as Aurora Serverless RDS for PostgreSQL on AWS)")]),e("td",null,"Relational DB")],-1),q={href:"https://github.com/NIT-Administrative-Systems/nusso-node",target:"_blank",rel:"noopener noreferrer"},S=e("td",null,"WebSSO",-1),x={href:"https://github.com/NIT-Administrative-Systems/ADO-SSO-node-express-example",target:"_blank",rel:"noopener noreferrer"},j=e("td",null,"WebSSO",-1),A={href:"https://github.com/dougmoscrop/serverless-http",target:"_blank",rel:"noopener noreferrer"},T=e("td",null,"ExpressJS Lambda/API Gateway adapter",-1),O={href:"https://fontawesome.com/",target:"_blank",rel:"noopener noreferrer"},I=e("td",null,"Icons",-1),L={href:"https://momentjs.com/",target:"_blank",rel:"noopener noreferrer"},N=e("td",null,"DateTime & timezone manipulation",-1),W={href:"https://github.com/google/libphonenumber#third-party-ports",target:"_blank",rel:"noopener noreferrer"},E=e("td",null,"Phone number info & validation",-1),P={href:"https://github.com/axios/axios",target:"_blank",rel:"noopener noreferrer"},B=e("td",null,"HTTP client",-1),D={href:"https://github.com/oracle/node-oracledb",target:"_blank",rel:"noopener noreferrer"},C=e("sup",null,"*",-1),H=e("td",null,"Oracle DB driver",-1),M={href:"https://www.npmjs.com/package/@sentry/node",target:"_blank",rel:"noopener noreferrer"},J=e("td",null,"Error logging",-1),R=e("tr",null,[e("td",null,"AirBnB eslint rules"),e("td",null,"Code style")],-1),V={href:"https://github.com/expressjs/body-parser",target:"_blank",rel:"noopener noreferrer"},z=e("td",null,"Express middleware to parse HTTP request body",-1),G=e("tr",null,[e("td",null,[e("small",null,[e("sup",null,"*"),n(" See the "),e("a",{href:"#oracle-on-aws-lambda"},"section below"),n(" on setting up the Oracle driver.")])]),e("td")],-1),Y=e("p",null,[e("small",null,[n("† Sentry recently released "),e("code",null,"@sentry/serverless"),n(" for NodeJS on Lambda. This package has not yet been evaluated.")])],-1),Q=e("p",null,"There is currently no consensus on a JS testing framework. ADO has used the following successfully:",-1),F={href:"https://mochajs.org/",target:"_blank",rel:"noopener noreferrer"},U={href:"https://www.chaijs.com/",target:"_blank",rel:"noopener noreferrer"},$={href:"https://istanbul.js.org/",target:"_blank",rel:"noopener noreferrer"},K={href:"https://jestjs.io/",target:"_blank",rel:"noopener noreferrer"},X=e("h2",{id:"code-style-linting",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#code-style-linting","aria-hidden":"true"},"#"),n(" Code Style & Linting")],-1),Z=e("p",null,[n("The "),e("code",null,"airbnb-base"),n(" set of rules for eslint should be used to ensure source code is formatted the same and complies with the same set of rules.")],-1),ee={href:"https://github.com/NIT-Administrative-Systems/AS-serverless-nodejs-api",target:"_blank",rel:"noopener noreferrer"},ne=o(`<li><p>Add the packages as dev dependencies:</p><p><code>yarn add --dev eslint eslint-config-airbnb-base eslint-plugin-import</code></p></li><li><p>Create a <code>.eslintrc.js</code> file in the root of your project:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token string-property property">&quot;extends&quot;</span><span class="token operator">:</span> <span class="token string">&quot;airbnb-base&quot;</span><span class="token punctuation">,</span>
    <span class="token string-property property">&quot;env&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token string-property property">&quot;node&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token string-property property">&quot;es6&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token string-property property">&quot;mocha&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token string-property property">&quot;rules&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token string-property property">&quot;no-console&quot;</span><span class="token operator">:</span> <span class="token string">&quot;off&quot;</span><span class="token punctuation">,</span>
        <span class="token string-property property">&quot;max-len&quot;</span><span class="token operator">:</span> <span class="token string">&quot;off&quot;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,2),te=e("p",null,"Ensure your editor of choice has integration with eslint installed",-1),se={href:"https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint",target:"_blank",rel:"noopener noreferrer"},oe=e("h2",{id:"oracle-on-aws-lambda",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#oracle-on-aws-lambda","aria-hidden":"true"},"#"),n(" Oracle on AWS Lambda")],-1),ae=e("p",null,[n("Oracle provides a node package wrapping their driver. Setting it up is not difficult, but it is more involved than a simple "),e("code",null,"yarn add"),n(".")],-1),re=e("code",null,"lib/",-1),le={href:"https://www.oracle.com/database/technologies/instant-client/downloads.html",target:"_blank",rel:"noopener noreferrer"},ie=e("p",null,[n("The "),e("code",null,"lib/"),n(" folder should have several "),e("code",null,".so"),n(" files in it now.")],-1),pe=o(`<li><p>Add the highlighted <code>directories</code> section below to your <code>package.json</code>:</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;demo-project&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;version&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0.0.1&quot;</span><span class="token punctuation">,</span>
    <span class="token comment">// etc etc</span>
    <span class="token property">&quot;directories&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;lib&quot;</span><span class="token operator">:</span> <span class="token string">&quot;lib&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,1),ce={href:"https://github.com/oracle/node-oracledb",target:"_blank",rel:"noopener noreferrer"},de=e("code",null,"oracledb",-1),ue=e("ul",null,[e("li",null,"Yarn will build the C++ extension against the instant client libs")],-1),he=o("<li><p>Add some env vars to the run scripts in the <code>package.json</code> so the app looks for for the Oracle libs in <code>lib/</code>:</p><p><code>cross-env PATH=\\&quot;$PATH:./lib\\&quot; LD_LIBRARY_PATH=\\&quot;./lib\\&quot; nodemon -L ./bin/www</code></p><p>This example is launching the app with <code>nodemon</code>, but the command after the two env variables depends on how you are running your code.</p></li><li><p>Check the Linux <code>lib/</code> into git</p><p>MacOS &amp; Windows users could run this locally by adding their platform&#39;s Oracle drivers. It is not advisable to add the instantclient for Windows or MacOS to git, as the files are very large.</p><blockquote><p>If you are on Windows or Mac, you will need to download the basic instant client zip file. On Windows, you can unpack it into the lib/ folder. On Mac, you will need to unpack it to ~/lib, outside of the project directory. On both operating systems, it should be automatically detected when you run the app.</p></blockquote></li>",2);function be(_e,me){const t=r("ExternalLinkIcon");return l(),i("div",null,[c,e("p",null,[e("a",d,[n("Express"),s(t)]),n(" is the most popular web framework for Node. It can be "),e("a",u,[n("adapted to run on Lambda"),s(t)]),n(", making this easy to run locally for development or on AWS for production.")]),h,e("p",null,[n("A template with an included IaC module for deploying to AWS is available "),e("a",b,[n("in the Northwestern github organization"),s(t)]),n(". This template is suitable for a microservice project.")]),_,m,g,f,e("table",null,[v,e("tbody",null,[k,y,w,e("tr",null,[e("td",null,[e("a",q,[n("nusso"),s(t)])]),S]),e("tr",null,[e("td",null,[e("a",x,[n("nusso express middleware"),s(t)])]),j]),e("tr",null,[e("td",null,[e("a",A,[n("serverless-http for Express"),s(t)])]),T]),e("tr",null,[e("td",null,[e("a",O,[n("Font Awesome"),s(t)])]),I]),e("tr",null,[e("td",null,[e("a",L,[n("moment.js"),s(t)])]),N]),e("tr",null,[e("td",null,[e("a",W,[n("libphonenumber"),s(t)])]),E]),e("tr",null,[e("td",null,[e("a",P,[n("Axios"),s(t)])]),B]),e("tr",null,[e("td",null,[e("a",D,[n("node-oracledb"),s(t)]),n(),C]),H]),e("tr",null,[e("td",null,[e("a",M,[n("@sentry/node"),s(t)]),n(" †")]),J]),R,e("tr",null,[e("td",null,[e("a",V,[n("body parser"),s(t)])]),z]),G])]),Y,Q,e("ul",null,[e("li",null,[e("a",F,[n("Mocha"),s(t)]),n(", "),e("a",U,[n("Chai"),s(t)]),n(", & "),e("a",$,[n("Istanbul"),s(t)])]),e("li",null,[e("a",K,[n("Jest"),s(t)])])]),X,Z,e("p",null,[n("The "),e("a",ee,[n("template repository"),s(t)]),n(" already has eslint set up. If you need to add this to an existing project:")]),e("ol",null,[ne,e("li",null,[te,e("ul",null,[e("li",null,[e("a",se,[n("VSCode ESLint extension"),s(t)])])])])]),oe,ae,e("ol",null,[e("li",null,[e("p",null,[n("Create a "),re,n(" folder, get "),e("a",le,[n("the Oracle basic instant client for Linux"),s(t)]),n(", and unzip it.")]),ie]),pe,e("li",null,[e("p",null,[n("Add the "),e("a",ce,[de,n(" package"),s(t)]),n(" as a dependency")]),ue]),he])])}const fe=a(p,[["render",be],["__file","express-stack.html.vue"]]);export{fe as default};