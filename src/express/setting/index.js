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
  Switch,
  Checkbox,
  Radio,
  Select,
  Option,
  Button,
  Loading,
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

toastr.options.positionClass = 'toast-bottom-full-width';

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
