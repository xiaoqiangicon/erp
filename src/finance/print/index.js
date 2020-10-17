import 'less/common.less';
import '@senntyou/shortcut.css';
import './index.less';

import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import App from './App.vue';
import './ajax';

Vue.config.devtools = true;

new Vue({
  el: '#app',
  render: h => h(App),
});
