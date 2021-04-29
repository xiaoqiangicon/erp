/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import fse from 'fs-extra';
import { Base64 } from 'js-base64';
import tasksPlugin from 'lila-tasks';
import webpackPlugin from 'lila-webpack';
import { forReactVue as reactVueWebpackConfigPlugin } from 'lila-webpack-config';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import qiniuTask from './qiniu-task';
import qiniuSourceMapTask from './qiniu-source-map-task';

const { readFileSync } = fse;
const cwd = process.cwd();

const rename = {
  'index/login': 'admin/registration/login',
  xiumi: 'pages/com.zzj.buddhistService/xiumi-ue-dialog-v5',
  'buddhist/create_old': 'buddhist/create',
};

const defaultCssModulesExcludeRules = [
  /node_modules/,
  /pro-com/,
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
  const { addCmdOption, setSetting, registerTask } = lila;

  registerTask('qiniu', qiniuTask);
  registerTask('qiniu-source-map', qiniuSourceMapTask);

  const envOption = [
    '-e, --env [env]',
    'server env',
    /^(test|gray|prod)$/,
    'test',
  ];

  addCmdOption('sync', ...envOption);
  addCmdOption('sync', '--menu', '是否上传菜单文件');

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

  setSetting('servePath', (entry, srcDir) => `${srcDir}/${entry}/serve.js`);

  tasksPlugin(lila);
  webpackPlugin(lila);
  reactVueWebpackConfigPlugin(lila);

  return ({ entry, argv, cmd }) => {
    const isDev = cmd === 'dev' || cmd === 'serve';
    const isTest = argv.env === 'test';
    const isGray = argv.env === 'gray';
    const isProd = argv.env === 'prod';

    const servers = [];
    try {
      const accounts = JSON.parse(
        Base64.decode(
          readFileSync(path.join(cwd, '../accounts/info.txt'), 'utf8')
        )
      );
      accounts.forEach(item => {
        servers.push({
          ignoreErrors: true,
          sshConfig: {
            host: item.host,
            username: item.user,
            password: item.pass,
          },
        });
      });
    } catch (e) {
      console.log('\nUse fake account.\n');
      '.'.repeat(10).forEach(() => {
        servers.push({
          host: 'fake-host',
          user: 'fake-user',
          path: 'fake-path',
        });
      });
    }

    const serverEnvMap = {
      test: 0,
      gray: 1,
      prod: 5,
    };

    const tasks = [
      '@lila/del-build',
      '@lila/webpack',
      [
        '@lila/move',
        {
          source: 'build/index.html',
          target: `build/${rename[entry] ? rename[entry] : entry}.html`,
        },
      ],
      [
        '@lila/clean-cache',
        { dir: 'build', cacheFileName: `cache-${argv.env}` },
      ],
      [
        'qiniu',
        {
          dirs: 'build',
          sourceMap: !1,
        },
      ],
      [
        'qiniu-source-map',
        {
          dir: 'build',
        },
      ],
      [
        '@lila/sync-html',
        {
          server: servers[serverEnvMap[argv.env]],
          remotePath:
            argv.env === 'test'
              ? '/data1/www/myerp/templates'
              : '/data/www/myerp/templates',
        },
      ],
      [
        '@lila/sync-html',
        {
          server: servers[serverEnvMap[argv.env]],
          remotePath:
            argv.env === 'test'
              ? '/data1/www/myerp/static/build'
              : '/data/www/myerp/static/build',
        },
      ],
    ];

    if (argv.menu) {
      tasks.push([
        '@lila/sync-dir',
        {
          server: servers[serverEnvMap[argv.env]],
          remotePath:
            argv.env === 'test'
              ? '/data1/www/myerp/static/resources'
              : '/data/www/myerp/static/resources',
          dirs: 'json',
        },
      ]);
    }

    tasks.push(
      [
        '@lila/save-cache',
        { dir: 'build', cacheFileName: `cache-${argv.env}` },
      ],
      '@lila/del-build'
    );

    const config = {
      tasks,
      staticServer: 'https://pic.zizaihome.com',
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

        new ScriptExtHtmlWebpackPlugin({
          custom: {
            test: /\.js$/,
            attribute: 'crossorigin',
            value: 'anonymous',
          },
        }),
      ],
      rebuildWebpackConfig({ webpackConfig }) {
        /* eslint-disable no-param-reassign */
        webpackConfig.resolve.modules = [
          path.join(cwd, 'src'),
          cwd,
          path.join(cwd, 'node_modules'),
        ];
        return webpackConfig;
      },
      mockRoot: 'api',
    };

    if (cmd === 'serve') {
      config.devMiddleware = {
        watchOptions: { ignored: /node_modules/ },
        writeToDisk: !0,
      };
    }

    return config;
  };
};
