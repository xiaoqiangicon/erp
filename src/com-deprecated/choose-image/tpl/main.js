import handlebars from 'handlebars';
let tpl = `
<div class="modal fade in zzh-choose-image" data-zzh-choose-image="{{id}}">
    <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-popup-close="1"><span>&times;</span></button>
                <h4 class="modal-title">添加图片</h4>
            </div>
            <div class="modal-body clearfix">
                <div class="left-part" data-zzh-choose-image-left-part-main="1">
                    <div class="left-part-line">
                        <button class="btn zzh-choose-image-btn-green" data-zzh-choose-image-add="1">上传图片</button>
                    </div>
                    <div class="left-part-line zzh-choose-image-mg-t-30">
                        <div class="vertical-tab active" data-zzh-choose-image-tab-1="1">用过素材</div>
                        <div class="vertical-tab" data-zzh-choose-image-tab-1="2">系统素材</div>
                    </div>
                    {{#if showManage}}
                    <div class="left-part-line left-part-foot" data-zzh-choose-image-to-manage-container="1">
                        <button class="btn btn-info" data-zzh-choose-image-to-manage="1">管理图片</button>
                    </div>
                    {{/if}}
                </div>
                <div class="left-part" data-zzh-choose-image-left-part-manage="1" style="display: none;">
                    <div class="left-part-line">
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" data-zzh-choose-image-select-all="1"> 全选
                            </label>
                        </div>
                        <p>已选择 <span data-zzh-choose-image-selected-count="1">0</span> 项</p>
                        <p class="text-center"><button class="btn btn-warning" data-zzh-choose-image-delete-selected="1">删除所选</button></p>
                    </div>
                    <div class="left-part-line left-part-foot">
                        <button class="btn btn-info" data-zzh-choose-image-cancel-manage="1">取消管理</button>
                    </div>
                </div>
                <div class="right-part">
                    <div class="pagination-container" data-zzh-choose-image-pagination-container="1"></div>
                    <div class="pagination-content" data-zzh-choose-image-pagination="1"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn zzh-choose-image-btn-green zzh-choose-image-ok" data-zzh-choose-image-submit="1">确认</button>
            </div>
        </div>
    </div>
</div>
`;
export default handlebars.compile(tpl);
