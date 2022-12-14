import juicer from 'juicer';
var tpl = {
  articleCell: `
        <div class="recruit-cell" data-article-cell="\${id}">
            <div class="recruit-title">
                <img src="\${cover}" class="recruit-cover">
                <p class="recruit-title-text" data-activity-id="\${id}" data-title="\${title}">\${title}</p>
            </div>
            <div class="recruit-count">
                <p>\${recruitCount}</p>
            </div>
            <div class="recruit-record-count">
                <p>\${recordCount}</p>
            </div>
            <div class="recruit-signIn-count">
                <p>\${signInCount}</p>
            </div>
            <div class="recruit-adm">
            {@each manageUser as item,index}
                <div class="recruit-cover-box clearfix">
                    <img src="\${item.pic}" class="recruit-cover" alt="管理员图片" title="\${item.nickName}">
                    <div class="recruit-cover-mask" data-manage-id="\${item.id}"><span>×</span></div>
                </div>
            {@/each}
            <img src="https://pic.zizaihome.com/6c014dc4-3771-11ea-9210-00163e060b31.png" data-add-manager-id="\${id}" class="recruit-cover add-manager" alt="管理员图片" title="新增管理员">
            </div>
            <div class="recruit-actions">
                <p>
                    <button class="clean-button mgr5" data-id="recruitView" data-title="\${title}" data-activity-id="\${id}">查看</button>
                    <span>-</span>
                    <button class="clean-button mgl5" data-id="recruitPopularize" data-title="\${title}" data-popularizeUrl="\${url}">推广</button>
                    <span>-</span>
                    <button class="clean-button mgl5" data-id="recruitEdit" data-title="\${title}" data-activity-id="\${id}">编辑</button>
                </p>
            </div>
        </div>
    `,
  conditionContentContainer: `
        <div class="condition-content-container" data-container="condition-content">
            <div class="pagination-content-container" data-container="pagination-content" data-page-index="1">
                <div class="content-placeholder">
                    <img src="../../../images/common/loading.gif">
                </div>
            </div>
        </div>
    `,
  paginationContentContainer: `
        <div class="pagination-content-container" data-container="pagination-content" data-page-index="\${pageIndex}">
            <div class="content-placeholder">
                <img src="../../../images/common/loading.gif">
            </div>
        </div>
    `,
  paginationContentContainerEmpty: `
        <div class="content-empty-hint">暂无数据</div>
    `,
  paginationContentContainerLoading: `
        <div class="content-placeholder">
            <img src="../../../images/common/loading.gif">
        </div>
    `,
  paginationContainer: `
        <div class="pagination-container" data-container="pagination"></div>
    `,
  categoryCell: `
        <li><a class="item" data-select-category="\${id}">\${name}</a></li>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
