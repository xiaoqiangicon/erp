
const $ = require('jquery');

let dialog = require('util/dialog');
let data = require('../data');

module.exports = _ => {
    let result = {
        success: true,
        data: {}
    };

    let name = $('#input-name').val().trim();
    if (!name) {
        dialog('善行标题不能为空');
        return result;
    }
    result.data.name = name;

    let $covers = $('[data-cover-item-image]');
    if (!$covers.length) {
        dialog('封面图片不能为空');
        return result;
    }
    let covers = [];
    $covers.forEach(function () {
       covers.push($(this).attr('src'));
    });
    result.data.covers = covers;

    let intro = data.editor.getContent();
    if (!$covers.length) {
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

    $payItem.for(function (index) {
        payItems.push({
            id: parseInt($($payItem[index]).attr('data-pay-item')) || 0,
            name: $($payName[index]).attr('data-pay-item-name') || '',
            price: parseFloat($($payPrice[index]).attr('data-pay-item-price')) || 0,
            desc: $($payDesc[index]).attr('data-pay-item-desc') || '',
            image: $($payImage[index]).attr('data-pay-item-image') || ''
        });
    });

    result.data.payItems = payItems;
};