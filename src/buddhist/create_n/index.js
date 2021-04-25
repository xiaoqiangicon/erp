import 'component/nav';
import 'colors.css/css/colors.css';
import '@senntyou/shortcut.css';

import 'element-ui/lib/theme-chalk/index.css';

import './index.less';

import 'component/ueditor_config';
import '../../../../pro-com/src/ueditor/ueditor.config';
import '../../../../pro-com/src/ueditor/ueditor.all';

import 'component/ueditor_plugins/xiu_mi';
import 'component/ueditor_plugins/import_wx_article';
import 'component/ueditor_plugins/video';
import 'component/ueditor_plugins/choose_image';
import 'component/ueditor_plugins/choose_image_multi';
import '../../com/ueditor-plugins/self-music';

import Vue from 'vue';
import {
  CheckboxGroup,
  RadioGroup,
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

Vue.config.devtools = true;

Vue.use(CheckboxGroup);
Vue.use(RadioGroup);
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

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});

refreshCeremonyTypes();
