import 'component/nav';
import 'less/common.less';
import '@senntyou/shortcut.css';

import 'element-ui/lib/theme-chalk/index.css';

import Vue from 'vue';

import { Pagination } from 'element-ui';

import App from './App.vue';
import './ajax';

Vue.use(Pagination);

Vue.config.devtools = true;

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
