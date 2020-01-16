import handlebars from 'handlebars';
let tpl = `
<div class="modal fade in zzh-choose-image-add" data-zzh-choose-image-add-popup="{{id}}">
    <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"  data-popup-close="1"><span>&times;</span></button>
                <h4 class="modal-title">添加图片</h4>
            </div>
            <div class="modal-body clearfix">
                <div class="title-section hide">
                    <ul class="zzh-choose-image-tab zzh-choose-image-tab-sm">
                        <li class="active" data-zzh-choose-image-tab-2="1"><a>本地图片</a></li>
                        <li data-zzh-choose-image-tab-2="2"><a>网络图片</a></li>
                    </ul>
                </div>
                <div class="body-section">
                    <div class="tab-container" data-zzh-choose-image-tab-2-container="1">
                        <ul class="images-container-local clearfix" data-zzh-choose-image-upload-content="1">
                            <li class="image-cell" data-zzh-choose-image-upload-button="1">
                                <div class="zzh-choose-image-clean upload-button" data-zzh-choose-image-upload-button-inner="1"></div>
                            </li>
                        </ul>
                        <div class="upload-hint">仅支持 jpg，png，gif 三种格式</div>
                    </div>
                    <div class="tab-container" data-zzh-choose-image-tab-2-container="2" style="display: none">
                        <div class="input-section">
                            <input class="form-control input-element" placeholder="请添加网络图片地址" data-zzh-choose-image-extract-input="1">
                            <button class="btn zzh-choose-image-btn-green btn-sm button-element" data-zzh-choose-image-extract-submit="1">提取</button>
                        </div>
                        <ul class="images-container-net clearfix" data-zzh-choose-image-extract-content="1"></ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn zzh-choose-image-btn-green btn-sm zzh-choose-image-add-ok" data-zzh-choose-image-add-submit="1">确认</button>
            </div>
        </div>
    </div>
</div>
`;
export default handlebars.compile(tpl);
