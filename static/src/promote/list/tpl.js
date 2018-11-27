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
      <span class="text-right-1">下架中</span>
    </div>
  </div>
  <div class="cell-1 cell-1-handle">
    <button class="clean" data-row-manage="{{id}}">管理</button>
    {{#unless online}}
    {{#unless ended}}
    <span class="divider-1"></span>
    <button class="clean" data-row-delete="{{id}}">删除</button>
    {{/unless}}
    {{/unless}}
  </div>
</div>
{{/each}}
`);

export const searchTpl = handlebars.compile(`
{{#each data}}
<div class="row-3 {{#if added}}disabled{{/if}}" data-search-row="{{id}}">
  2018年祈福大典法会2018年祈福大典法会2018年祈福大典法会
  {{#if added}}<span class="badge-1">已添加</span>{{/if}}
</div>
{{/each}}
`);
