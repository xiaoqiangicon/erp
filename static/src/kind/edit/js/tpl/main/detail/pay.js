
module.exports = `
<div class="main-detail-pay">
    <div class="container-0-1">
        <div class="row-0-1">
            <div class="item-0-1 item-0-1-1">善行名称</div>
            <div class="item-0-1 item-0-1-2">金额</div>
            <div class="item-0-1 item-0-1-3">善行名称</div>
            <div class="item-0-1 item-0-1-4">图片</div>
            <div class="item-0-1 item-0-1-5">操作</div>
        </div>
    </div>
    <div class="container-0-2">
        ${require('./pay/row.html')}
        ${require('./pay/row.html')}
        ${require('./pay/row.html')}
        ${require('./pay/row.html')}
    </div>

    <button class="btn btn-green btn-0-1">添加善行选择项</button>
</div>
`;