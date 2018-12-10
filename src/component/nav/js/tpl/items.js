
const handlebars = require('handlebars');

let tpl = `
{{#each items}}
<li class="component-nav-menu-item hide" data-menu-item-id="{{this.id}}">
    <a class="component-nav-menu-item-header">
        <span class="boots-icon glyphicon {{this.icon}} green" aria-hidden="true"></span>
        <span class="text">{{#if this.isHtml}}{{{this.name}}}{{else}}{{this.name}}{{/if}}</span>
        <span class="glyphicon glyphicon-chevron-down pull-right arrow green" aria-hidden="true"></span>
    </a>
    <ul class="component-nav-sub-menu-inner">
        {{#each this.subItems}}
        <li class="hide"><a data-menu-sub-item-id="{{this.id}}" href="{{this.link}}">{{#if this.isHtml}}{{{this.name}}}{{else}}{{this.name}}{{/if}}</a></li>
        {{/each}}
    </ul>
</li>
{{/each}}
`;

module.exports = handlebars.compile(tpl);