const accounts = require('../accounts');

const serversOptions = [
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[0].host,
      username: accounts[0].user,
      password: accounts[0].pass,
    },
  },
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[1].host,
      username: accounts[1].user,
      password: accounts[1].pass,
    },
  },
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[2].host,
      username: accounts[2].user,
      password: accounts[2].pass,
    },
  },
];

module.exports = {
  envOptions: [
    {
      servers: [
        {
          type: 'web',
          remotePath: '/data1/www/myerp/templates',
          options: serversOptions[0],
        },
        {
          remotePath: '/data1/www/myerp',
          options: serversOptions[0],
        },
      ],
    },
    {
      minJs: !0,
      minCss: !0,
      minHtml: !0,
      servers: [
        {
          type: 'web',
          remotePath: '/data/www/myerp/templates',
          options: serversOptions[1],
        },
        {
          remotePath: '/data/www/myerp',
          options: serversOptions[1],
        },
      ],
    },
    {
      minJs: !0,
      minCss: !0,
      minHtml: !0,
      servers: [
        {
          type: 'web',
          remotePath: '/data/www/myerp/templates',
          options: serversOptions[2],
        },
        {
          remotePath: '/data/www/myerp',
          options: serversOptions[2],
        },
      ],
    },
  ],
  directoriesToSync: {
    // res: 'static/res',
    images: 'static/images',
    resources: 'static/resources',
  },
  basePaths: {
    buildRoot: './static',
    webRoot: './',
  },
  resolveAlias: {
    handlebars: 'handlebars/dist/handlebars.js',
  },
  devServerPort: 10010,
  packCssSeparately: !0,
  treatAllMethodsAsGet: !0,
  provide: {
    $: 'jquery',
    jQuery: 'jquery',
  },
  localOptions: {
    senn: {
      resolveModules: ['../'],
      outResolveAlias: {
        // '@zzh/promotion/dist/promotion.css': 'promotion/dist/promotion.css',
        // '@zzh/promotion': 'promotion/dist/promotion.js'
        '@zzh/ueditor/src/ueditor.config': 'ueditor/src/ueditor.config.js',
        '@zzh/ueditor': 'ueditor/src/ueditor.all.js',
      },
    },
  },
  import: [{ libraryName: 'antd', style: 'css' }],
  commandOptions: {
    dev: {
      define: {
        __SEE_ENV__: JSON.stringify(1),
      },
    },
    sync: {
      define: {
        __SEE_ENV__: JSON.stringify(0),
      },
    },
  },
  moduleOptions: {
    'vrshow/award': {
      cssModules: !0,
      cssModulesExclude: [
        /node_modules/,
        /static\/src\/component/,
        /static\\src\\component/,
        /static\/src\/less/,
        /static\\src\\less/,
      ],
      splitJs: {
        lib: ['jquery', 'react-dom'],
      },
    },
    'kind/edit': {
      splitJs: {
        lib: ['jquery', 'handlebars'],
        ueditor: ['component/ueditor_config', '@zzh/ueditor/src/ueditor.config', '@zzh/ueditor'],
      },
    },
    'component/ueditor_plugins/music': {
      cssModules: !0,
      splitJs: {
        lib: ['jquery', 'react-dom'],
      },
    },
    'component/ueditor_plugins/music/draft': {
      cssModules: !0,
    },
  },
  webpackDev: {
    watchOptions: {
      ignored: /node_modules/,
    },
  },
};
