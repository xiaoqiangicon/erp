
module.exports = `
<div class="container-1">
    <div class="text-2">
        <span>分享标题：</span>
    </div>
    <div class="container-2">
        <input class="form-control input-1" value="{{shareTitle}}">
        <div class="text-3">{{shareTitle.length}}/20</div>
        <div class="container-3">
            <span>展示参与人次</span>
            <button class="clean mark-2 {{#if showPeopleCountWhenShare}}active{{/if}}"><i></i></button>
        </div>
    </div>
</div>
<div class="container-1">
    <div class="text-2">
        <span>分享描述：</span>
    </div>
    <div class="container-2">
        <textarea class="form-control input-2" rows="3" placeholder="请填写转发分享时的描述（不填写为默认详情描述）">{{shareDesc}}</textarea>
        <div class="text-4">{{shareDesc.length}}/60</div>
    </div>
</div>
<div class="container-1">
    <div class="text-2">
        <span>分享图标：</span>
    </div>
    <div class="container-2">
        <div class="main-detail-cover">
            <div class="of-hidden">
                <div class="container-0-1" id="share-icon-container"></div>
                <button class="clean btn-0-2" id="share-icon-add"></button>
            </div>
        </div>
    </div>
</div>
`;