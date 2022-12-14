import $ from 'jquery';
import tplContainer from './tpl/container';
import tplHeader from './tpl/header';
import tplItems from './tpl/items';
import fillItemsFields from './util/fill_items_fields';
import initNotice from './util/init_notice';
import initAccess from './util/init_access';
import cookie from 'js-cookie';
const $body = $('body');
export default res => {
  fillItemsFields(res.items);
  // fillItemsFields(res.superItems);
  // fillItemsFields(res.zizaicloudItems);
  $body.prepend(tplContainer);
  $('#component-nav-header').html(tplHeader);
  $('#component-nav-menu').html(
    tplItems({
      items: res.items,
    })
  );
  // $('#super-component-nav-menu').html(
  //   tplItems({
  //     items: res.superItems,
  //   })
  // );
  // $('#zizaicloud-component-nav-menu').html(
  //   tplItems({
  //     items: res.zizaicloudItems,
  //   })
  // );
  initNotice();
  initAccess(res.items);
  // initAccess(res.superItems);
  // initAccess(res.zizaicloudItems);
  // 没有自在云协同的权限，把看板和标题隐藏
  if (!parseInt(cookie.get('pw_office'), 10)) {
    $('#zizaicloud-nav-menu').addClass('hide');
    $('#board-btn').addClass('hide');
  }
  const id = $body.attr('data-menu-id');
  const $menuItem = $(`[data-menu-sub-item-id="${id}"]`);
  $menuItem.addClass('active');
  $menuItem.parents('.component-nav-sub-menu-inner').show();
  $menuItem.find('span.glyphicon').removeClass('green');
  $menuItem
    .parents('.component-nav-menu-item')
    .find('.arrow')
    .toggleClass('active');
  $('[data-temple-name]').text(window.localStorage.templeName);
  $('[data-buddhist-order-count]').text(window.localStorage.orderNumber);
  $('[data-chanzai-order-count]').text(window.localStorage.chanzai_orderNumber);
  $('[data-wall-order-count]').text(window.localStorage.buddhaWall_orderNumber);
  $('[data-vrshow-order-count]').text(window.localStorage.vrshow_orderNumber);
  $('#confirm-temple-name').text(window.localStorage.templeName);
};
