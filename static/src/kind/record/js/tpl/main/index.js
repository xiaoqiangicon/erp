
const handlebars = require('handlebars');

let tpl = `
<div class="content-container" id="content-container">
    <div class="main-nav">
        <span>微寺院</span>
        <i class="icon-1"></i>
        <a href="/zzhadmin/charityIndex/">日行一善</a>
        <i class="icon-1"></i>
        <span>善行记录</span>
    </div>
    ${require('./banner')}
    ${require('./filter')}
    <div class="main-detail">
        <div class="container-1">
            <div class="item-1 item-1-1 text-1">行善人</div>
            <div class="item-1 item-1-2 text-1">行善心愿</div>
            <div class="item-1 item-1-3 text-1">行善金额</div>
            <div class="item-1 item-1-4 text-1">行善时间</div>
        </div>
        <div class="container-2" id="list-container"></div>
        <div class="container-3" id="pagination-container"></div>
    </div>
</div>
`;

module.exports = handlebars.compile(tpl);