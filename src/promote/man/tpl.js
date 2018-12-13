import handlebars from 'handlebars';

export const rowsTpl = handlebars.compile(`
{{#each data}}
<div class="row-1" data-row="{{id}}">
  <div class="cell-1">{{time}}</div>
  <div class="cell-1">{{title}}</div>
  <div class="cell-1">{{amount}}</div>
  <div class="cell-1">{{rewardRateText}}</div>
  <div class="cell-1">{{reward}}</div>
  <div class="cell-1">
    {{#if statusGot}}<span class="c-badge">已结算</span>{{/if}}
    {{#if statusPending}}<span class="c-badge c-badge-blue">待结算</span>{{/if}}
    {{#if statusUnhandled}}<span class="c-badge c-badge-orange">未处理</span>{{/if}}
  </div>
</div>
{{/each}}
`);

export default {};
