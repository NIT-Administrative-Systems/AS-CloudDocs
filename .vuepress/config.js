module.exports = {
    title: 'AWS for Administrative Systems',
    description: 'Docs for NUIT AS staff on our cloud implementation.',
    dest: '.build/docs',

    themeConfig: {
        repo: 'NIT-Administrative-Systems/AS-CloudDocs',
        docsDir: 'docs',
        docsBranch: 'development',
        editLinks: true,
        editLinkText: 'Edit Page',
        lastUpdated: true,

        sidebar: [
            ['/', 'Introduction'],
            'infrastructure-design',
            'iac',
        ],
    },
}