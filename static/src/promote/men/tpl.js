import handlebars from 'handlebars';

export const verifyRowsTpl = handlebars.compile(`
{{#each data}}
<div class="row-1" data-verify-row="{{id}}">
  <div class="cell-1 cell-1-name">
    <img class="image-1" src="{{avatar}}">
    {{nickname}}
  </div>
  <div class="cell-1">{{name}}</div>
  <div class="cell-1">{{phone}}</div>
  <div class="cell-1">{{count}}</div>
  <div class="cell-1">{{amount}}</div>
  <div class="cell-1">
    {{#if statusPending}}<span class="c-badge c-badge-blue">待审核</span>{{/if}}
    {{#if statusRefused}}<span class="c-badge c-badge-orange">已拒绝</span>{{/if}}
  </div>
  <div class="cell-1">{{requestTime}}</div>
  <div class="cell-1 cell-1-handle">
    <button class="clean" data-verify-row-pass="{{id}}">通过</button>
    {{#if statusPending}}
      <span class="divider-1"></span>
      <button class="clean" data-verify-row-refuse="{{id}}">拒绝</button>    
    {{/if}}
  </div>
</div>
{{/each}}
`);

export const manRowsTpl = handlebars.compile(`
{{#each data}}
<div class="row-1 row-2" data-man-row="{{id}}">
  <div class="cell-1 cell-2">
    <img class="avatar-2" src="{{avatar}}">
  </div>
  <div class="cell-1 cell-2">{{nickname}}
    {{#if forbidden}}<br/><span class="c-badge c-badge-orange c-badge-small">禁止推广</span>{{/if}} 
  </div>
  <div class="cell-1 cell-2">{{name}}</div>
  <div class="cell-1 cell-2">{{phone}}</div>
  <div class="cell-1 cell-2">{{count}}</div>
  <div class="cell-1 cell-2">{{amount}}</div>
  <div class="cell-1 cell-2">{{totalAmount}}</div>
  <div class="cell-1 cell-2">{{joinTime}}</div>
  <div class="cell-1 cell-2 cell-1-handle">
    <a class="no-underline cell-1-handle" href="/?id={{id}}">详情</a>
    <span class="divider-1"></span>
    {{#if forbidden}}
    <button class="clean" data-man-row-unforbid="{{id}}">取消禁用</button>
    {{else}}
    <button class="clean" data-man-row-forbid="{{id}}">禁用</button>
    {{/if}}
  </div>
</div>

{{/each}}
`);
