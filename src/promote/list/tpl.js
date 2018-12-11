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
    <div class="c-switch {{#if online}}active{{/if}}" data-row-status="{{id}}">
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
<div class="row-3 {{#if added}}disabled{{/if}} {{#unless needPay}}disabled{{/unless}}" data-search-row="{{id}}">
  {{title}}
  {{#if added}}
    <span class="badge-1">已添加</span>
  {{else}}
  {{#unless needPay}}<span class="badge-1 badge-1-red">无需支付</span>{{/unless}}
  {{/if}}
</div>
{{/each}}
`);
