# Documentation Site
Want to build a docs site like this one? This site is generated from markdown files by [VuePress](https://vuepress.vuejs.org/), built by [TravisCI](https://travis-ci.com/), and deployed with [GitHub Pages](https://pages.github.com/)


## Overview
<b>Vuepress sites</b> are optimized for technical documentation. Content is written as markdown files. Vuepress compiles the markdown files into html. Behind the scenes Vue takes over and turns the HTML into components and presents it all as a single-page application. If you'd like a more detailed understanding of how it works, see the [VuePress documentation](https://v1.vuepress.vuejs.org/guide/).

<b>TravisCI</b> builds the site: it takes the markdown files in the main GitHub branch, runs the Vuepress build script, and pushes the built files back to a different GitHub branch which will be used for publishing the site. 

The site is hosted from that branch via <b>GitHub pages</b>, which is a free and easy way to host directly from your GitHub repository. 

## Benefits
### Minimal Development
Vuepress makes it easy to build a technical documentation site. Moreover, AS has several existing sites using this pattern which can serve as a reference for most of the intial setup, so very little development is required to start a new site; heavy lifting such as incorporating the official Northwestern colors into the style has already been done and can be reused by new sites. 

### Minimal Upkeep
Once published, the site requires little maintenance beyond keeping dependencies (VuePress) up-to-date, and occasionally updating the Node.js version Travis builds on to ensure it is supported.

### Collaborative
The .md structure is easily adopted by developers, who are already accustomed with writing this style of documentation in their repositories. Edits and additions can be drafted right on GitHub, approved by the codeowners via a pull request, and are automatically built and published by TravisCI once approved, making it maximally easy to have many contributors while maintaining oversight. 

## Implementation Considerations
The GitHub repository must be public (open to anyone outside of the Northwestern Organization) in order to use TravisCI and GitHub Pages for free.

The documentation site is also public (open to anyone outside of Northwestern) - it is feasible to put a VuePress site behind websso but that introduces more complexity to this design (it can no longer make use of this extremely simple building/hosting method with TravisCI and GitHub Pages). If you need to limit access to your documentation, the additional development and maintenance introduced may outweigh the benefits above; it's important to evaluate the best option for your documentation. 

The default domain for a GitHub Pages site in the Northwestern Administrative Systems GitHub organization is https://nit-administrative-systems.github.io/{your-site}/, this is sufficient for some sites (like this one!), or you are responsible for the necessary DNS requests if you would like to configure a custom domain (see the [GitHub documentation](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site)).

## Starting Your Site
We recommend you start by creating a repository for your work and getting a shell of your site running locally with Node.js, Yarn, and VuePress. Once you have this established, proceed to setting up deployment with TravisCI. Finally, once your deployment is setup, focus on the content and building out your .md files! Hosting can easily be enabled on your repository with GitHub Pages when you're ready.

You can use the [this site's source code](https://github.com/NIT-Administrative-Systems/AS-CloudDocs) as a reference for the basic site structure, along with the VuePress documentation when you have questions. 