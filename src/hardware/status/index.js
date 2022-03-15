import 'component/nav';
import 'less/common.less';
import '@senntyou/shortcut.css';
import './index.less';

import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import './ajax';
import {
  Dialog,
  Card,
  Table,
  TableColumn,
  Select,
  Option,
  Input,
  Loading,
} from 'element-ui';

Vue.config.devtools = true;
Vue.use(Dialog);
Vue.use(Dialog);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Loading);

new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
