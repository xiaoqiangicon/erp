
const $ = require('jquery');

require('component/upload_config');

require('@zzh/upload/dist/upload.css');
const upload = require('@zzh/upload');

let payUpload = require('./pay_upload');
let coverItemTpl = require('../tpl/main/detail/cover_item');
let shareItemTpl = require('../tpl/main/detail/share_item');

module.exports = _ => {
    upload('#cover-add', image => {
        let $coverContainer = $('#cover-container');
        let $coverAdd = $('#cover-add');
        $coverContainer.append(coverItemTpl({image}));
        $('[data-cover-item]').length >= 3 && $coverAdd.addClass('hide');
    });

    upload('#share-icon-add', image => {
        let $shareIconContainer = $('#share-icon-container');
        let $shareIconAdd = $('#share-icon-add');
        $shareIconContainer.append(shareItemTpl({image}));
        $shareIconAdd.addClass('hide');
    });

    $('[data-pay-item-add]').map(function () {
        let $this = $(this);
        payUpload($this);
    });
};