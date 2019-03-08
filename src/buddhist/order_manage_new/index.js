import 'component/nav';

import 'less/common.less';

import 'element-ui/lib/theme-chalk/index.css';
import '@senntyou/shortcut.css';
import '@zzh/upload/dist/upload.css';

import '../../component/upload_config';

import Vue from 'vue';
import {
  Badge,
  Row,
  Col,
  Form,
  FormItem,
  Checkbox,
  DatePicker,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Pagination,
  Loading,
  Dialog,
  Input,
  Tabs,
  TabPane,
} from 'element-ui';
import App from './App';
import './fetch';

Vue.config.devtools = true;

Vue.use(Badge);
Vue.use(Row);
Vue.use(Col);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Checkbox);
Vue.use(DatePicker);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Loading);
Vue.use(Dialog);
Vue.use(Input);
Vue.use(Tabs);
Vue.use(TabPane);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
