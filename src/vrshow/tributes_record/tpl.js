/**
 * Created by root on 2017/9/13.
 */
require('juicer');

var tpl = {
  cellContainerEmpty: `
        <tr class="cell-content-empty"><td style="text-align: center; padding-left: 0;" colspan="5">暂无数据</td></tr>
    `,
  tableCell: `
        <tr class="table-cell table-cell-\${id}">
            <td>
                <img class="head-icon" src="\${src}">
                <span class="head-icon-info">\${name}</span>
            </td>
            <td>\${tributes}</td>
            <td>\${wish}</td>
            <td>\${money}</td>
            <td>
                \${payTime}
            </td>
        </tr>
    `,
};

var compiledTpl = {};

Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});

module.exports = compiledTpl;
