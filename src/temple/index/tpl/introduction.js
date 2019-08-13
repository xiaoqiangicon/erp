import 'juicer';
var tpl = {
  display: `
        <div class="component-container component-introduction" data-container="component-display" data-type="1" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
            <div class="component-introduction-swiper">
                <div class="swiper-container" data-swipe="\${id}" data-type="1">
                    <div class="swiper-wrapper" data-introduction-swiper-wrapper="\${id}">
                        {@each swipes as swipe}
                        <div class="swiper-slide">
                            <a href="\${swipe.link}">
                                <img src="\${swipe.image}" class="image">
                            </a>
                        </div>
                        {@/each}
                    </div>
                    {@if showPagination}<div class="swiper-pagination" data-swipe-pagination="\${id}"></div>{@/if}
                </div>
            </div>
            <div class="component-introduction-body">
                <div class="component-introduction-title">
                    <div class="component-introduction-title-left"><i class="inline-icon"></i><span data-introduction-place-display="\${id}">\${place}</span></div>
                    <div class="component-introduction-title-right">\${visitedCount}人到访</div>
                </div>
                <div class="component-introduction-content">
                    <div class="component-introduction-content-text" data-container="see-more" data-id="\${id}" data-introduction-introduction-display="\${id}">\${introduction}</div>
                    <div class="component-introduction-content-action">
                        <button class="clean-button component-introduction-content-button" data-action="see-more" data-id="\${id}">查看更多</button>
                    </div>
                </div>
            </div>
            <div class="actions">
                <div class="actions-wrap">
                    <span class="action" data-action="edit-component" data-id="\${id}" data-type="1">编辑</span>
                    <span class="action" data-action="add-component" data-id="\${id}" data-type="1">加内容</span>
                    <span class="action" data-action="delete-component" data-id="\${id}" data-type="1">删除</span>
                </div>
            </div>
            <div class="sort">
                <i class="sort-handler"></i>
            </div>
        </div>
    `,
  displayImageCell: `
        <div class="swiper-slide" data-component-id="\${id}" data-display-image-id="\${imageId}" data-type="1">
            <a href=""><img src="\${image}" class="image"></a>
        </div>
    `,
  edit: `
        <div class="component-edit component-edit-introduction"  data-container="component-edit" data-type="1" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">添加图片（最多 5 张）</p>
                <div class="component-edit-cell-body">
                    <ul class="component-edit-upload-container clearfix" data-introduction-images-container="\${id}">
                        <li data-file-upload-container="\${id}" data-type="1">
                            <button class="clean-button component-upload-btn" data-introduction-file-upload="\${id}"></button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">地点</p>
                <div class="component-edit-cell-body component-edit-city-pick" data-place-picker="\${id}">
                    <select class="form-control component-edit-city-pick-cell" data-introduction-province="\${id}">
                        <option>—— 省 ——</option>
                    </select>
                    <select class="form-control component-edit-city-pick-cell" data-introduction-city="\${id}">
                        <option>—— 市 ——</option>
                    </select>
                    <select class="form-control component-edit-city-pick-cell" data-introduction-district="\${id}">
                        <option>—— 区 ——</option>
                    </select>
                </div>
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">简介（最多 500 字）</p>
                <textarea rows="3" class="form-control" maxlength="500" data-introduction-introduction="\${id}" data-input-count="\${id}" data-type="1"></textarea>
                <p class="clearfix mgt10 mgr10"><span class="right"><span data-input-count-display="\${id}" data-type="1">0</span>&nbsp;/&nbsp;500</span></p>
            </div>
            
            
            <div class="mg-t-20 t-a-center">
                <button class="btn btn-success" data-action="save-component" data-id="\${id}" data-type="1">保存</button>
            </div>
        </div>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
