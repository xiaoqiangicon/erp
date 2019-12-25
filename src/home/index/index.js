import 'component/nav';
import '@senntyou/shortcut.css';
import 'less/common.less';
import $ from 'jquery';
import Vue from 'vue';
import App from './App.vue';
import api from './api';
import { Dialog } from 'element-ui';

Vue.config.devtools = true;
Vue.use(Dialog);
Vue.prototype.$api = api;

$('#temple-name').text(window.localStorage.templeName);
$.getJSON('/zzhadmin/getTemple/', {}, res => {
  $.getJSON(
    '/zzhadmin/orderNumGet/',
    {
      templeId: res.temple.id,
    },
    res => {
      window.localStorage.orderNumber = res.commodityCount;
      $('[data-buddhist-order-count]').text(res.commodityCount);
      window.localStorage.buddhaWall_orderNumber = res.buddhaWallCount;
      $('[data-wall-order-count]').text(res.buddhaWallCount);
    }
  );
});

new Vue({
  el: '#app',
  render: h => h(App),
});
