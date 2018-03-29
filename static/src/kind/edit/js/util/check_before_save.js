
const $ = require('jquery');

let dialog = require('util/dialog');
let data = require('../data');

module.exports = _ => {
    let result = {
        success: !1,
        data: {}
    };

    let title = $('#input-title').val().trim();
    if (!title) {
        dialog('善行标题不能为空');
        return result;
    }
    result.data.title = title;

    let $covers = $('[data-cover-item-image]');
    if (!$covers.length) {
        dialog('封面图片不能为空');
        return result;
    }
    let covers = [];
    $covers.map(function () {
       covers.push($(this).attr('src'));
    });
    result.data.covers = covers;

    let intro = data.editor.getContent();
    if (!intro.length) {
        dialog('详情内容不能为空');
        return result;
    }
    result.data.intro = intro;

    let payItems = [];
    let $payItem = $('[data-pay-item]');
    let $payName = $('[data-pay-item-name]');
    let $payPrice = $('[data-pay-item-price]');
    let $payDesc = $('[data-pay-item-desc]');
    let $payImage = $('[data-pay-item-image]');

    let payItemHasError = !1;
    let payItemErrorMsg = '';
    $payItem.map(function (index) {
        let name = $($payName[index]).val() || '';
        let price = parseFloat($($payPrice[index]).val()) || 0;
        let desc = $($payDesc[index]).val() || '';
        let icon = $($payImage[index]).attr('src') || '';

        if (!name) {
            payItemHasError = !0;
            payItemErrorMsg = `第${index + 1}个支付选择项名称不能为空`;
            return !1;
        }
        if (!icon) {
            payItemHasError = !0;
            payItemErrorMsg = `第${index + 1}个支付选择项图片不能为空`;
            return !1;
        }
        payItems.push({
            id: parseInt($($payItem[index]).attr('data-pay-item')) || 0,
            name,
            price,
            desc,
            icon
        });
    });

    if (payItemHasError) {
        dialog(payItemErrorMsg);
        return result;
    }

    result.data.payItems = payItems;

    let shareTitle = $('#input-share-title').val().trim();
    if (!shareTitle) {
        dialog('分享标题不能为空');
        return result;
    }
    result.data.shareTitle = shareTitle;

    let shareDesc = $('#input-share-desc').val().trim();
    if (!shareDesc) {
        dialog('分享描述不能为空');
        return result;
    }
    result.data.shareDesc = shareDesc;

    let $shareIcon = $('[data-share-item-image]');
    if (!$shareIcon.length) {
        dialog('分享图标不能为空');
        return result;
    }
    result.data.shareIcon = $shareIcon.attr('src');

    result.data.showPeopleCountWhenShare = $('#show-people-count-when-share').hasClass('active') ? 1 : 0;

    result.success = !0;
    return result;
};