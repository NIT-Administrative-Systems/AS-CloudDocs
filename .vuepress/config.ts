import { defaultTheme, defineUserConfig } from 'vuepress';

import { searchProPlugin } from 'vuepress-plugin-search-pro';
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance';

export default defineUserConfig({
    title: 'AS Cloud Docs',
    description: 'Docs for Northwestern IT staff on our cloud implementation.',
    head: [
        ['link', { href: 'https://common.northwestern.edu/v8/icons/favicon-16.png', rel: 'icon', sizes: '16x16', type: 'image/png' }],
        ['link', { href: 'https://common.northwestern.edu/v8/icons/favicon-32.png', rel: 'icon', sizes: '32x32', type: 'image/png' }],
    ],
    pagePatterns: ['**/*.md', '!**/README.md', '!.vuepress', '!node_modules'],
    base: '/AS-CloudDocs/',

    theme: defaultTheme({
        repo: 'NIT-Administrative-Systems/AS-CloudDocs',
        docsBranch: 'stable',
        editLink: true,
        editLinkText: 'Edit Page',
        lastUpdated: true,
        sidebar: [
            {
                text: 'Introduction',
                collapsable: false,
                children: [
                    '/',
                    '/roles-responsibilities',
                    '/design-for-cloud',
                    '/tools',
                    '/docs-site',
                ],
            },
            {
                text: 'Infrastructure',
                collapsable: false,
                children: [
                    'aws-account-design',
                    'tagging.md',
                    'vpc-ip-addr',
                    'alb',
                    'certificates',
                    'api-gateway',
                    'lambda',
                    'file-handling-on-lambda',
                    'ecs-fargate',
                    'ses',
                    'iam',
                    'databases',
                    'secrets',
                    'alerts',
                    'cloudfront',
                    'vapor',
                    'aws-service-scheduler.md',
                ].map(file => '/infrastructure/' + file),
            },
            {
                text: 'Infrastructure as Code',
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
                ].map(file => '/iac/' + file),
            },
            {
                text: 'CI & CD',
                collapsable: false,
                children: [
                    'jenkins',
                    'shared-libs',
                    'jenkins-ecs-agent',
                    'gha'
                ].map(file => '/ci-cd/' + file),
            },
            {
                text: 'Application Development',
                collapsable: false,
                children: [
                    'principles',
                    'app-patterns',
                    'laravel-stack',
                    'express-stack',
                    'spring-stack',
                    'frontend-stacks',
                    'libraries',
                ].map(file => '/development/' + file),
            },
            {
                text: 'Security',
                collapsable: false,
                children: [
                    'sso-approaches',
                ].map(file => '/security/' + file),
            },
            {
                text: 'GitHub',
                collapsable: false,
                children: [
                    'settings-permissions',
                    'repo-layout',
                    'workflow',
                    'policies',
                ].map(file => '/github/' + file),
            },
        ],
    }),
    plugins: [
        searchProPlugin({
            indexContent: true,
            delay: 500,
        }),
        mdEnhancePlugin({
            container: true,
            tabs: true,
            footnote: true,
            mark: true,
            mermaid: {
                themeVariables: {
                    darkMode: true,
                    primaryColor: '#4e2a84',
                    primaryTextColor: '#adbac7',
                },
            },
            include: true,
            linkCheck: 'dev',
        })
    ],
});