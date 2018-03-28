
const handlebars = require('handlebars');

let tpl = `
<div class="row-0-1" data-pay-item="{{id}}">
    <div class="item-0-1 item-0-1-1">
        <input class="form-control" value="{{name}}" maxlength="10" data-pay-item-name="{{id}}">
    </div>
    <div class="item-0-1 item-0-1-2">
        <input class="form-control" placeholder="为0或不填为无需支付" value="{{price}}" type="number" data-pay-item-price="{{id}}">
    </div>
    <div class="item-0-1 item-0-1-3">
        <input class="form-control" placeholder="填写说明可介绍此善行特点，吸引用户选择" value="{{desc}}" maxlength="20" data-pay-item-desc="{{id}}">
    </div>
    <div class="item-0-1 item-0-1-4" data-pay-item-icon-container="{{id}}">
        <div class="container-0-3 {{#unless icon}}hide{{/unless}}" data-pay-item-icon="{{id}}">
            <img src="{{icon}}" data-pay-item-image="{{id}}">
            <button class="clean common-delete" data-pay-item-icon-delete="{{id}}">X</button>
        </div>
        <button class="clean btn-0-2 ps-relative {{#if icon}}hide{{/if}}" data-pay-item-add="{{id}}"></button>
    </div>
    <div class="item-0-1 item-0-1-5">
        <button class="clean text-0-1" data-pay-item-copy="{{id}}">复制</button>
        <button class="clean text-0-2" data-pay-item-delete="{{id}}">删除</button>
    </div>
</div>
`;

module.exports = handlebars.compile(tpl);