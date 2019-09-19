/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import tasksPlugin from 'lila-tasks';
import webpackPlugin from 'lila-webpack';
import { forReactVue as reactVueWebpackConfigPlugin } from 'lila-webpack-config';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import servers from './servers';

const rename = {
  'index/login': 'admin/registration/login',
};

const defaultCssModulesExcludeRules = [
  /node_modules/,
  /pro-com/,
  /old-com/,
  /src\/lib/,
  /src\\lib/,
];

const cssModules = [
  'buddhist/template',
  'vrshow/award',
  'component/ueditor_plugins/music',
  'component/ueditor_plugins/music/draft',
];

const cssModulesExclude = {
  'buddhist/template': [
    ...defaultCssModulesExcludeRules,
    /src\/component/,
    /src\\component/,
    /src\/less/,
    /src\\less/,
  ],
  'vrshow/award': [
    ...defaultCssModulesExcludeRules,
    /src\/component/,
    /src\\component/,
    /src\/less/,
    /src\\less/,
  ],
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
        entries.length > 1 ? `... ${entries.length} entries are` : 'entry is'
      } about to ${cmd}, with env[${argv.env}]\n`
    );
  });

  setSetting('afterTasks', ({ entries, argv, cmd }) => {
    lila.success(
      `\n  ${entries[0]} ${
        entries.length > 1 ? `... ${entries.length} entries have` : 'entry has'
      } been succeeded to ${cmd}, with env[${argv.env}]\n`
    );
  });

  tasksPlugin(lila);
  webpackPlugin(lila);
  reactVueWebpackConfigPlugin(lila);

  return ({ entry, argv, cmd }) => {
    const isDev = cmd === 'dev' || cmd === 'serve';
    const isTest = argv.env === 'test';
    const isGray = argv.env === 'gray';
    const isProd = argv.env === 'prod';

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
        tasks.push(
          [
            '@lila/sync-build',
            {
              server: servers[0],
              remotePath: '/data1/www/myerp/static',
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
        tasks.push(
          [
            '@lila/sync-build',
            {
              server: isProd ? servers[2] : servers[1],
              remotePath: '/data/www/myerp/static',
              sourceMap: !1,
            },
          ],
          [
            '@lila/sync-source-map',
            {
              server: servers[0],
              remotePath: '/data/h5/static/source-map',
            },
          ],
          [
            '@lila/sync-html',
            {
              server: isProd ? servers[5] : servers[1],
              remotePath: '/data/www/myerp/templates',
            },
          ],
          [
            '@lila/sync-dir',
            {
              server: isProd ? servers[5] : servers[1],
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
      staticServer: '/static',
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
      babelExclude: [
        /node_modules/,
        /pro-com\/src\/(ueditor|libs-es5)/,
        /pro-com\\src\\(ueditor|libs-es5)/,
      ],
      cssModules: cssModules.indexOf(entry) > -1,
      cssModulesName: isDev ? '[name]__[local]--[hash:base64]' : undefined,
      cssModulesExclude:
        cssModulesExclude[entry] || defaultCssModulesExcludeRules,
      babelPlugins: [
        ['import', { libraryName: 'antd', style: 'css' }],
        [
          'component',
          { libraryName: 'element-ui', styleLibraryName: 'theme-chalk' },
        ],
      ],
      plugins: [
        new MomentLocalesPlugin({
          localesToKeep: ['es-us', 'zh-cn'],
        }),
      ],
      rebuildWebpackConfig({ webpackConfig }) {
        /* eslint-disable no-param-reassign */
        const cwd = process.cwd();
        webpackConfig.resolve.modules = [
          path.join(cwd, 'src'),
          path.join(cwd, 'node_modules'),
        ];
        return webpackConfig;
      },
    };
  };
};
