import '../../component/nav';
import 'colors.css/css/colors.css';
import '@senntyou/shortcut.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'toastr/build/toastr.css';
import './index.less';

import toastr from 'toastr';
import 'xlsx/dist/shim.min.js';

import Vue from 'vue';
import {
  Input,
  Card,
  Alert,
  Switch,
  Checkbox,
  Radio,
  Select,
  Option,
  Button,
  Loading,
  Tabs,
  TabPane,
  MessageBox,
  Message,
  Notification,
  InputNumber,
  Table,
  TableColumn,
  PageHeader,
  Drawer,
  Pagination,
  Badge,
  DatePicker,
  Dialog,
  Form,
  FormItem,
} from 'element-ui';
import App from './App.vue';

Vue.config.devtools = true;

Vue.use(Input);
Vue.use(Card);
Vue.use(Alert);
Vue.use(Switch);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Loading);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(InputNumber);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(PageHeader);
Vue.use(Drawer);
Vue.use(Pagination);
Vue.use(Badge);
Vue.use(DatePicker);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);

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
