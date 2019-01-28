require('juicer');
const loading = require('../../../images/loading.gif');

var tpl = {
  articleCell: `
        <div class="article-cell" data-article-cell="\${id}">
            <div class="article-title">
                <img src="\${cover}" class="article-cover">
                <p class="article-title-text">\${title}</p>
            </div>
            <div class="article-visit-count">
                <p>\${readCount}人</p>
            </div>
            <div class="article-support">
                <p>\${support}</p>
            </div>
            <div class="article-pay-amount">
                <p>\${payAmount}</p>
            </div>
            <div class="article-status">
                <p class="{@if statusInt == 2}green{@else if statusInt == 3}red{@/if}">\${status}</p>
            </div>
            <div class="article-actions">
                <p {@if statusInt == 3}style="line-height: 50px;"{@/if}>
                    {@if statusInt != 3}
                    <button class="clean-button mgr5" data-article-edit="\${id}" data-status="\${statusInt}">编辑</button>
                    <span>-</span>
                    {@/if}
                    <button class="clean-button mgl5" data-article-delete="\${id}" data-status="\${statusInt}">删除</button>
                </p>
                {@if statusInt != 3}
                <p>
                    <button class="clean-button mgr5" data-article-copy="\${id}" data-status="\${statusInt}">复制</button>
                    <span>-</span>
                    <button class="clean-button mgl5" data-article-view="\${id}" data-status="\${statusInt}">{@if statusInt == 1}预览{@else if statusInt == 2}分享{@/if}</button>
                </p>
                {@/if}
            </div>
        </div>
    `,
  pagination: `
        {@if currentPage > 1}
        <button class="btn btn-default button mgr20" data-current-page="\${currentPage}" data-pagination-index="-1" data-category="\${category}" data-status="\${status}" data-search-key="\${searchKey}">上一页</button>
        {@/if}
        {@if nextPage > currentPage}
        <button class="btn btn-default button" data-current-page="\${currentPage}" data-pagination-index="-2" data-category="\${category}" data-status="\${status}" data-search-key="\${searchKey}">下一页</button>
        {@/if}
    `,
  conditionContentContainer: `
        <div class="condition-content-container" data-container="condition-content" data-category="\${category}" data-status="\${status}" data-search-key="\${searchKey}">
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
  paginationContentContainerLoading: `
        <div class="content-placeholder">
            <img src="${loading}">
        </div>
    `,
  paginationContainer: `
        <div class="pagination-container" data-container="pagination" data-category="\${category}" data-status="\${status}" data-search-key="\${searchKey}"></div>
    `,
  viewPopup: `
        <div class="promotion" data-popup="\${id}" data-type="article-view">
            <div class="promotion-background" data-popup-overlay="\${id}"></div>
            <div class="promotion-pane">
                <div class="promotion-top">
                    <div class="promotion-title">预览</div>
                        <div class="promotion-close" data-popup-close="\${id}">X</div>
                    </div>
                    <div class="promotion-content">
                        <div class="promotion-content-container">
                            <div class="clearfix">
                                <div class="promotion-content-cell left pdr20 bdr-eeeeee" {@if status == 1}style="height: auto;"{@/if}>
                                <div class="promotion-content-title">微信二维码</div>
                                <div class="promotion-content-content" data-qrcode-container="\${id}"></div>
                                <div class="promotion-content-action">
                                    <a class="active" data-switch-qrcode="\${id}" data-type="1">小图</a>
                                    <span>|</span>
                                    <a data-switch-qrcode="\${id}" data-type="2">中图</a>
                                    <span>|</span>
                                    <a data-switch-qrcode="\${id}" data-type="3">大图</a>
                                </div>
                                 {@if status != 1}
                                <div class="mgt20">
                                    <p class="mgb0">用法：</p>
                                    <p class="mgb0 pdl20">1、印于传单、海报上，现场推广。</p>
                                    <p class="mgb0 pdl20">2、嵌于微信文章内，长按识别进入。</p>
                                </div>
                                {@/if}
                            </div>
                            <div class="promotion-content-cell right pdl20" {@if status == 1}style="height: auto;"{@/if}>
                                <div class="promotion-content-title">微信推广链接</div>
                                <div class="promotion-content-content">
                                    <input class="form-control mgt60" data-clipboard-input="\${id}" value="\${link}">
                                </div>
                                <div class="promotion-content-action">
                                    <a class="btn btn-green white-force pdl10 pdr10" data-clipboard-target="[data-clipboard-input='\${id}']">复制链接</a>
                                </div>
                                 {@if status != 1}
                                <div class="mgt20">
                                    <p class="mgb0">用法：</p>
                                    <p class="mgb0 pdl20">1、设置为微信公众号菜单项。</p>
                                    <p class="mgb0 pdl20">2、放在微信“阅读原文”入口里。</p>
                                </div>
                                {@/if}
                            </div>
                        </div>
                         {@if status == 1}
                        <div class="promotion-tip">此链接为临时链接，仅用于草稿预览。</div>
                        {@/if}
                    </div>
                </div>
            </div>
        </div>
    `,
  categoryCell: `
        <li><a class="item" data-select-category="\${id}">\${name}</a></li>
    `,
};

var compiledTpl = {};

Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});

module.exports = compiledTpl;
