import 'component/nav';
import 'less/common.less';
import '@senntyou/shortcut.css';
import '../../css/common/index.css';

import 'element-ui/lib/theme-chalk/index.css';

// ueditor
import '../../component/ueditor_config';
import '../../../pro-com/src/ueditor/ueditor.config';
import '../../../pro-com/src/ueditor/ueditor.all';
import '../../component/ueditor_plugins/xiu_mi';

import Vue from 'vue';

import App from './App.vue';
import './ajax';

import 'colors.css/css/colors.css';

Vue.config.devtools = true;

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
