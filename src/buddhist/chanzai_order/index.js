import 'component/nav';
import 'less/common.less';
import '@senntyou/shortcut.css';

import 'element-ui/lib/theme-chalk/index.css';

// video.js
import 'video.js/dist/video-js.min.css';

// choose-image
import '../../../old-com/upload/src/css/index.css'; //
import '../../../old-com/pagination/src/index.less'; // ../../../old-com/pagination/src css
import 'less/pagination.less';
import '@fancyapps/fancybox/dist/jquery.fancybox.css'; // @fancyapps/fancybox css
import '@zzh/choose-image/dist/choose-image.css';
import 'component/choose_image_config';

// ueditor
import '../../component/ueditor_config';
import '@zzh/ueditor/src/ueditor.config';
import '@zzh/ueditor';
import '../../component/ueditor_plugins/xiu_mi';

// upload
import '../../../old-com/upload/src/css/index.css';
import '../../component/upload_config';

import './index.less';

import Vue from 'vue';
import gallery from 'img-vuer';
import {
  CheckboxGroup,
  RadioGroup,
  Radio,
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
  Upload,
} from 'element-ui';
import App from './App.vue';
import './ajax';
import store from './store';

Vue.config.devtools = true;

Vue.use(CheckboxGroup);
Vue.use(RadioGroup);
Vue.use(Radio);
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
Vue.use(gallery);
Vue.use(Upload);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
