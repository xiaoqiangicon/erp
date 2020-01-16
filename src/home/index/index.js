import 'component/nav';
import '@senntyou/shortcut.css';
import 'less/common.less';
import './index.less';
import $ from 'jquery';
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
