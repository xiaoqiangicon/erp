import handlebars from 'handlebars';

export const itemsTpl = handlebars.compile(`
{{#each data}}
<div class="row-1" data-items-row="{{id}}">
  <div class="cell-1"><input type="checkbox" class="check-1" data-items-row-select="{{id}}"></div>
  <div class="cell-1 cell-1-name">
    <img class="image-1" src="{{cover}}">
    <span>{{title}}</span>
  </div>
  <div class="cell-1">{{priceText}}</div>
  <div class="cell-1">{{chargeText}}</div>
  <div class="cell-1">
    {{#if noNeedPay}}-
    {{else}}
      {{#if hasProfit}}{{profitText}}
      {{else}}<span class="c-badge">未设置</span>
      {{/if}}
    {{/if}}
  </div>
  <div class="cell-1 cell-1-handle">
    <button class="clean {{#if noNeedPay}}special-1{{/if}}">{{#if hasProfit}}修改{{else}}设置奖励金{{/if}}</button>
  </div>
</div>
{{/each}}
`);
