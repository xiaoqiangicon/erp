
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

    if (!$payItem.length) {
        dialog('支付类型不能为空');
        return result;
    }

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

    result.data.shareTitle = $('#input-share-title').val().trim() || '';

    result.data.shareDesc = $('#input-share-desc').val().trim() || '';

    result.data.shareIcon = $('[data-share-item-image]').attr('src') || '';

    result.data.showPeopleCountWhenShare = $('#show-people-count-when-share').hasClass('active') ? 1 : 0;

    result.success = !0;
    return result;
};