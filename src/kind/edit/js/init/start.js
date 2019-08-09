const $ = require('jquery');

require('component/ueditor_config');
require('../../../../../pro-com/src/ueditor/ueditor.config');
require('../../../../../pro-com/src/ueditor/ueditor.all');

require('component/ueditor_plugins/xiu_mi');
require('component/ueditor_plugins/import_wx_article');
require('component/ueditor_plugins/video');
require('component/ueditor_plugins/choose_image');
require('component/ueditor_plugins/choose_image_multi');

const data = require('../data');
const mainTpl = require('../tpl/main');
const coverItemTpl = require('../tpl/main/detail/cover_item');
const payItemTpl = require('../tpl/main/detail/pay_item');
const shareItemTpl = require('../tpl/main/detail/share_item');

const $body = $('body');

module.exports = _ => {
  $body.append(mainTpl(data.info));

  data.editor = window.UE.getEditor('editor', {
    initialFrameWidth: 700,
    initialFrameHeight: 400,
  });

  data.editor.ready(() => {
    data.info.intro && data.editor.setContent(data.info.intro);
  });

  // 有封面
  if (data.info.covers && data.info.covers.length) {
    const $coverContainer = $('#cover-container');
    const $coverAdd = $('#cover-add');
    data.info.covers.forEach(image => {
      $coverContainer.append(coverItemTpl({ image }));
    });
    data.info.covers.length >= 3 && $coverAdd.addClass('hide');
  }

  // 有支付选择项
  if (data.info.payItems && data.info.payItems.length) {
    const $payContainer = $('#pay-container');
    data.info.payItems.forEach(item => {
      $payContainer.append(payItemTpl(item));
    });
  }

  // 有分享图标
  if (data.info.shareIcon) {
    const $shareIconContainer = $('#share-icon-container');
    $shareIconContainer.append(shareItemTpl({ image: data.info.shareIcon }));
    $('#share-icon-add').addClass('hide');
  }
};
