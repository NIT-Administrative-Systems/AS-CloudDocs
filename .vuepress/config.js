module.exports = {
    title: 'AS Cloud Docs',
    description: 'Docs for Northwestern IT staff on our cloud implementation.',
    dest: '.build/docs',
    base: '/AS-CloudDocs/',
    head: [
        ['link', { href: 'https://common.northwestern.edu/v8/icons/favicon-16.png', rel: 'icon', sizes: '16x16', type: 'image/png' }],
        ['link', { href: 'https://common.northwestern.edu/v8/icons/favicon-32.png', rel: 'icon', sizes: '32x32', type: 'image/png' }],
    ],

    themeConfig: {
        repo: 'NIT-Administrative-Systems/AS-CloudDocs',
        docsDir: '',
        docsBranch: 'stable',
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
                    'docs-site',
                ],
            },
            {
                title: 'Infrastructure',
                collapsable: false,
                children: [
                    'aws-account-design',
                    'tagging.md',
                    'vpc-ip-addr',
                    'alb',
                    'certificates',
                    'api-gateway',
                    'lambda',
                    'ecs-fargate',
                    'ses',
                    'iam',
                    'databases',
                    'secrets',
                    'alerts',
                    'cloudfront',
                    'vapor',
                    'aws-service-scheduler.md',
                ].map(file => 'infrastructure/' + file),
            },
            {
                title: 'Infrastructure as Code',
                collapsable: false,
                children: [
                    'terraform-concepts',
                    'as-tf-modules',
                    'example-tf',
                    'available-modules',
                    'state-buckets',
                    'tf-import',
                    'tf-move',
                    'tf-upgrading',
                    'faq',
                ].map(file => 'iac/' + file),
            },
            {
                title: 'CI & CD',
                collapsable: false,
                children: [
                    'jenkins',
                    'shared-libs',
                    'jenkins-ecs-agent'
                ].map(file => 'ci-cd/' + file),
            },
            {
                title: 'Application Development',
                collapsable: false,
                children: [
                    'principles',
                    'app-patterns',
                    'laravel-stack',
                    'express-stack',
                    'spring-stack',
                    'frontend-stacks',
                    'libraries',
                ].map(file => 'development/' + file),
            },
            {
                title: 'Security',
                collapsable: false,
                children: [
                    'sso-approaches',
                ].map(file => 'security/' + file),                
            },
            {
                title: 'GitHub',
                collapsable: false,
                children: [
                    'settings-permissions',
                    'repo-layout',
                    'workflow',
                    'policies',
                ].map(file => 'github/' + file),
            },
        ],
    },
}