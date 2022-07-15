import 'component/nav';
import 'less/common.less';
import '@senntyou/shortcut.css';

import 'element-ui/lib/theme-chalk/index.css';

// video.js
import 'video.js/dist/video-js.min.css';

// choose-image
import '../../com-deprecated/upload/css/index.css'; //
import '../../com-deprecated/pagination/index.less'; // ../../com-deprecated/pagination css
import 'less/pagination.less';
import '@fancyapps/fancybox/dist/jquery.fancybox.css'; // @fancyapps/fancybox css
import '../../com-deprecated/choose-image/css/index.css';

// ueditor
import '../../component/ueditor_config';
import '../../../../pro-com/src/ueditor/ueditor.config';
import '../../../../pro-com/src/ueditor/ueditor.all';
import '../../component/ueditor_plugins/xiu_mi';

// upload
import '../../com-deprecated/upload/css/index.css';
import '../../component/upload_config';

import './index.less';

import Vue from 'vue';
import {
  Card,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Pagination,
  Loading,
  MessageBox,
} from 'element-ui';
import App from './App.vue';
import './ajax';

Vue.config.devtools = true;

Vue.use(Card);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Loading);

Vue.prototype.$confirm = MessageBox.confirm;

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
