# Documentation Site
Want to build a docs site like this one? This site is generated from markdown files by [VuePress](https://vuepress.vuejs.org/), built by [GitHub Actions](https://docs.github.com/en/actions), and deployed with [GitHub Pages](https://pages.github.com/). 

There is no cost associated with any of this.

## Overview
**VuePress sites** are optimized for technical documentation. Content is written as markdown files. VuePress compiles the markdown files into html. Behind the scenes Vue takes over and turns the HTML into components and presents it all as a single-page application. If you'd like a more detailed understanding of how it works, see the [VuePress documentation](https://v1.vuepress.vuejs.org/guide/).

**GitHub Actions** builds the site: it takes the markdown files in the default GitHub branch, runs the VuePress build script, and pushes the built files back to a different GitHub branch which will be used for publishing the site. 

The site is hosted from that branch via **GitHub Pages**, which is a free and easy way to host directly from your GitHub repository. 

## Benefits
### Minimal Development
VuePress makes it easy to build a technical documentation site. Moreover, AS has several existing sites using this pattern which can serve as a reference for most of the initial setup, so very little development is required to start a new site; heavy lifting such as incorporating the official Northwestern colors into the style has already been done and can be reused by new sites. 

### Minimal Upkeep
Once published, the site requires little maintenance beyond keeping dependencies (VuePress) up-to-date, and occasionally updating the Node.js version GitHub Actions builds on to ensure it is supported.

### Collaborative
The .md structure is easily adopted by developers, who are already accustomed with writing this style of documentation in their repositories. Edits and additions can be drafted right on GitHub, approved by the code-owners via a pull request, and are automatically built and published by GitHub Actions once approved, making it maximally easy to have many contributors while maintaining oversight. 

## Implementation Considerations
GitHub Pages allows you to offer either a public or private site. Private GitHub Pages sites will use your repository's access settings to determine who can view them. 

The default domain for a *public* GitHub Pages site in the Northwestern Administrative Systems GitHub organization is https://nit-administrative-systems.github.io/{your-site}/, this is sufficient for some sites (like this one!). For *private* sites, you will receive an auto-generated hostname that does not reflect your repository name or the NIT-Administrative-Systems org.

Both public & private sites can be given a custom `northwestern.edu` hostname. You are responsible for the necessary DNS requests if you would like to configure a custom domain -- see the [GitHub documentation](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site). Note that hostnames under the `entapp.northwestern.edu` subdomain can be set up by the EACD-CloudOps team. Other requests must be sent to hostmaster.

## Starting Your Site
We recommend you start by creating a repository for your work and getting a shell of your site running locally with Node.js, Yarn, and VuePress. The files in the `.github/workflow` folder control the GitHub Action for testing and deploying your site. 

After your GitHub action runs initially and creates a `gh-pages` branch with your static HTML content, GitHub Pages must be enabled on your repository. Submit a request to the EACD-CloudOps team to do this, and let them know if you want it to be a public or private site.

::: warning EACD-CloudOps Note on Private GitHub Pages
The UI to enable private pages doesn't seem to work properly at the time of writing.

To publish a new private site, change the visibility and confirm what you're doing in the popup. It will redirect you to a 404 page. This is fine.

Go back to the Pages settings and choose the `gh-pages` branch, then publish it. GitHub has recorded the attempt to swap the (as-then) unpublished site to private, and the new site will be correctly deployed as private.
:::

You can use the [this site's source code](https://github.com/NIT-Administrative-Systems/AS-CloudDocs) as a reference for the basic site structure, along with the VuePress documentation when you have questions.
