import{_ as a,M as l,p as i,q as d,R as e,t,N as s,V as o}from"./framework-bf3e1922.js";const c={},h=e("h1",{id:"shared-library",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#shared-library","aria-hidden":"true"},"#"),t(" Shared Library")],-1),u={href:"https://github.com/NIT-Administrative-Systems/AS-jenkins-shared",target:"_blank",rel:"noopener noreferrer"},_=e("h2",{id:"usage",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#usage","aria-hidden":"true"},"#"),t(" Usage")],-1),p=e("p",null,"This repository is intended to be used by declarative pipelines.",-1),m=e("p",null,"You will need to declare that you are using the library at the top of your pipeline. Jenkins will load the entire lib and make all of its functions available. For example:",-1),b=e("p",null,"<<< @/assets/sample-secret-pipeline.groovy",-1),f=e("h2",{id:"functions",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#functions","aria-hidden":"true"},"#"),t(" Functions")],-1),g=e("p",null,"These are the major pieces of shared functionality.",-1),S=e("thead",null,[e("tr",null,[e("th",null,"Function"),e("th",null,"Purpose"),e("th",null,"Requirements")])],-1),y={href:"https://github.com/NIT-Administrative-Systems/AS-jenkins-shared/blob/stable/vars/publishSecretsToSSM.groovy",target:"_blank",rel:"noopener noreferrer"},v=e("code",null,"publishSecretsToSSM",-1),k=e("td",null,[t("Terraform module has "),e("code",null,"parameters"),t(" output")],-1),T={href:"https://github.com/NIT-Administrative-Systems/AS-jenkins-shared/blob/stable/vars/parseJson.groovy",target:"_blank",rel:"noopener noreferrer"},A=e("code",null,"parseJson",-1),x=e("td",null,"Parse JSON & return it in a serializable format",-1),N=e("td",null,"None",-1),I={href:"https://github.com/NIT-Administrative-Systems/AS-jenkins-shared/blob/stable/vars/publishSecretsToVapor.groovy",target:"_blank",rel:"noopener noreferrer"},V=e("code",null,"publishSecretsToVapor",-1),j=e("td",null,[e("code",null,".env.{deploy-env}"),t(" file has "),e("code",null,"VAPOR_SECRETS="),t(" list")],-1),L={href:"https://github.com/NIT-Administrative-Systems/AS-jenkins-shared/blob/stable/vars/publishSecretsToSecretsManager.groovy",target:"_blank",rel:"noopener noreferrer"},R=e("code",null,"publishSecretsToSecretsManager",-1),E=e("td",null,[t("Terraform module has "),e("code",null,"secrets"),t(" output")],-1);function M(J,w){const n=l("ExternalLinkIcon"),r=l("RouterLink");return i(),d("div",null,[h,e("p",null,[t("The "),e("a",u,[t("AS-jenkins-shared"),s(n)]),t(" repository contains common code that can be used in any pipeline.")]),_,p,m,b,f,g,e("table",null,[S,e("tbody",null,[e("tr",null,[e("td",null,[e("a",y,[v,s(n)])]),e("td",null,[t("Implements "),s(r,{to:"/infrastructure/secrets.html"},{default:o(()=>[t("secret management strategy")]),_:1})]),k]),e("tr",null,[e("td",null,[e("a",T,[A,s(n)])]),x,N]),e("tr",null,[e("td",null,[e("a",I,[V,s(n)])]),e("td",null,[t("Implements "),s(r,{to:"/infrastructure/secrets.html"},{default:o(()=>[t("secret management strategy")]),_:1}),t(" for Laravel Vapor")]),j]),e("tr",null,[e("td",null,[e("a",L,[R,s(n)])]),e("td",null,[t("Implements "),s(r,{to:"/infrastructure/secrets.html"},{default:o(()=>[t("secret management strategy")]),_:1})]),E])])])])}const C=a(c,[["render",M],["__file","shared-libs.html.vue"]]);export{C as default};