import 'component/nav';
import 'less/common.less';
import '@senntyou/shortcut.css';

import 'element-ui/lib/theme-chalk/index.css';
import { Button, Table, TableColumn, Pagination } from 'element-ui';

import Vue from 'vue';

import App from './App.vue';
import './ajax';

Vue.config.devtools = true;

Vue.use(Button);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
