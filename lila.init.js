/* eslint-disable import/no-extraneous-dependencies */
import tasksPlugin from 'lila-tasks';
import webpackPlugin from 'lila-webpack';
import webpackConfigPlugin from 'lila-webpack-config';
import accounts from '../accounts';

const servers = [
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
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[3].host,
      username: accounts[3].user,
      password: accounts[3].pass,
    },
  },
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[4].host,
      username: accounts[4].user,
      password: accounts[4].pass,
    },
  },
];

const rename = {};

const useCssModules = [
  'buddhist/template',
  'vrshow/award',
  'component/ueditor_plugins/music',
  'component/ueditor_plugins/music/draft',
];

const cssModulesExclude = {
  'buddhist/template': [
    /node_modules/,
    /src\/component/,
    /src\\component/,
    /src\/less/,
    /src\\less/,
  ],
  'vrshow/award': [
    /node_modules/,
    /src\/component/,
    /src\\component/,
    /src\/less/,
    /src\\less/,
  ],
};

const splitJs = {
  'buddhist/template': {
    lib: ['jquery', 'react-dom'],
  },
  'vrshow/award': {
    lib: ['jquery', 'react-dom'],
  },
  'kind/edit': {
    lib: ['jquery', 'handlebars'],
    ueditor: [
      'component/ueditor_config',
      '@zzh/ueditor/src/ueditor.config',
      '@zzh/ueditor',
    ],
  },
  'component/ueditor_plugins/music': {
    lib: ['jquery', 'react-dom'],
  },
};

export default lila => {
  const { addCmdOption, setSetting } = lila;

  const envOption = [
    '-e, --env [env]',
    'server env',
    /^(test|gray|prod)$/,
    'test',
  ];

  addCmdOption('sync', ...envOption);

  setSetting('excludeEntries', [/\/ui$/i, /\/draft$/i]);

  setSetting('beforeTasks', ({ entries, argv, cmd }) => {
    lila.success(
      `\n  ${entries[0]} ${
        entries.length > 2 ? `... ${entries.length} entries are` : 'entry is'
      } about to ${cmd}, with env[${argv.env}]\n`
    );
  });

  setSetting('afterTasks', ({ entries, argv, cmd }) => {
    lila.success(
      `\n  ${entries[0]} ${
        entries.length > 2 ? `... ${entries.length} entries have` : 'entry has'
      } been succeeded to ${cmd}, with env[${argv.env}]\n`
    );
  });

  tasksPlugin(lila);
  webpackPlugin(lila);
  webpackConfigPlugin(lila);

  return ({ entry, argv, cmd }) => {
    const isDev = cmd === 'dev' || cmd === 'serve';
    const isTest = argv.env === 'test';
    const isGray = argv.env === 'gray';
    const isProd = argv.env === 'prod';

    let staticServer = '';

    const tasks = [
      '@lila/webpack',
      [
        '@lila/move',
        {
          source: 'build/index.html',
          target: `build/${rename[entry] || entry}.html`,
        },
      ],
      [
        '@lila/clean-cache',
        { dir: 'build', cacheFileName: `cache-${argv.env}` },
      ],
    ];

    if (cmd === 'sync') {
      if (isTest) {
        staticServer = 'http://test.zizaihome.com/h5/static/erp';
        tasks.push(
          [
            '@lila/sync-build',
            {
              server: servers[0],
              remotePath: '/data/h5/static/erp',
            },
          ],
          [
            '@lila/sync-html',
            {
              server: servers[0],
              remotePath: '/data1/www/myerp/templates',
            },
          ],
          [
            '@lila/sync-dir',
            {
              server: servers[0],
              remotePath: '/data1/www/myerp/static/resources',
              dirs: 'json',
            },
          ]
        );
      } else if (isGray || isProd) {
        staticServer = 'https://wx.zizaihome.com/h5/static/erp';
        tasks.push(
          [
            '@lila/sync-build',
            {
              server: servers[2],
              remotePath: '/data/h5/static/erp',
              sourceMap: !1,
            },
          ],
          [
            '@lila/sync-source-map',
            {
              server: servers[2],
              remotePath: '/data/h5/static/erp-source-map',
            },
          ],
          [
            '@lila/sync-html',
            {
              server: isProd ? servers[2] : servers[1],
              remotePath: '/data/www/myerp/templates',
            },
          ],
          [
            '@lila/sync-dir',
            {
              server: isProd ? servers[2] : servers[1],
              remotePath: '/data/www/myerp/static/resources',
              dirs: 'json',
            },
          ]
        );
      }

      tasks.push(
        [
          '@lila/save-cache',
          { dir: 'build', cacheFileName: `cache-${argv.env}` },
        ],
        '@lila/del-build'
      );
    }

    return {
      tasks,
      staticServer,
      define: {
        __SEE_ENV__: isDev ? 1 : 0,
      },
      provide: {
        jQuery: 'jquery',
        $: 'jquery',
      },
      alias: {
        handlebars: 'handlebars/dist/handlebars.js',
      },
      cssModules: useCssModules.indexOf(entry) > -1,
      cssModulesName: isDev ? '[name]__[local]--[hash:base64]' : undefined,
      cssModulesExclude: cssModulesExclude[entry] || undefined,
      babelImport: [{ libraryName: 'antd', style: 'css' }],
      splitJs: splitJs[entry] || undefined,
    };
  };
};
