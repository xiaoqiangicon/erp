import handlebars from 'handlebars';

export const itemsTpl = handlebars.compile(`
{{#each data}}
<div class="row-1" data-items-row="{{id}}">
  <div class="cell-1"><input type="checkbox" class="check-1" data-items-row-select="{{id}}" {{#if noNeedPay}}disabled{{/if}}></div>
  <div class="cell-1 cell-1-name">
    <img class="image-1" src="{{cover}}">
    <span>{{title}}</span>
  </div>
  <div class="cell-1">{{priceText}}</div>
  <div class="cell-1">{{chargeText}}</div>
  <div class="cell-1">
    {{#if noNeedPay}}-
    {{else}}
      {{#if hasReward}}{{rewardText}}
      {{else}}<span class="c-badge">未设置</span>
      {{/if}}
    {{/if}}
  </div>
  <div class="cell-1 cell-1-handle">
    <button class="clean {{#if noNeedPay}}special-1{{/if}}" data-items-row-set="{{id}}">{{#if hasReward}}修改{{else}}设置奖励金{{/if}}</button>
  </div>
</div>
{{/each}}
`);

export const recordsTpl = handlebars.compile(`
{{#each data}}
<div class="row-2">
  <div class="cell-2">{{time}}</div>
  <div class="cell-2">{{title}}</div>
  <div class="cell-2">{{price}}</div>
  <div class="cell-2">
    <span class="special-2">{{salesmanName}}</span><br/>
    <span>{{salesmanPhone}}</span>
  </div>
  <div class="cell-2">{{reward}}</div>
  <div class="cell-2">{{charge}}</div>
  <div class="cell-2">
    {{#if statusFinished}}<span class="c-badge">已结算</span>{{/if}}
    {{#if statusUnfinished}}<span class="c-badge c-badge-blue">待结算</span>{{/if}}
    {{#if statusUnhandled}}<span class="c-badge c-badge-orange">未处理</span>{{/if}}
  </div>
</div>
{{/each}}
`);
