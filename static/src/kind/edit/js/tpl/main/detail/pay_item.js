
const handlebars = require('handlebars');

let tpl = `
<div class="row-0-1" data-pay-item="{{id}}">
    <div class="item-0-1 item-0-1-1">
        <input class="form-control" value="{{name}}">
    </div>
    <div class="item-0-1 item-0-1-2">
        <input class="form-control" placeholder="为0或不填为无需支付" value="{{price}}">
    </div>
    <div class="item-0-1 item-0-1-3">
        <input class="form-control" placeholder="填写说明可介绍此善行特点，吸引用户选择" value="{{desc}}">
    </div>
    <div class="item-0-1 item-0-1-4">
        <div class="container-0-3 {{#unless icon}}hide{{/unless}}" data-pay-item-icon="{{id}}">
            <img src="{{icon}}">
            <button class="clean common-delete">X</button>
        </div>
        <button class="clean btn-0-2 {{#if icon}}hide{{/if}}" data-pay-item-add="{{id}}"></button>
    </div>
    <div class="item-0-1 item-0-1-5">
        <button class="clean text-0-1" data-pay-item-copy="{{id}}">复制</button>
        <button class="clean text-0-2" data-pay-item-delete="{{id}}">删除</button>
    </div>
</div>
`;

module.exports = handlebars.compile(tpl);