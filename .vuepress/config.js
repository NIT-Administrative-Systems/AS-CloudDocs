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

        sidebar: [{
                title: 'Introduction',
                collapsable: false,
                children: [
                    ['/', 'Overview'],
                    'roles-responsibilities',
                    'design-for-cloud',
                    'tools',
                ],
            },
            {
                title: 'Infrastructure',
                collapsable: false,
                children: [
                    'aws-account-design',
                    'vpc-ip-addr',
                    'alb',
                    'certificates',
                    'vapor',
                ].map(file => 'infrastructure/' + file),
            },
            {
                title: 'Infrastructure as Code',
                collapsable: false,
                children: [
                    'terraform-concepts',
                    'tf-upgrading',
                    'as-tf-modules',
                    'example-tf',
                    'available-modules',
                    'state-buckets'
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
                    'policies',
                ].map(file => 'github/' + file),
            },
        ],
    },
}