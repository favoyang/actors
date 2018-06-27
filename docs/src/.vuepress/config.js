module.exports = {
    dest: './dist',
    base: '/',
    locales: {
        '/': {
            lang: 'en-US',
            title: 'Actors',
            description: 'The component based pattern for Unity3D'
        },
        '/ru/': {
            lang: 'ru-RU',
            title: 'Actors',
            description: 'Компонентно-ориентированный паттерн для Unity3D'
        }
    },
    themeConfig: {
        repo: 'dimmpixeye/Actors-Unity3d-Framework',
        editLinks: true,
        docsDir: 'docs/src/',
        lastUpdated: 'Last Updated',
        locales: {
            '/': {
                selectText: 'Languages',
                label: 'English',
                editLinkText: 'Edit this page on GitHub',
                algolia: {},
                nav: [
                    {
                        text: 'Guide',
                        link: '/guide/'
                    }
                ],
                sidebar: {
                    '/guide/': genSidebarConfig('Guide')
                }
            },
            '/ru/': {
                selectText: 'Язык',
                label: 'Русский',
                editLinkText: 'Редактировать эту страницу на GitHub',
                algolia: {},
                nav: [{
                    text: 'Руководство',
                    link: '/guide/'
                }],
                sidebar: {
                    '/ru/guide/': genSidebarConfig('Руководство')
                }
            },
        }
    },
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ],
    serviceWorker: true
}

function genSidebarConfig(title) {
    return [{
        title,
        collapsable: false,
        children: [
            '',
            'setup',
            'basic-stuff'
        ]
    }]
}