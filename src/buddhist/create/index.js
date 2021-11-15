import 'component/nav';
import 'colors.css/css/colors.css';
import '@senntyou/shortcut.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'toastr/build/toastr.css';
import './index.less';

import toastr from 'toastr';
import 'component/ueditor_config';
import '../../../../pro-com/src/ueditor/ueditor.config';
import '../../../../pro-com/src/ueditor/ueditor.all';

import 'component/ueditor_plugins/xiu_mi';
import 'component/ueditor_plugins/import_wx_article';
import 'component/ueditor_plugins/video';
import 'component/ueditor_plugins/choose_image';
import 'component/ueditor_plugins/choose_image_multi';
import '../../com/ueditor-plugins/embed-music';
import '../../com/ueditor-plugins/embed-link';
import '../../com/ueditor-plugins/135editor';

import Vue from 'vue';
import {
  Checkbox,
  CheckboxGroup,
  Radio,
  Form,
  FormItem,
  Input,
  Switch,
  Select,
  Option,
  Button,
  Dialog,
  DatePicker,
  Tooltip,
} from 'element-ui';
import App from './App.vue';
import store from './store';
import { refreshCeremonyTypes } from './func';
import { shareData, urlData } from './data';
import request from '../../utils/request';
import { removeIdDeep } from './utils';

Vue.config.devtools = true;

Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(DatePicker);
Vue.use(Tooltip);

toastr.options.positionClass = 'toast-bottom-full-width';

function init() {
  // eslint-disable-next-line no-new
  new Vue({
    el: '#app',
    store,
    render: h => h(App),
  });
}

// 复制佛事
if (urlData.createByCopy) {
  shareData.createdData = window.createdData;
  removeIdDeep(shareData.createdData);
  init();
}
// 编辑佛事
else if (urlData.updateFoShi) {
  shareData.createdData = window.createdData;
  init();
}
// 使用系统模板创建
else if (urlData.createBySysTpl) {
  request({
    url: '/zzhadmin/ceremony_template/',
    params: { templateId: urlData.templateId },
  }).then(res => {
    shareData.createdData = res.data;
    removeIdDeep(shareData.createdData);
    init();
  });
}
// 使用自定义模板创建
else if (urlData.createByCusTpl || urlData.updateCusTpl) {
  request({
    url: '/zzhadmin/getCeremonyTemplate/',
    params: { templateId: urlData.templateId },
  }).then(res => {
    shareData.createdData = res.data;
    // 非编辑模板
    if (urlData.createByCusTpl) removeIdDeep(shareData.createdData);
    init();
  });
} else {
  init();
}
refreshCeremonyTypes();

request('/zzhadmin/volunteer_getSmsCount/').then(res => {
  store.state.remainMsgCount = (res.data && res.data.msgCnt) || 0;
});
