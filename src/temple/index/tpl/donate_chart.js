import "juicer";
var tpl = {
  display: `
         <div class="component-container component-donate-chart" data-container="component-display" data-type="4" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
            <div class="component-donate-chart-top-bar">
                <div class="component-donate-chart-title">
                    <i class="inline-icon"></i><span data-donate-chart-title-display="\${id}">感恩功德</span>
                </div>
                <div class="component-donate-chart-switch">
                    <button class="clean-button component-donate-chart-switch-button" data-action="tab" data-display-donate-chart-type="\${id}" data-index="1" data-id="\${id}">实时</button>
                    <span class="color-666666" data-display-donate-chart-type-devider="\${id}" data-index="1">|</span>
                    <button class="clean-button component-donate-chart-switch-button" data-action="tab" data-display-donate-chart-type="\${id}" data-index="2" data-id="\${id}">月榜</button>
                    <span class="color-666666" data-display-donate-chart-type-devider="\${id}" data-index="2">|</span>
                    <button class="clean-button component-donate-chart-switch-button" data-action="tab" data-display-donate-chart-type="\${id}" data-index="3" data-id="\${id}">总榜</button>
                </div>
            </div>
            <div class="component-donate-chart-body" data-container="tab" data-index="1" data-id="\${id}">
                {@each monthItems as item,index}
                <div class="component-donate-chart-row {@if index<=2}active{@/if}" data-donate-chart-items="\${id}">
                    <span class="component-donate-chart-cell component-donate-chart-cell-sequence">\${item.sequence}</span>
                    <span class="component-donate-chart-cell component-donate-chart-cell-avatar">
                        <img class="component-donate-chart-cell-avatar-image" src="\${item.avatar}">
                    </span>
                    <span class="component-donate-chart-cell component-donate-chart-cell-nickname">\${item.nickname}</span>
                    <span class="component-donate-chart-cell component-donate-chart-cell-amount">\${item.amount}元</span>
                </div>
                {@/each}
            </div>
            <div class="component-donate-chart-body" data-container="tab" data-index="2" data-id="\${id}" style="display: none;">
                {@each totalItems as item,index}
                <div class="component-donate-chart-row {@if index<=2}active{@/if}">
                    <span class="component-donate-chart-cell component-donate-chart-cell-sequence">\${item.sequence}</span>
                    <span class="component-donate-chart-cell component-donate-chart-cell-avatar">
                        <img class="component-donate-chart-cell-avatar-image" src="\${item.avatar}">
                    </span>
                    <span class="component-donate-chart-cell component-donate-chart-cell-nickname">\${item.nickname}</span>
                    <span class="component-donate-chart-cell component-donate-chart-cell-amount">\${item.amount}元</span>
                </div>
                {@/each}
            </div>
            <div class="actions">
                <div class="actions-wrap">
                    <span class="action" data-action="edit-component" data-id="\${id}" data-type="4">编辑</span>
                    <span class="action" data-action="add-component" data-id="\${id}" data-type="4">加内容</span>
                    <span class="action" data-action="delete-component" data-id="\${id}" data-type="4">删除</span>
                </div>
            </div>
            <div class="sort">
                <i class="sort-handler"></i>
            </div>
        </div>
    `,
  edit: `
        <div class="component-edit component-edit-donate-chart"  data-container="component-edit" data-type="4" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">标题（最多 10 字）</p>
                <input type="text" class="form-control" maxlength="10" data-donate-chart-title="\${id}">
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">榜单</p>
                <div class="component-edit-cell-body clearfix">
                    <label class="radio-inline one-third left">
                        <input type="checkbox" name="edit-donate-chart-real-time" value="1" data-edit-donate-chart-type="\${id}" data-index="1" checked> 实时
                    </label>
                    <label class="radio-inline one-third left mgl0">
                        <input type="checkbox" name="edit-donate-chart-month" value="2" data-edit-donate-chart-type="\${id}" data-index="2" checked> 月榜
                    </label>
                    <label class="radio-inline one-third left mgl0">
                        <input type="checkbox" name="edit-donate-chart-total" value="3" data-edit-donate-chart-type="\${id}" data-index="3" checked> 总榜
                    </label>
                </div>
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">条数</p>
                <div class="component-edit-cell-body">
                    <select class="form-control"  data-donate-chart-items-count="\${id}">
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option selected>10</option>
                    </select>
                </div>
            </div>
            
            
            <div class="mg-t-20 t-a-center">
                <button class="btn btn-success" data-action="save-component" data-id="\${id}" data-type="4">保存</button>
            </div>
        </div>
    `
};
var compiledTpl = {};
Object.keys(tpl).map(function (key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
