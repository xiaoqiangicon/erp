import handlebars from 'handlebars';

export const rowsTpl = handlebars.compile(`
{{#each data}}
<div class="row-1" data-row="{{id}}">
  <div class="cell-1">{{id}}</div>
  <div class="cell-1 cell-1-name">
    <img class="image-1" src="{{cover}}">
    <span>{{title}}</span>
  </div>
  <div class="cell-1">{{count}}</div>
  <div class="cell-1">{{totalMoney}}</div>
  <div class="cell-1">{{profit}}</div>
  <div class="cell-1">
    <div class="c-switch {{#if canOnline}}{{#if online}}active{{/if}}{{else}}disabled{{/if}}" data-row-status="{{id}}">
      <i class="circle-1"></i>
      <span class="text-left-1">上架中</span>
      <span class="text-right-1">已下架</span>
    </div>
  </div>
  <div class="cell-1 cell-1-handle">
    <button class="clean" data-row-manage="{{id}}">管理</button>
    <span class="{{#unless showDelete}}dp-none{{/unless}}" data-row-delete-section="{{id}}">
      <span class="divider-1"></span>
      <button class="clean" data-row-delete="{{id}}">删除</button>
    </span>
  </div>
</div>
{{/each}}
`);

export const searchTpl = handlebars.compile(`
{{#each data}}
<div class="row-0-1">
  <div class="cell-0-1">
    <button class="clean check-0-1 {{#if added}}disabled{{/if}} {{#unless needPay}}disabled{{/unless}}" data-add-check="{{id}}"></button>
  </div>
  <div class="cell-0-2">{{id}}</div>
  <button class="clean cell-0-3">{{title}}</button>
  <div class="cell-0-4">
    {{#unless needPay}}
    <button class="clean c-badge c-badge-orange">无需支付</button>
    {{else}}
    {{#if added}}<button class="clean c-badge c-badge-blue">已添加</button>{{/if}}
    {{/unless}}
  </div>
</div>

{{/each}}
`);
