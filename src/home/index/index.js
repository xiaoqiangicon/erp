import 'component/nav';
import '@senntyou/shortcut.css';
import 'less/common.less';
import Vue from 'vue';
import App from './App.vue';
import api from './api';
import { Dialog } from 'element-ui';
import $ from 'jquery';

Vue.config.devtools = true;
Vue.use(Dialog);
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

      if (window.localStorage.templeType === 4) {
        $('[data-menu-item-id="wall"]')
          .parent()
          .hide();
        $('[data-menu-item-id="wall"]')
          .parent()
          .prev()
          .hide();
        $('[data-menu-sub-item-id="order-credits"]').hide();
      }
    }, 300);
  });

new Vue({
  el: '#app',
  render: h => h(App),
});
