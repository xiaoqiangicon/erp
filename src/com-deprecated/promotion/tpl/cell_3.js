export default `
<div class="content-1 dp-none" data-zzh-promotion-tab-1-content="3">
    <div class="desc-1"><i class="icon-1"></i>可将图片海报保存后发送到微信群、朋友圈或者公众号的文章中传播</div>
    <div class="display-3">
        <div class="left-1 dp-none" id="zzh-promotion-display-3-left-1">
            <img class="zzh-promotion-post-image" id="zzh-promotion-post-image" src="">
        </div>
        <div class="left-2 hide" id="zzh-promotion-display-3-left-2">
            <img class="image-1" src="https://pic.zizaihome.com/03dc7f6e-6dee-11e8-93ae-00163e0c001e.png">
                <div class="container-1">
                    <textarea class="form-control input-1" rows="4" id="zzh-promotion-post-input" placeholder="您可以在这里输入自定义标题哦" {{#if maxPostTitle}}maxlength="{{maxPostTitle}}"{{/if}}>{{postTitle}}</textarea>
                    {{#if maxPostTitle}}
                    <div class="text-1">
                        <span id="zzh-promotion-post-input-count">{{postTitle.length}}</span> / {{maxPostTitle}}
                    </div>
                    {{/if}}
                </div>
        </div>
        <div class="right-1 dp-none" id="zzh-promotion-display-3-right-1">
            <button class="clean common-btn-1 btn-1" id="zzh-promotion-post-wx">微信中保存</button>
            <a class="clean common-btn-1 special btn-2 no-underline" id="zzh-promotion-post-save" download="" href="">保存到电脑</a>
        </div>
        <div class="right-2 hide" id="zzh-promotion-display-3-right-2">
            <button class="clean common-btn-1 btn-1" id="zzh-promotion-post-load">生成海报图</button>
        </div>
    </div>
</div>
`;
