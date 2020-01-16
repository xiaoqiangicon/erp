/* 账户密码安全更新（重置密码）页面 */

import 'less/reset.less';
import '../../../pro-com/src/element-ui/theme-zzh/index.css';
import './utils/api';
import Vue from 'vue';
import App from './App.vue';
import {
  Card,
  Alert,
  Button,
  Form,
  FormItem,
  Input,
  Message,
} from 'element-ui';

Vue.config.devtools = true;
Vue.use(Card);
Vue.use(Alert);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

Vue.prototype.$message = Message;

new Vue({
  el: '#app',
  render: h => h(App),
});
