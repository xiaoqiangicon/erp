import juicer from 'juicer';
var tpl = {
  summaryTbodyEmpty: `
        <tr class="cell-content-empty"><td style="text-align: center; padding-left: 0;" colspan="4">暂无数据</td></tr>
    `,
  linkTbodyEmpty: `
        <tr class="cell-content-empty"><td style="text-align: center; padding-left: 0;" colspan="3">暂无数据</td></tr>
    `,
  summaryTableCell: `
        <tr class="table-cell-\${id}">
            <td>\${sceneName}</td>
            <td>
                {@if !!summary}
                \${summary}
                {@else}
                无
                {@/if}
            </td>
            <td>
                {@if !!sound}
                <span class="play-or-pause play" data-ele="play-or-pause-btn" data-id="\${sceneId}" data-status="0"></span>
                {@else}
                无
                {@/if}
            </td>
            <td>
                <a href="" class="table-cell-option" data-id="\${sceneId}" data-opt="preview">预览</a>
                <a href="" class="table-cell-option mgl10" data-id="\${sceneId}" data-opt="edit">编辑</a>
                <a href="" class="table-cell-option mgl10" data-id="\${sceneId}" data-opt="delete">删除</a>
            </td>
        </tr>
    `,
  linkTableCell: `
        <tr class="table-cell-\${id}">
            <td>\${sceneName}</td>
            <td>\${title}</td>
            <td style="text-align: left; padding-left: 50px;">
                {@if !!url}
                <a href="" class="table-cell-option" data-id="\${sceneId}" data-opt="preview">预览</a>
                {@/if}
                <a href="" class="table-cell-option mgl10" data-id="\${sceneId}" data-opt="edit">编辑</a>
                <a href="" class="table-cell-option mgl10" data-id="\${sceneId}" data-opt="delete">删除</a>
            </td>
        </tr>
    `,
  sceneSelect: `
        <option value="\${sceneId}">\${sceneName}</option>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
