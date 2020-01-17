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
import '../../component/ueditor_plugins/choose_image_multi';
import '../../component/ueditor_plugins/video';

import Vue from 'vue';

import App from './App.vue';
import './ajax';
import store from './store';

import { Dialog, Button } from 'element-ui';

import 'colors.css/css/colors.css';

Vue.use(Dialog);
Vue.use(Button);

Vue.config.devtools = true;

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
