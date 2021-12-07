import '../../component/nav';
import 'colors.css/css/colors.css';
import '@senntyou/shortcut.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'toastr/build/toastr.css';
import './index.less';

import toastr from 'toastr';

import Vue from 'vue';
import {
  Input,
  Card,
  Alert,
  Button,
  Loading,
  Pagination,
  Table,
  TableColumn,
  Form,
  FormItem,
  Dialog,
  Message,
  MessageBox,
  Notification,
} from 'element-ui';
import App from './App.vue';

Vue.config.devtools = true;

Vue.use(Input);
Vue.use(Card);
Vue.use(Alert);
Vue.use(Button);
Vue.use(Loading);
Vue.use(Pagination);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Dialog);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

toastr.options.positionClass = 'toast-bottom-full-width';

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
