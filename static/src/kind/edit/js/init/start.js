
const $ = require('jquery');

require('component/ueditor_config');
require('@zzh/ueditor/src/ueditor.config');
require('@zzh/ueditor');

require('component/ueditor_plugins/xiu_mi');
require('component/ueditor_plugins/choose_image');
require('component/ueditor_plugins/choose_image_multi');

let data = require('../data');
let mainTpl = require('../tpl/main');
let coverItemTpl = require('../tpl/main/detail/cover_item');
let payItemTpl = require('../tpl/main/detail/pay_item');
let shareItemTpl = require('../tpl/main/detail/share_item');

let $body = $('body');

module.exports = _ => {
    $body.append(mainTpl(data.info));

    data.editor = window.UE.getEditor('editor');

    // 需要延迟，不然dom还没创建好
    setTimeout(_ => {
        data.info.intro && data.editor.setContent(data.info.intro);
    }, 1000);

    // 有封面
    if (data.info.covers && data.info.covers.length) {
        let $coverContainer = $('#cover-container');
        let $coverAdd = $('#cover-add');
        data.info.covers.forEach(image => {
            $coverContainer.append(coverItemTpl({image}));
        });
        data.info.covers.length >= 3 && $coverAdd.addClass('hide');
    }

    // 有支付选择项
    if (data.info.payItems && data.info.payItems.length) {
        let $payContainer = $('#pay-container');
        data.info.payItems.forEach(item => {
            $payContainer.append(payItemTpl(item));
        });
    }

    // 有分享图标
    if (data.info.shareIcon) {
        let $shareIconContainer = $('#share-icon-container');
        $shareIconContainer.append(shareItemTpl({image: data.info.shareIcon}));
        $('#share-icon-add').addClass('hide');
    }
};