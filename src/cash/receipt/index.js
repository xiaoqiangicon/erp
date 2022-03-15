import 'component/nav';
import 'less/common.less';
import '@senntyou/shortcut.css';
import './index.less';

import 'element-ui/lib/theme-chalk/index.css';
import {
  Button,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Tooltip,
} from 'element-ui';

import Vue from 'vue';

import App from './App.vue';
import './ajax';
import store from './store';

Vue.config.devtools = true;

Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tooltip);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
