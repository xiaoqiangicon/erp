require('component/nav');
require('@senntyou/shortcut.css');
require('less/common.less');
require('./index.less');

const $ = require('jquery');

$('#temple-name').text(window.localStorage.templename);

// 获取寺庙信息
$.getJSON('/zzhadmin/getTemple/', {}, res => {
  $.getJSON('/zzhadmin/orderNumGet/', { templeId: res.temple.id }, res => {
    window.localStorage.orderNumber = res.commodityCount;
    $('[data-buddhist-order-count]').text(res.commodityCount);
    window.localStorage.buddhaWall_orderNumber = res.buddhaWallCount;
    $('[data-wall-order-count]').text(res.buddhaWallCount);
  });
});
