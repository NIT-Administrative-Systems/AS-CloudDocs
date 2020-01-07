module.exports = {
    title: 'Enterprise Cloud Development & Operations',
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
            {
                title: 'Infrastructure',
                collapsable: false,
                children: [
                    'aws-account-design',
                ].map(file => 'infrastructure/' + file),
            },
            {
                title: 'Infrastructure as Code',
                collapsable: false,
                children: [
                    'terraform',
                ].map(file => 'iac/' + file),
            },
            {
                title: 'CI & CD',
                collapsable: false,
                children: [
                    'jenkins',
                    'jenkins-ecs-agent'
                ].map(file => 'ci-cd/' + file),
            },
        ],
    },
}