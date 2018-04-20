
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
                '@zzh/choose-image/dist/choose-image.css': 'choose-image/dist/choose-image.css',
                '@zzh/choose-image': 'choose-image/dist/choose-image.js'
            }
        }
    }
};

