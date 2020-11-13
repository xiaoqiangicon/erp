import 'component/nav';
import 'less/common.less';
import './index.less';
import '@senntyou/shortcut.css';

import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import App from './App.vue';
import './ajax';
import { Card, DatePicker } from 'element-ui';

Vue.config.devtools = true;
Vue.use(Card);
Vue.use(DatePicker);

new Vue({
  el: '#app',
  render: h => h(App),
});
