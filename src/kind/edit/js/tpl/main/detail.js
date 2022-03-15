// import cover from './detail/cover';
// import pay from './detail/pay';
import share from './detail/share';

export default `
<div class="main-detail">
    <div class="text-1">详情内容设置</div>
    <div class="container-1">
        <div class="text-2">
            <span>善行标题：</span>
            <span class="mark-1">*</span>
        </div>
        <div class="container-2">
            <input class="form-control input-1" value="{{title}}" maxlength="20" data-text-count="1" id="input-title">
            <div class="text-3"><span data-text-count-show="1">{{#if title}}{{title.length}}{{else}}0{{/if}}</span>/20</div>
        </div>
    </div>
    <div class="container-1">
        <div class="text-2">
            <span>封面图片：</span>
        </div>
        <div class="container-2">
            <div class="main-detail-cover">
                <div class="of-hidden">
                    <div class="container-0-1" id="index-img-container">
                        <div class="item-0-1" data-share-item="1">
                            <img src="https://pic.zizaihome.com/1b97a7f4-f49e-11e9-bbae-00163e060b31.png" data-share-item-image="0">
                            <button class="clean common-delete" data-share-item-delete="0">X</button>
                        </div>
                    </div>
                    <button class="clean btn-0-2 ps-relative hide" style="margin-left: 0;" id="index-img-add"></button>
                </div>
            </div>
            <div class="img-tips">建议图片的尺寸为750*652</div>
        </div>
    </div>
    <div class="container-1">
        <div class="text-2">
            <span>支付后图片：</span>
        </div>
        <div class="container-2">
            <div class="main-detail-cover">
                <div class="of-hidden">
                    <div class="container-0-1" id="res-img-container">
                        <div class="item-0-1" data-share-item="1">
                            <img src="https://pic.zizaihome.com/7c147df2-df39-11e9-8a1a-00163e060b31.png" data-share-item-image="1">
                            <button class="clean common-delete" data-share-item-delete="1">X</button>
                        </div>
                    </div>
                    <button class="clean btn-0-2 ps-relative hide" style="margin-left: 0;" id="res-img-add"></button>
                </div>
            </div>
            <div class="img-tips">建议图片的尺寸为750*484</div>
        </div>
    </div>
    <div class="container-1">
        <div class="text-2">
            <span>详情内容：</span>
            <span class="mark-1">*</span>
        </div>
        <div class="container-2" id="editor"></div>
    </div>
    <hr>
    <div class="text-1">分享信息设置</div>
    ${share}
    <div class="container-1">
        <button class="btn btn-green btn-1" id="ok">{{#if isEdit}}更新{{else}}保存{{/if}}</button>
    </div>
</div>
`;
