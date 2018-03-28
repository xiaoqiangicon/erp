
module.exports = `
<div class="main-detail">
    <div class="text-1">详情内容设置</div>
    <div class="container-1">
        <div class="text-2">
            <span>善行标题：</span>
            <span class="mark-1">*</span>
        </div>
        <div class="container-2">
            <input class="form-control input-1" value="{{title}}" maxlength="20">
            <div class="text-3">{{title.length}}/20</div>
        </div>
    </div>
    ${require('./detail/cover')}
    <div class="container-1">
        <div class="text-2">
            <span>详情内容：</span>
            <span class="mark-1">*</span>
        </div>
        <div class="container-2"></div>
    </div>
    <hr>
    <div class="text-1">支付信息设置</div>
    ${require('./detail/pay')}
    <hr>
    <div class="text-1">分享信息设置</div>
    ${require('./detail/share')}
    <div class="container-1">
        <button class="btn btn-green btn-1">保存</button>
    </div>
</div>
`;