
const handlebars = require('handlebars');

let tpl = `
<div class="content-container" id="content-container">
    <div class="main-nav">
        <span>微寺院</span>
        <i class="icon-1"></i>
        <a href="/">日行一善</a>
        <i class="icon-1"></i>
        <span>{{#if isEdit}}编辑{{else}}创建{{/if}}</span>
    </div>
    ${require('./detail')}
</div>
`;

module.exports = handlebars.compile(tpl);