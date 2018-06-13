
'use strict';

var accounts = require('../accounts');

module.exports = {
    network: [
        {
            useSsh: !0,
            servers: [
                // web
                {
                    host: accounts[0].host,
                    user: accounts[0].user,
                    pass: accounts[0].pass,
                    remotePath: '/data1/www/myerp/templates',
                    serverType: 'web'
                },
                // static
                {
                    host: accounts[0].host,
                    user: accounts[0].user,
                    pass: accounts[0].pass,
                    remotePath: '/data1/www/myerp'
                }
            ]
        },
        {
            useSsh: !0,
            servers: [
                // web
                {
                    host: accounts[1].host,
                    user: accounts[1].user,
                    pass: accounts[1].pass,
                    remotePath: '/data/www/myerp/templates',
                    serverType: 'web'
                },
                // static
                {
                    host: accounts[1].host,
                    user: accounts[1].user,
                    pass: accounts[1].pass,
                    remotePath: '/data/www/myerp'
                }
            ]
        },
        {
            useSsh: !0,
            servers: [
                // web
                {
                    host: accounts[2].host,
                    user: accounts[2].user,
                    pass: accounts[2].pass,
                    remotePath: '/data/www/myerp/templates',
                    serverType: 'web'
                },
                // static
                {
                    host: accounts[2].host,
                    user: accounts[2].user,
                    pass: accounts[2].pass,
                    remotePath: '/data/www/myerp'
                }
            ]
        }
    ],
    envOptions: [
        {},
        {
            minJs: !0,
            minCss: !0,
            minHtml: !0
        },
        {
            minJs: !0,
            minCss: !0,
            minHtml: !0
        }
    ],
    directoriesToSync: {
        // res: 'static/res',
        images: 'static/images'
    },
    basePaths: {
        buildRoot: './static',
        webRoot: './'
    },
    resolveAlias: {
        handlebars: 'handlebars/dist/handlebars.js'
    },
    devServerPort: 10010,
    packCssSeparately: !0,
    treatAllMethodsAsGet: !0,
    provide: {
        $: 'jquery',
        jQuery: 'jquery'
    },
    localOptions: {
        senn: {
            resolveModules: [
                '../'
            ],
            outResolveAlias: {
                // '@zzh/promotion/dist/promotion.css': 'promotion/dist/promotion.css',
                // '@zzh/promotion': 'promotion/dist/promotion.js'
                '@zzh/ueditor/src/ueditor.config': 'ueditor/src/ueditor.config.js',
                '@zzh/ueditor': 'ueditor/src/ueditor.all.js'
            }
        }
    },
    import: [
        { libraryName: 'antd', style: 'css' }
    ],
    commandOptions: {
        dev: {
            define: {
                __SEE_ENV__: JSON.stringify(1)
            }
        },
        sync: {
            define: {
                __SEE_ENV__: JSON.stringify(0)
            }
        }
    }
};

