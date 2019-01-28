require('juicer');
const loading = require('../../../images/loading.gif');

var tpl = {
  payCell: `
        <div class="pay-cell">
            <span class="pay-article">\${title}</span>
            <span class="pay-nick-name">
                <img src="\${avatar}" class="pay-avatar">
                <span>\${nickname}</span>
            </span>
            <span class="pay-amount">\${amount}元</span>
            <span class="pay-time">\${time}</span>
        </div>
    `,
  pagination: `
        {@if currentPage > 1}
        <button class="btn btn-default button mgr20" data-current-page="\${currentPage}" data-pagination-index="-1" data-start-date="\${startDate}" data-end-date="\${endDate}">上一页</button>
        {@/if}
        {@if nextPage > currentPage}
        <button class="btn btn-default button" data-current-page="\${currentPage}" data-pagination-index="-2" data-start-date="\${startDate}" data-end-date="\${endDate}">下一页</button>
        {@/if}
    `,
  dateContentContainer: `
        <div class="date-content-container" data-container="date-content" data-start-date="\${startDate}" data-end-date="\${endDate}">
            <div class="pagination-content-container" data-container="pagination-content" data-page-index="1">
                <div class="content-placeholder">
                    <img src="${loading}">
                </div>
            </div>
        </div>
    `,
  paginationContentContainer: `
        <div class="pagination-content-container" data-container="pagination-content" data-page-index="\${pageIndex}">
            <div class="content-placeholder">
                <img src="${loading}">
            </div>
        </div>
    `,
  paginationContentContainerEmpty: `
        <div class="content-empty-hint">暂无数据</div>
    `,
  paginationContainer: `
        <div class="pagination-container" data-container="pagination" data-start-date="\${startDate}" data-end-date="\${endDate}"></div>
    `,
};

var compiledTpl = {};

Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});

module.exports = compiledTpl;
