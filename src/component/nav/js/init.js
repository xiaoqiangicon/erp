const $ = require('jquery');

const tplContainer = require('./tpl/container');
const tplHeader = require('./tpl/header');
const tplItems = require('./tpl/items');

const fillItemsFields = require('./util/fill_items_fields');
const initAccess = require('./util/init_access');

const $body = $('body');

module.exports = res => {
  // 填充字段
  fillItemsFields(res.items);
  fillItemsFields(res.superItems);

  // 初始化UI
  $body.prepend(tplContainer);
  $('#component-nav-header').html(tplHeader);
  $('#component-nav-menu').html(tplItems({ items: res.items }));
  $('#super-component-nav-menu').html(tplItems({ items: res.superItems }));

  // 初始化权限
  initAccess(res.items);
  initAccess(res.superItems);

  // 展开当前菜单
  const id = $body.attr('data-menu-id');
  const $menuItem = $(`[data-menu-sub-item-id="${id}"]`);

  $menuItem.addClass('active');
  $menuItem.parents('.component-nav-sub-menu-inner').show();
  $menuItem.find('span.glyphicon').removeClass('green');
  $menuItem
    .parents('.component-nav-menu-item')
    .find('.arrow')
    .toggleClass('active');

  $('[data-temple-name]').text(window.localStorage.templename);
  $('[data-buddhist-order-count]').text(window.localStorage.orderNumber);
  $('[data-chanzai-order-count]').text(window.localStorage.chanzai_orderNumber);
  $('[data-wall-order-count]').text(window.localStorage.buddhaWall_orderNumber);
  $('[data-vrshow-order-count]').text(window.localStorage.vrshow_orderNumber);
};
