import 'component/nav';
import '@senntyou/shortcut.css';
import '../../../pro-com/src/element-ui/theme-zzh/index.css';
import 'less/common.less';
import Vue from 'vue';
import App from './App.vue';
import api from './api';
import { Message, Pagination } from 'element-ui';

Vue.config.devtools = true;
Vue.use(Pagination);
Vue.prototype.$message = Message;
Vue.prototype.$api = api;

// 获取左侧菜单消息提示数量
api
  .getMenuTipNum({
    templeId: window.localStorage.templeId,
  })
  .then(res => {
    setTimeout(() => {
      document.querySelector('[data-buddhist-order-count]').innerText =
        res.commodityCount;
      document.querySelector('[data-wall-order-count]').innerText =
        res.buddhaWallCount;
      window.localStorage.orderNumber = res.commodityCount;
      window.localStorage.buddhaWall_orderNumber = res.buddhaWallCount;
    }, 300);
  });

new Vue({
  el: '#app',
  render: h => h(App),
});
