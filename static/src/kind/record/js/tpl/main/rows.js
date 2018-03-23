
const handlebars = require('handlebars');

let tpl = `
{{#each data}}
<div class="row-1">
    <div class="item-1 item-1-1">
        <img src="{{this.avatar}}">
        <span>{{this.name}}</span>
    </div>
    <div class="item-1 item-1-2">{{this.wish}}</div>
    <div class="item-1 item-1-3">{{this.money}}元</div>
    <div class="item-1 item-1-4">{{this.time}}</div>
</div>
{{/each}}
`;

module.exports = handlebars.compile(tpl);