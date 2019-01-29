/**
 * Created by kang on 2017/11/8.
 */
require('juicer');

var tpl = {
  cellContainerEmpty: `
        <tr class="cell-content-empty"><td colspan="5">暂无数据</td></tr>
    `,
  tableCell: `
        <tr id="table-cell-\${id}" data-id="\${id}">
        <td style="vertical-align: middle">
            <input type="checkbox" data-ele="select-merit-checkbox" data-userId="\${userId}">
        </td>
        <td>
        {@if rank == 1}
        <div class="table-cell-common">
        <p class="mgt10 rankIndex firstRank"></p>
        {@else if rank == 2}
        <div class="table-cell-common">
        <p class="mgt10 rankIndex secondRank"></p>
        {@else if rank == 3}
        <div class="table-cell-common">
        <p class="mgt10 rankIndex thirdRank"></p>
        {@else}
        <div class="table-cell-common-general">
        <span class="mgt10 rankIndex plainRank">\${rank}</span>
        {@/if}
        </div>
        </td>
        <td class="merit-info-td">
        <div class="merit-info clearfix">
        <div class="merit-info-head">
        <img class="headPic" src="\${pic}">
        </div>
        <div class="merit-info-content">
        <p class="merit-info-name">\${name}</p>
        <p class="merit-info-id">自在家号：\${number_account}</p>
        </div>
        </div>
        </td>
        <td>
        <div class="table-cell-common">
        <p class="mgt10">¥\${money}</p>
        </div>
        </td>
        <td>
        <div class="table-cell-common">
        <p class="mgt10">\${payTimes}</p>
        </div>
        </td>
        <td>
        <div class="table-cell-common">
        <p class="mgt10">
        <a class="table-cell-button" href="/zzhadmin/meritRankDetail/?id=\${id}&numberAccount=\${number_account}">详情</a>
        </p>
        </div>
        </td>
        </tr>
    `,
  tagTableCell: `
        <tr id="table-cell-\${id}" data-id="\${id}">
        <td style="vertical-align: middle">
            <input type="checkbox" data-ele="select-merit-checkbox" data-userId="\${userId}">
        </td>
        <td class="merit-info-td">
        <div class="merit-info clearfix">
        <div class="merit-info-head">
        <img class="headPic" src="\${pic}">
        </div>
        <div class="merit-info-content">
        <p class="merit-info-name">\${name}</p>
        <p class="merit-info-id">自在家号：\${number_account}</p>
        </div>
        </div>
        </td>
        <td>
        <div class="table-cell-common">
        <p class="mgt10">¥\${money}</p>
        </div>
        </td>
        <td>
        <div class="table-cell-common">
        <p class="mgt10">\${payTimes}</p>
        </div>
        </td>
        <td>
        <div class="table-cell-common">
        <p class="mgt10">
        <a class="table-cell-button" href="/zzhadmin/meritRankDetail/?id=\${id}&numberAccount=\${number_account}">详情</a>
        </p>
        </div>
        </td>
        </tr>
    `,
  noTagList: `
        <div class="text-center mgb10" style="line-height: 34px;">暂无分组，请添加分组</div> 
    `,
  tagList: `
        <div class="tag-list clearfix csp" data-ele="tag-list" data-id="\${id}">
            <span class="tag-name">\${name}</span>
            <span class="tag-num">\${num}</span>
        </div>
    `,
  selectOption: `
        <option value="\${id}">\${name}</option>  
    `,
  editTagCtnr: `
        <div style="position: relative;" id="edit-tag-ctnr">
            <input type="text" style="padding-right: 35px;" data-id="\${id}" value="\${name}" id="edit-tag-input" class="form-control" placeholder="回车键确定">
            <!--<div class="edit-tag-input-icon" id="edit-tag-input-icon"></div>-->
            <div class="clearfix mgt20"> 
                <button class="btn btn-success pull-left" id="save-edit-tag">确定</button>
                <button class="btn btn-default pull-right">取消</button>
            </div>
        </div>
        
    `,
};

var compiledTpl = {};

Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});

module.exports = compiledTpl;
