import juicer from 'juicer';
var tpl = {
  cellContainerEmpty: `
        <tr class="cell-content-empty"><td style="text-align: center; padding-left: 0;" colspan="3">暂无数据</td></tr>
    `,
  tableCell: `
        <tr class="table-cell-\${id}">
            <td>
                <!--<img class="head-icon" src="\${pic}">-->
                <span class="head-icon-info">\${name}</span>
            </td>
            <td>\${content}</td>
            <td>
                {@if status === 0}
                <a class="table-cell-option option-visibility mgr10" data-id="\${id}" data-status="\${status}" data-opt="visibility">隐藏</a>
                {@else}
                <a class="table-cell-option option-visibility mgr10" data-id="\${id}" data-status="\${status}" data-opt="visibility">显示</a>
                {@/if}
                <a class="table-cell-option option-edit" data-id="\${id}" data-opt="editor">编辑</a>
                <a class="table-cell-option option-delete mgl10" data-id="\${id}" data-opt="delete">删除</a>
            </td>
        </tr>
    `,
  imageCell: `
        <div class="image-cell" data-id="\${id}" data-src="\${pic}">
            <img class="head-icon" src="\${pic}" data-id="\${id}"> 
            <!--<button class="clean-button image-cell-delete">X</button>-->
        </div>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
