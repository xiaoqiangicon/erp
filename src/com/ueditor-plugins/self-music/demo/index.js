import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@senntyou/shortcut.css';
import 'colors.css/css/colors.css';
import 'element-ui/lib/theme-chalk/index.css';
import '../../../../styles/base.less';
import '../index.less';

import Vue from 'vue';
import { Input, Button } from 'element-ui';
import App from './App';

Vue.component(Input.name, Input);
Vue.component(Button.name, Button);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
