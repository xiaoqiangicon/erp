import 'component/nav';
import 'less/common.less';
import '@senntyou/shortcut.css';

import 'element-ui/lib/theme-chalk/index.css';

import './index.less';

import Vue from 'vue';
import {
  Card,
  DatePicker,
  Select,
  Option,
  Button,
  Input,
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
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(Loading);

Vue.prototype.$confirm = MessageBox.confirm;

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
