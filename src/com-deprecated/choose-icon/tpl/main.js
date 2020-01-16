import handlebars from 'handlebars';
let tpl = `
<div class="modal fade in zzh-choose-icon" data-zzh-choose-icon="{{id}}">
    <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-popup-close="1"><span>&times;</span></button>
                <h4 class="modal-title">添加图标</h4>
            </div>
            <div class="modal-body clearfix">
                <div class="pagination-container" data-zzh-choose-icon-pagination-container="1"></div>
                <div class="pagination-content" data-zzh-choose-icon-pagination="1"></div>
            </div>
            <div class="modal-footer">
                <button class="btn zzh-choose-icon-btn-green zzh-choose-icon-ok" data-zzh-choose-icon-submit="1">确认</button>
            </div>
        </div>
    </div>
</div>
`;
export default handlebars.compile(tpl);
