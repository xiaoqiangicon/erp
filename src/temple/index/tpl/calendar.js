import * as images from '../images';
import juicer from 'juicer';
var tpl = {
  display: `
        <div class="component-container component-calendar"  data-container="component-display" data-type="5" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
          <div class="component-container-inner">
              <div class="component-calendar-body {@if !!currentHasBuddhist || !latestBuddhist}today-has-foshi{@/if}" data-calendar-see-detail="\${id}">
                    <div class="component-calendar-show-detail clearfix">
                        <div class="solar-day-container">
                            <div class="solar-day">
                                <div class="solar-day-inner" data-calendar-show-day="\${id}">
                                    <div class="solar-day-month">\${currentLunarMonthName}</div>
                                    <div class="solar-day-day">\${currentLunarDayName}</div>
                                </div>
                            </div>
                            <div class="extra-day">
                                <div class="lunar-day" data-calendar-show-lunar="\${id}">公历 \${currentMonth}月\${currentDay}日</div>
                                <div class="week-day" data-calendar-show-week-day="\${id}">\${currentWeekDay}</div>
                            </div>
                        </div>
                        <div class="event-day-info">
                            <div class="event-day-info-cell buddhist-info {@if !currentBirthDay && !currentFeastDay}event-day-info-cell-middle{@/if}">
                                <span class="buddhist-mark">寺</span>
                                <span>{@if !currentHasBuddhist}今日无寺务{@else}\${currentFirstBuddhistTitle}{@/if}</span>
                            </div>
                            {@if !!currentBirthDay}<div class="event-day-info-cell birth-day-info">\${currentBirthDay}</div>{@/if}
                            {@if !!currentFeastDay}<div class="event-day-info-cell feast-day-info">\${currentFeastDay}</div>{@/if}
                        </div>
                    </div>
                </div>
                {@if !currentHasBuddhist && !!latestBuddhist}
                <div class="component-calendar-predict">
                    <div class="title-mark">寺务预告</div>
                    <div class="content" data-calendar-see-detail="\${id}">\${latestBuddhist.month}月\${latestBuddhist.day}日    \${latestBuddhist.title}</div>
                </div>
                {@/if}
            </div>
            <div class="actions">
                <div class="actions-wrap">
                    <span class="action" data-action="edit-component" data-id="\${id}" data-type="5">编辑</span>
                    <span class="action" data-action="add-component" data-id="\${id}" data-type="5">加内容</span>
                    <span class="action" data-action="delete-component" data-id="\${id}" data-type="5">删除</span>
                </div>
            </div>
            <div class="sort">
                <i class="sort-handler"></i>
            </div>
        </div>
    `,
  edit: `
        <div class="component-edit component-edit-calendar"  data-container="component-edit" data-type="5" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
            <div class="component-edit-cell">
                <p class="component-edit-cell-title fb fs16">添加内容</p>
                <button class="btn btn-green btn-sm mgl10 pdl20 pdr20" data-edit-calendar-add="\${id}">添加</button>
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title fb fs16">新添加的内容</p>
            </div>
            <div class="component-edit-cell">
                <div class="component-edit-calendar-selected-content" data-edit-calendar-new-add-content="\${id}"></div>
            </div>
            {@if !!isUpdate}
            <div class="component-edit-cell">
                <p class="component-edit-cell-title fb fs16">已添加的内容</p>
                <div class="clearfix">
                    <input class="form-control component-edit-calendar-selected-date" placeholder="选择时间" data-edit-calendar-select-date="\${id}">
                    <button class="btn btn-green btn-sm left mgl20 pdl20 pdr20" data-edit-calendar-query-all="\${id}">查看全部</button>
                </div>
            </div>
            <div class="component-edit-cell">
                <div data-edit-calendar-selected-content-container="\${id}">
                    <div class="component-edit-calendar-selected-content" data-edit-calendar-selected-content="\${id}" data-date="0">
                        <div class="component-edit-calendar-selected-content" data-edit-calendar-selected-content-inner="\${id}" data-date="0" data-page="1">
                            {@each dayItems as dayItem}
                            <div class="component-edit-calendar-selected-cell" data-edit-calendar-selected-cell="\${id}" data-year="\${dayItem.year}" data-month="\${dayItem.month}" data-day="\${dayItem.day}">
                                <div class="title">
                                    <span>\${dayItem.year}年\${dayItem.month}月\${dayItem.day}日</span>
                                    <button class="btn btn-info btn-xs right pdl20 pdr20" data-edit-calendar-selected-cell-modify="\${id}" data-year="\${dayItem.year}" data-month="\${dayItem.month}" data-day="\${dayItem.day}">修改</button>
                                </div>
                                <div class="content mgt10">
                                    <ul class="content-unit" data-edit-calendar-selected-activities-container="\${id}" data-year="\${dayItem.year}" data-month="\${dayItem.month}" data-day="\${dayItem.day}">
                                        {@each dayItem.activities as activity}
                                        <li class="content-cell" data-edit-calendar-selected-activity-cell="\${id}" data-year="\${dayItem.year}" data-month="\${dayItem.month}" data-day="\${dayItem.day}" data-type="\${activity.type}" data-id="\${activity.id}" data-title="\${activity.title}" data-image="\${activity.image}">\${activity.title}</li>
                                        {@/each}
                                    </ul>
                                </div>
                            </div>
                            {@/each}
                        </div>
                    </div>
                </div>
                <div class="clearfix mgt40 pdl10 pdr10" data-edit-calendar-pagination="\${id}"></div>
            </div>
            {@/if}
            
            <div class="mg-t-20 t-a-center">
                <button class="btn btn-success" data-action="save-component" data-id="\${id}" data-type="5">保存</button>
            </div>
        </div>
    `,
  editPagination: `
        {@if totalPages > 1 && currentPage != 1}
        <a class="pagination-cell" data-current-page="\${currentPage}" data-total-pages="\${totalPages}" data-calendar-page-index="-1" data-id="\${id}">上一页</a>
        {@/if}
        {@if totalPages <= 7}
        {@each pages as page}
        <a class="pagination-cell {@if currentPage == page}active{@/if}" data-current-page="\${currentPage}" data-total-pages="\${totalPages}" data-calendar-page-index="\${page}" data-id="\${id}">\${page}</a>
        {@/each}
        {@else}
        {@each pages as page}
        {@if page == 1 || page == totalPages || currentPage <= 4 && page <= 4 || currentPage >= totalPages - 3 && page >= totalPages - 3 || currentPage - page == 1 || currentPage - page == 0 || currentPage - page == -1}
        <a class="pagination-cell {@if currentPage == page}active{@/if}" data-current-page="\${currentPage}" data-total-pages="\${totalPages}" data-calendar-page-index="\${page}" data-id="\${id}">\${page}</a>
        {@else if currentPage >4 && page == 2 || currentPage < totalPages - 3 && page == totalPages - 1}
        <a class="pagination-cell disabled">...</a>
        {@/if}
        {@/each}
        {@/if}
        {@if totalPages > 1 && currentPage != totalPages}<a class="pagination-cell" data-current-page="\${currentPage}" data-total-pages="\${totalPages}" data-calendar-page-index="-2" data-id="\${id}">下一页</a>{@/if}
        <input class="pagination-cell-input" type="text" data-calendar-pagination-input="\${id}">
        <a class="pagination-cell" data-current-page="\${currentPage}" data-total-pages="\${totalPages}" data-calendar-page-index="-3" data-id="\${id}">跳到</a>
    `,
  editPaginationContent: `
        <div class="component-edit-calendar-selected-content" data-edit-calendar-selected-content="\${id}" data-date="\${date}"></div>
    `,
  editPaginationContentOnePage: `
        <div data-edit-calendar-selected-content-inner="\${id}" data-date="0" data-page="\${page}"></div>
    `,
  editPaginationContentActivities: `
        {@each dayItems as dayItem}
        <div class="component-edit-calendar-selected-cell" data-edit-calendar-selected-cell="\${id}" data-year="\${dayItem.year}" data-month="\${dayItem.month}" data-day="\${dayItem.day}">
            <div class="title">
                <span>\${dayItem.year}年\${dayItem.month}月\${dayItem.day}日</span>
                <button class="btn btn-info btn-xs right pdl20 pdr20" data-edit-calendar-selected-cell-modify="\${id}" data-year="\${dayItem.year}" data-month="\${dayItem.month}" data-day="\${dayItem.day}">修改</button>
            </div>
            <div class="content mgt10">
                <ul class="content-unit" data-edit-calendar-selected-activities-container="\${id}" data-year="\${dayItem.year}" data-month="\${dayItem.month}" data-day="\${dayItem.day}">
                    {@each dayItem.activities as activity}
                    <li class="content-cell" data-edit-calendar-selected-activity-cell="\${id}" data-year="\${dayItem.year}" data-month="\${dayItem.month}" data-day="\${dayItem.day}" data-type="\${activity.type}" data-id="\${activity.id}" data-title="\${activity.title}" data-image="\${activity.image}">\${activity.title}</li>
                    {@/each}
                </ul>
            </div>
        </div>
        {@/each}
    `,
  editPopup: `
        <div class="modal fade in popup-calendar-select-date" data-calendar-popup="\${id}">
            <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="clearfix"><button class="clean-button right" data-popup-close="1">X</button></div>
                        <div class="title">
                            <p class="fb fs16">选择时间：</p>
                            <p class="fs13">单击选择时间（可选择多个）</p>
                            <button class="btn btn-green btn-xs mgl10 pdl20 pdr20" data-popup-calendar-add-time="1">添加时间</button>
                        </div>
                        <div class="content">
                            <ul data-calendar-popup-date-container="\${id}"></ul>
                        </div>
                        <div class="title">
                            <p class="fb fs16">内容源：</p>
                            <p class="fs13">如有支付等佛事活动，请您先在微佛事新建佛事</p>
                            <p class="clearfix">
                                <button class="btn btn-green btn-xs mgl10 pdl20 pdr20" data-calendar-popup-add-huddhist="\${id}">关联佛事</button>
                                <button class="btn btn-green btn-xs mgl10 pdl20 pdr20" data-calendar-popup-new-title="\${id}">新建条目</button>
                            </p>
                        </div>
                        <div class="content">
                            <ul data-calendar-popup-activity-container="\${id}"></ul>
                        </div>
                    </div>
                    <div class="modal-footer popup-calendar-select-date">
                        <button class="btn btn-green btn-sm pdl20 pdr20" data-calendar-popup-ok="\${id}">确定</button>
                    </div>
                </div>
            </div>
        </div>
    `,
  editPopupDateCell: `
        <li data-year="\${year}" data-month="\${month}" data-day="\${day}" data-calendar-popup-date-cell="\${id}"><span>\${year}-\${month}-\${day}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class="clean-button" data-calendar-popup-date-cell-delete="\${id}">X</button></li>
    `,
  editPopupActivityCell: `
        <li data-type="\${type}" data-activity-id="\${activityId}" data-calendar-popup-activity-cell="\${id}" data-title="\${title}" data-image="\${image}">\${title}</li>
    `,
  editBuddhistPopup: `
        <div class="modal" data-calendar-buddhist-popup="\${id}">
            <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header modal-header-article">
                        <button type="button" class="close" data-popup-close="1"><span>&times;</span></button>
                        <h4 class="modal-title">添加条目</h4>
                    </div>
                    <div class="modal-body">
                        <div class="modal-tab-container">
                            <a class="modal-tab active" data-tab="1" data-type="calendar-buddhist-popup-\${id}">佛事</a>
                        </div>
                        <div class="mgt10 mgb10 bdb-eeeeee"></div>
                        <div class="modal-tab-content" data-tab-container="1" data-type="calendar-buddhist-popup-\${id}">
                            <div data-calendar-buddhist-popup-content="\${id}" data-tab-index="1">
                                <div class="popup-swipe-list-placeholder"><img src="${images.loadingGif}"></div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-green btn-sm left" data-calendar-buddhist-reserve-selected="\${id}" data-tab-index="1">保存选择</button>
                                <div class="right" data-calendar-buddhist-pagination="\${id}" data-tab-index="1"></div>
                            </div>
                        </div>
                        <div class="modal-tab-content" data-tab-container="2" data-type="calendar-buddhist-popup-\${id}" style="display: none;">
                            <div data-calendar-buddhist-popup-content="\${id}" data-tab-index="2">
                                <div class="popup-swipe-list-placeholder"><img src="${images.loadingGif}"></div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-green btn-sm left" data-calendar-buddhist-reserve-selected="\${id}" data-tab-index="2">保存选择</button>
                                <div class="right" data-calendar-buddhist-pagination="\${id}" data-tab-index="2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
  editBuddhistPopupPaginationContent: `
        <div data-calendar-buddhist-pagination-content="\${id}" data-tab-index="\${tabIndex}" data-calendar-buddhist-pagination-index="\${pageIndex}" class="popup-swipe-list-page-cell">
            <div class="popup-swipe-list-placeholder"><img src="${images.loadingGif}"></div>
        </div>
    `,
  editBuddhistPopupPaginationContentCell: `
        <div class="article-select-cell">
            <img class="article-select-cell-image" src="\${image}">
            <button class="btn btn-default btn-sm article-select-cell-action" data-calendar-buddhist-selected="0" data-tab-index="\${tabIndex}" data-image-id="\${id}" data-image="\${image}" data-content="\${content}" data-component-id="\${componentId}">选取</button>
            <p class="article-select-cell-text">\${content}</p>
        </div>
    `,
  editBuddhistPopupPagination: `
        <span class="pagination-description">共\${totalCount}条，每页\${perPage}条</span>
        {@if totalPages > 1 && currentPage != 1}<a class="pagination-cell" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-calendar-buddhist-page-index="-1" data-id="\${id}" data-tab-index="\${tabIndex}">上一页</a>{@/if}
        {@if totalPages <= 7}
        {@each pages as page}
        <a class="pagination-cell {@if currentPage == page}active{@/if}" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-calendar-buddhist-page-index="\${page}" data-id="\${id}" data-tab-index="\${tabIndex}">\${page}</a>
        {@/each}
        {@else}
        {@each pages as page}
        {@if page == 1 || page == totalPages || currentPage <= 4 && page <= 4 || currentPage >= totalPages - 3 && page >= totalPages - 3 || currentPage - page == 1 || currentPage - page == 0 || currentPage - page == -1}
        <a class="pagination-cell {@if currentPage == page}active{@/if}" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-calendar-buddhist-page-index="\${page}" data-id="\${id}" data-tab-index="\${tabIndex}">\${page}</a>
        {@else if currentPage >4 && page == 2 || currentPage < totalPages - 3 && page == totalPages - 1}
        <a class="pagination-cell disabled">...</a>
        {@/if}
        {@/each}
        {@/if}
        {@if totalPages > 1 && currentPage != totalPages}<a class="pagination-cell" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-calendar-buddhist-page-index="-2" data-id="\${id}" data-tab-index="\${tabIndex}">下一页</a>{@/if}
        <input class="pagination-cell-input" type="text" data-calendar-buddhist-pagination-input="\${id}" data-tab-index="\${tabIndex}">
        <a class="pagination-cell" data-total-count="\${totalCount}" data-current-page="\${currentPage}" data-per-page="\${perPage}" data-total-pages="\${totalPages}" data-calendar-buddhist-page-index="-3" data-id="\${id}" data-tab-index="\${tabIndex}">跳到</a>
    `,
  editNewTitlePopup: `
        <div class="modal fade in popup-calendar-add-title" data-calendar-new-title-popup="\${id}">
            <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" data-popup-close="1"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">新建条目</h4>
                    </div>
                    <div class="modal-body">
                        <p class="body-top-section">
                            <span class="title-mark">标题</span>
                            <input type="text" class="form-control title-input" data-calendar-new-title-input="\${id}">
                            <button class="btn btn-green btn-sm mgl15" data-calendar-new-title-add="\${id}">新增</button>
                        </p>
                        <div class="body-bottom-section">
                            <ul data-calendar-new-title-content="\${id}"></ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-green btn-sm pdl20 pdr20" data-calendar-new-title-ok="\${id}">保存</button>
                    </div>
                </div>
            </div>
        </div>
    `,
  editNewTitleContentCell: `
        <li class="added-title-cell" data-calendar-new-title-content-cell="\${id}" data-id="\${contentId}" data-text="\${text}">
            <span class="added-title-text">\${text}</span>
            <button class="btn btn-warning btn-xs mgl5" data-calendar-new-title-content-cell-delete="\${id}" data-id="\${contentId}">删除</button>
        </li>
    `,
  editNewAddUnit: `
        <div class="component-edit-calendar-selected-cell" data-edit-calendar-new-add-cell="\${id}" data-year="\${year}" data-month="\${month}" data-day="\${day}">
            <div class="title">
                <span>\${year}年\${month}月\${day}日</span>
                <button class="btn btn-info btn-xs right pdl20 pdr20" data-edit-calendar-new-add-cell-modify="\${id}" data-year="\${year}" data-month="\${month}" data-day="\${day}">修改</button>
            </div>
            <div class="content mgt10">
                <ul class="content-unit" data-edit-calendar-new-add-activities-container="\${id}" data-year="\${year}" data-month="\${month}" data-day="\${day}">
                    {@each activities as activity}
                    <li class="content-cell" data-edit-calendar-new-add-activity-cell="\${id}" data-year="\${year}" data-month="\${month}" data-day="\${day}" data-type="\${activity.type}" data-id="\${activity.id}" data-image="\${activity.image}"  data-title="\${activity.title}">\${activity.title}</li>
                    {@/each}
                </ul>
            </div>
        </div>
    `,
  editNewAddActivityCell: `
        <li class="content-cell" data-edit-calendar-new-add-activity-cell="\${id}" data-year="\${year}" data-month="\${month}" data-day="\${day}" data-type="\${activity.type}" data-id="\${activity.id}" data-image="\${activity.image}"  data-title="\${activity.title}">\${activity.title}</li>
    `,
  editModifyNewAddActivitiesPopup: `
        <div class="modal fade in popup-calendar-modify-activity" data-calendar-modify-new-add-activities-popup="\${id}">
            <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" data-popup-close="1"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" data-calendar-modify-new-add-activities-title="\${id}">修改----年--月--日新添加的内容</h4>
                </div>
                <div class="modal-body">
                    <table class="width-100-percent">
                        <tbody class="width-100-percent" data-calendar-modify-new-add-activities-content="\${id}"></tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    `,
  editModifyNewAddActivityCells: `
        {@each activities as activity}
        <tr class="popup-activity-cell" data-calendar-modify-new-add-activity-cell="\${id}">
            <td class="sequence" data-calendar-modify-new-add-activity-sequence="\${id}">1</td>
            <td class="title">\${activity.title}</td>
            <td class="image">{@if !!activity.image}<img src="\${activity.image}">{@/if}</td>
            <td class="action"><button class="btn btn-warning btn-sm" data-calendar-modify-new-add-activity-delete="\${id}" data-year="\${year}" data-month="\${month}" data-day="\${day}" data-id="\${activity.id}" data-type="\${activity.type}">删除</button></td>
        </tr>
        {@/each}
    `,
  editModifySelectedActivitiesPopup: `
        <div class="modal fade in popup-calendar-modify-activity" data-calendar-modify-selected-activities-popup="\${id}">
            <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" data-popup-close="1"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" data-calendar-modify-selected-activities-title="\${id}">修改----年--月--日新添加的内容</h4>
                    </div>
                    <div class="modal-body">
                        <table class="width-100-percent">
                            <tbody class="width-100-percent" data-calendar-modify-selected-activities-content="\${id}"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `,
  editModifySelectedActivityCells: `
        {@each activities as activity}
        <tr class="popup-activity-cell" data-calendar-modify-selected-activity-cell="\${id}">
            <td class="sequence" data-calendar-modify-selected-activity-sequence="\${id}">1</td>
            <td class="title">\${activity.title}</td>
            <td class="image">{@if !!activity.image}<img src="\${activity.image}">{@/if}</td>
            <td class="action"><button class="btn btn-warning btn-sm" data-calendar-modify-selected-activity-delete="\${id}" data-year="\${year}" data-month="\${month}" data-day="\${day}" data-id="\${activity.id}" data-type="\${activity.type}">删除</button></td>
        </tr>
        {@/each}
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
