const handlebars = require('handlebars');

const tpl =
  `
{{#each data}}
<div class="row-1" data-row="{{this.id}}">
    <div class="item-1 item-1-1">{{this.id}}</div>
    <div class="item-1 item-1-2">{{this.title}}</div>
    <div class="item-1 item-1-3">{{this.totalMoney}}</div>
    <div class="item-1 item-1-4">{{this.totalPeople}}</div>
    <div class="item-1 item-1-5">
        <div class="clean btn-1" data-row-publish="{{this.id}}">发布进展</div>
        <div class="clean btn-1" data-row-edit="{{this.id}}">编辑</div>
        <div class="clean btn-1 more" data-row-more="{{this.id}}">
            更多
            <div class="more-operate more-hide" data-more-operate="{{this.id}}">
                <div data-row-record="{{this.id}}">善行记录</div>
                <div data-row-promo="{{this.id}}">推广</div>
                <div data-row-delete="{{this.id}}">删除</div>
            </div>
        </div>` +
  // <button class="clean btn-1" data-row-record="{{this.id}}">善行记录</button>
  // <button class="clean btn-1" data-row-promo="{{this.id}}">推广</button>
  // <button class="clean btn-1" data-row-delete="{{this.id}}">删除</button>
  `
    </div>
</div>
{{/each}}
`;

module.exports = handlebars.compile(tpl);
