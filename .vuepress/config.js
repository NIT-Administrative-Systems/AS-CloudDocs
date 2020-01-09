module.exports = {
    title: 'AS Cloud Docs',
    description: 'Docs for Northwestern IT staff on our cloud implementation.',
    dest: '.build/docs',
    base: '/AS-CloudDocs/',

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
                    'vpc-ip-addr',
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
            {
                title: 'GitHub',
                collapsable: false,
                children: [
                    'settings-permissions',
                ].map(file => 'github/' + file),
            },
        ],
    },
}