const handlebars = require('handlebars');

const tpl = `
<div class="content-container" id="content-container">
    <div class="main-header" id="main-header">
        <div class="header-item publish header-item-active">发布进展</div>
        <div class="header-item record">发布记录</div>
    </div>
    ${require('./detail/content')}
</div>
`;

module.exports = handlebars.compile(tpl);
