import images from "../images";
import "juicer";
var tpl = {
  display: `
        <div class="component-container component-swipe-list" data-container="component-display" data-type="3" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
            <div class="component-swipe-list-title" data-swipe-list-title-container="\${id}">
                <div class="component-swipe-list-title-main">
                    <i class="inline-icon"></i>
                    <span data-swipe-list-title-display="\${id}">\${title}</span>
                </div>
                <button class="clean-button component-swipe-list-title-more" data-swipe-list-more="\${id}">
                    <span class="text">查看更多</span>
                    <i class="inline-icon"></i>
                </button>
            </div>
            <div data-swipe-list-body-parent="\${id}" data-type="1">
                <div class="component-swipe-list-body {@if subType==2}vertical{@else if subType==3}two-columns{@/if}" data-swipe-list-body="\${id}" data-index="1" data-type="1">
                    <div class="swiper-container">
                        <div class="swiper-wrapper" data-swipe-list-swiper-wrapper="\${id}" data-index="1" data-type="1">
                            {@each swipes as swipe}
                            <a class="swiper-slide component-swipe-list-cell" href="\${swipe.link}" data-swipe-list-cell="\${id}" data-index="1" data-type="1">
                                <div class="component-swipe-list-cell-image">
                                    <img src="\${swipe.image}">
                                    {@if swipe.status == 1 || swipe.status == 3}
                                    <div class="status {@if swipe.status == 3}ended{@/if}">{@if swipe.status == 1}即将开始{@else}圆满结束{@/if}</div>
                                    {@/if}
                                </div>
                                <div class="component-swipe-list-cell-description">\${swipe.description}</div>
                            </a>
                            {@/each}
                        </div>
                    </div>
                </div>
                <div class="component-swipe-list-body {@if subType==2}vertical{@else if subType==3}two-columns{@/if}" data-swipe-list-body="\${id}" data-index="2" data-type="1" style="display: none">
                    <div class="swiper-container">
                        <div class="swiper-wrapper" data-swipe-list-swiper-wrapper="\${id}" data-index="2" data-type="1"></div>
                    </div>
                </div>
            </div>
            <div data-swipe-list-body-parent="\${id}" data-type="2" style="display: none;">
                <div class="component-swipe-list-body {@if subType==2}vertical{@else if subType==3}two-columns{@/if}" data-swipe-list-body="\${id}" data-index="1" data-type="2">
                    <div class="swiper-container">
                        <div class="swiper-wrapper" data-swipe-list-swiper-wrapper="\${id}" data-index="1" data-type="2">
                            {@each swipes as swipe}
                            <a class="swiper-slide component-swipe-list-cell" href="\${swipe.link}" data-swipe-list-cell="\${id}" data-index="1" data-type="2">
                                <div class="component-swipe-list-cell-image">
                                    <img src="\${swipe.image}">
                                </div>
                                <div class="component-swipe-list-cell-description">\${swipe.description}</div>
                            </a>
                            {@/each}
                        </div>
                    </div>
                </div>
                <div class="component-swipe-list-body {@if subType==2}vertical{@else if subType==3}two-columns{@/if}" data-swipe-list-body="\${id}" data-index="2" data-type="2" style="display: none">
                    <div class="swiper-container">
                        <div class="swiper-wrapper" data-swipe-list-swiper-wrapper="\${id}" data-index="2" data-type="2"></div>
                    </div>
                </div>
            </div>
            <div class="actions">
                <div class="actions-wrap">
                    <span class="action" data-action="edit-component" data-id="\${id}" data-type="3">编辑</span>
                    <span class="action" data-action="add-component" data-id="\${id}" data-type="3">加内容</span>
                    <span class="action" data-action="delete-component" data-id="\${id}" data-type="3">删除</span>
                </div>
            </div>
            <div class="sort">
                <i class="sort-handler"></i>
            </div>
        </div>
    `,
  displayImageCell: `
        <a class="swiper-slide component-swipe-list-cell" data-swipe-list-cell="\${componentId}" data-index="2" data-image-id="\${imageId}" data-type="\${sourceType}" data-source-type="\${sourceType}">
            <div class="component-swipe-list-cell-image">
                <img src="\${image}">
                {@if status == 1 || status == 3}
                <div class="status {@if status == 3}ended{@/if}">{@if status == 1}即将开始{@else}圆满结束{@/if}</div>
                {@/if}
            </div>
            <div class="component-swipe-list-cell-description">\${content}</div>
        </a>
    `,
  displayImageCellIndex1: `
        <a class="swiper-slide component-swipe-list-cell" data-swipe-list-cell="\${componentId}" data-index="1" data-type="\${type}">
            <div class="component-swipe-list-cell-image">
                <img src="\${image}">
                {@if status == 1 || status == 3}
                <div class="status {@if status == 3}ended{@/if}">{@if status == 1}即将开始{@else}圆满结束{@/if}</div>
                {@/if}
            </div>
            <div class="component-swipe-list-cell-description">\${content}</div>
        </a>
    `,
  edit: `
        <div class="component-edit component-edit-swipe-list"  data-container="component-edit" data-type="3" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">标题（最多 10 字）</p>
                <div class="component-edit-cell-body">
                    <input type="text" maxlength="10" class="form-control" data-swipe-list-title="\${id}">
                </div>
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">内容源</p>
                <div class="component-edit-cell-body">
                    <select class="form-control edit-swipe-list-select" data-swipe-list-source-category="\${id}">
                        <option value="1" selected>佛事</option>
                        <option value="2">文章</option>
                    </select>
                </div>
            </div>
            <div data-swipe-list-edit-types-container="\${id}" data-type="1">
                <div class="component-edit-cell">
                    <p class="component-edit-cell-title"></p>
                    <div class="component-edit-cell-body clearfix">
                        <label class="radio-inline one-half left">
                            <input type="radio" name="tab-button-1-\${id}" data-type="1" data-swipe-list-tab="\${id}" data-swipe-list-display-source="\${id}" value="1" checked> 分类显示
                        </label>
                        <label class="radio-inline one-half mgl0 left">
                            <input type="radio" name="tab-button-1-\${id}" data-type="1" data-swipe-list-tab="\${id}" data-swipe-list-display-source="\${id}" value="2"> 指定条目
                        </label>
                    </div>
                </div>
                <div data-swipe-list-tab-container-parent="\${id}" data-type="1">
                    <div data-swipe-list-tab-container="\${id}" data-index="1" data-type="1">
                        <div class="component-edit-cell">
                            <p class="component-edit-cell-title"></p>
                            <div class="component-edit-cell-body">
                                <select class="form-control edit-swipe-list-select" data-swipe-list-source-sub-category="\${id}" data-type="1">
                                    {@each buddhistTypes as type}
                                    <option value="\${type.id}" {@if type.id<=0}selected{@/if}>\${type.name}</option>
                                    {@/each}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div data-swipe-list-tab-container="\${id}" data-index="2" data-type="1" style="display: none;">
                        <div class="component-edit-cell">
                            <p class="component-edit-cell-title"></p>
                            <div class="component-edit-cell-body">
                                <ul class="component-edit-upload-container clearfix" data-swipe-list-images-container="\${id}" data-type="1">
                                    <li data-select-article-container="\${id}" data-type="1">
                                        <button class="clean-button component-upload-btn" data-select-article="\${id}" data-type="1"></button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div data-swipe-list-edit-types-container="\${id}" data-type="2" style="display: none;">
                <div class="component-edit-cell">
                    <p class="component-edit-cell-title"></p>
                    <div class="component-edit-cell-body clearfix">
                        <label class="radio-inline one-half left">
                            <input type="radio" name="tab-button-2-\${id}" data-type="2" data-swipe-list-tab="\${id}" data-swipe-list-display-source="\${id}" value="1" checked> 分类显示
                        </label>
                        <label class="radio-inline one-half left mgl0">
                            <input type="radio" name="tab-button-2-\${id}" data-type="2" data-swipe-list-tab="\${id}" data-swipe-list-display-source="\${id}" value="2"> 指定条目
                        </label>
                    </div>
                </div>
                <div data-swipe-list-tab-container-parent="\${id}" data-type="2">
                    <div data-swipe-list-tab-container="\${id}" data-index="1" data-type="2">
                        <div class="component-edit-cell">
                            <p class="component-edit-cell-title"></p>
                            <div class="component-edit-cell-body">
                                <select class="form-control edit-swipe-list-select" data-swipe-list-source-sub-category="\${id}" data-type="2">
                                    {@each articleTypes as type}
                                    <option value="\${type.id}" {@if type.id<=0}selected{@/if}>\${type.name}</option>
                                    {@/each}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div data-swipe-list-tab-container="\${id}" data-index="2" data-type="2" style="display: none;">
                        <div class="component-edit-cell">
                            <p class="component-edit-cell-title"></p>
                            <div class="component-edit-cell-body">
                                <ul class="component-edit-upload-container clearfix" data-swipe-list-images-container="\${id}" data-type="2">
                                    <li data-select-article-container="\${id}" data-type="2">
                                        <button class="clean-button component-upload-btn" data-select-article="\${id}" data-type="2"></button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="component-edit-cell" data-swipe-list-items-count-container="\${id}">
                <p class="component-edit-cell-title">展示条数</p>
                <div class="component-edit-cell-body">
                    <select class="form-control edit-swipe-list-select" data-swipe-list-items-count="\${id}">
                        <option>2</option>
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
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">版式</p>
                <div class="component-edit-cell-body clearfix">
                    <label class="radio-inline one-fourth left">
                        <input type="radio" name="swipe-list-sub-type-\${id}" value="1" data-swipe-list-sub-type="\${id}" checked> 横向滚动
                    </label>
                    <label class="radio-inline one-fourth left mgl0">
                        <input type="radio" name="swipe-list-sub-type-\${id}" value="2" data-swipe-list-sub-type="\${id}"> 竖向大图
                    </label>
                    <label class="radio-inline one-fourth left mgl0">
                        <input type="radio" name="swipe-list-sub-type-\${id}" value="3" data-swipe-list-sub-type="\${id}"> 竖向双行
                    </label>
                    <label class="radio-inline one-fourth left mgl0">
                        <input type="radio" name="swipe-list-sub-type-\${id}" value="4" data-swipe-list-sub-type="\${id}"> 竖向小图
                    </label>
                </div>
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title bdb-eeeeee"></p>
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title"></p>
                <div class="component-edit-cell-body">
                    <label class="radio-inline one-third">
                        <input type="checkbox" data-swipe-list-show-title="\${id}" checked> 显示标题
                    </label>
                </div>
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title"></p>
                <div class="component-edit-cell-body">
                    <label class="radio-inline one-third">
                        <input type="checkbox" name="" data-swipe-list-show-more="\${id}" checked> 显示更多
                    </label>
                </div>
            </div>
            
            <div class="mg-t-20 t-a-center">
                <button class="btn btn-success" data-action="save-component" data-id="\${id}" data-type="3">保存</button>
            </div>
        </div>
    `,
  editPopup: `
        <div class="modal" data-swipe-list-popup="\${id}" data-type="\${type}">
            <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header modal-header-article">
                        <button type="button" class="close" data-popup-close="1"><span>&times;</span></button>
                        <h4 class="modal-title">添加条目</h4>
                    </div>
                    <div class="modal-body">
                        <div class="modal-tab-container">{@if type == 1}佛事{@else}文章{@/if}</div>
                        <div class="mgt10 mgb10 bdb-eeeeee"></div>
                        <div data-swipe-list-popup-content="\${id}" data-type="\${type}">
                            <div class="popup-swipe-list-placeholder"><img src="${images.loadingGif}"></div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-green btn-sm left" data-swipe-list-reserve-selected="\${id}" data-type="\${type}">保存选择</button>
                            <div class="right" data-swipe-list-pagination="\${id}" data-type="\${type}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
  editPopupPaginationContent: `
        <div data-swipe-list-pagination-content="\${id}" data-type="\${type}" data-pagination-index="\${pageIndex}" class="popup-swipe-list-page-cell">
            <div class="popup-swipe-list-placeholder"><img src="${images.loadingGif}"></div>
        </div>
    `,
  editPopupPaginationContentCell: `
        <div class="article-select-cell">
            <img class="article-select-cell-image" src="\${image}">
            <button class="btn btn-default btn-sm article-select-cell-action {@if status == 4}red{@/if}" {@if status != 4}data-swipe-list-selected="0" data-type="\${type}" data-image-id="\${id}" data-image="\${image}" data-content="\${content}" data-component-id="\${componentId}" data-status="\${status}"{@/if}>{@if status == 4}未审核{@else}选取{@/if}</button>
            {@if ended}<p class="article-select-cell-ended-mark">已结束</p>{@/if}
            {@if unStarted}<p class="article-select-cell-un-started-mark">未开始</p>{@/if}
            <p class="article-select-cell-text">\${content}</p>
        </div>
    `,
  editPopupPagination: `
        <span class="pagination-description">共\${totalCount}条，每页\${perPage}条</span>
        {@if totalPages > 1 && currentPage != 1}<a class="pagination-cell" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-page-index="-1" data-id="\${id}" data-type="\${type}">上一页</a>{@/if}
        {@if totalPages <= 7}
        {@each pages as page}
        <a class="pagination-cell {@if currentPage == page}active{@/if}" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-page-index="\${page}" data-id="\${id}" data-type="\${type}">\${page}</a>
        {@/each}
        {@else}
        {@each pages as page}
        {@if page == 1 || page == totalPages || currentPage <= 4 && page <= 4 || currentPage >= totalPages - 3 && page >= totalPages - 3 || currentPage - page == 1 || currentPage - page == 0 || currentPage - page == -1}
        <a class="pagination-cell {@if currentPage == page}active{@/if}" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-page-index="\${page}" data-id="\${id}" data-type="\${type}">\${page}</a>
        {@else if currentPage >4 && page == 2 || currentPage < totalPages - 3 && page == totalPages - 1}
        <a class="pagination-cell disabled">...</a>
        {@/if}
        {@/each}
        {@/if}
        {@if totalPages > 1 && currentPage != totalPages}<a class="pagination-cell" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-page-index="-2" data-id="\${id}" data-type="\${type}">下一页</a>{@/if}
        <input class="pagination-cell-input" type="text" data-pagination-input="\${id}" data-type="\${type}">
        <a class="pagination-cell" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-page-index="-3" data-id="\${id}" data-type="\${type}">跳到</a>
    `,
  editSelectedCell: `
        <li data-upload-image-container="\${imageId}" data-type="3" data-image="\${image}" data-content="\${content}" data-component-id="\${componentId}" data-status="\${status}" data-source-type="\${sourceType}">
            <img src="\${image}" data-upload-image="\${imageId}">
            <button class="clean-button upload-remove" data-upload-image-delete="\${componentId}" data-image-id="\${imageId}" data-component-type="3" data-source-type="\${sourceType}">×</button>
        </li>
    `
};
var compiledTpl = {};
Object.keys(tpl).map(function (key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
