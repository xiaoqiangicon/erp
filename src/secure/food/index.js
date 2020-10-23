import 'component/nav';
import 'less/common.less';
import '@senntyou/shortcut.css';
import './index.less';

import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import App from './App.vue';
import gallery from 'img-vuer';
import './ajax';
import {
  Dialog,
  Card,
  Table,
  TableColumn,
  Select,
  Option,
  Input,
  Pagination,
  DatePicker,
  TimePicker,
  TimeSelect,
  CheckboxGroup,
  Checkbox,
} from 'element-ui';

Vue.config.devtools = true;
Vue.use(Dialog);
Vue.use(Dialog);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Pagination);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(TimeSelect);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(gallery);

new Vue({
  el: '#app',
  render: h => h(App),
});
