import "juicer";
var tpl = {
  display: `
        <div class="component-container component-shortcut"  data-container="component-display" data-type="6" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
            <div class="component-shortcut-title" data-display-shortcut-title="\${id}">\${title}</div>
            <div class="component-shortcut-body" data-display-shortcut-body="\${id}">
                {@each items as item}
                <a class="component-shortcut-item" href="\${item.link}" data-display-shortcut-cell="\${id}">
                    <img class="component-shortcut-item-image" src="\${item.image}" data-display-shortcut-cell-image="\${id}">
                    <div class="component-shortcut-item-title" data-display-shortcut-cell-title="\${id}">\${item.title}</div>
                </a>
                {@/each}
            </div>
            <div class="actions">
                <div class="actions-wrap">
                    <span class="action" data-action="edit-component" data-id="\${id}" data-type="6">编辑</span>
                    <span class="action" data-action="add-component" data-id="\${id}" data-type="6">加内容</span>
                    <span class="action" data-action="delete-component" data-id="\${id}" data-type="6">删除</span>
                </div>
            </div>
            <div class="sort">
                <i class="sort-handler"></i>
            </div>
        </div>
    `,
  displayCell: `
        <a class="component-shortcut-item" href="\${link}" data-display-shortcut-cell="\${id}">
            <img class="component-shortcut-item-image" src="\${image}" data-display-shortcut-cell-image="\${id}">
            <div class="component-shortcut-item-title" data-display-shortcut-cell-title="\${id}">\${title}</div>
        </a>
    `,
  edit: `
        <div class="component-edit component-edit-shortcut" data-container="component-edit" data-type="6" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">标题（可不填）</p>
                <div class="component-edit-cell-body">
                    <input type="text" class="form-control" maxlength="10"  data-edit-shortcut-title="\${id}">
                </div>
            </div>
            <div class="component-edit-cell">
                <p class="component-edit-cell-title">快捷入口</p>
                <div class="component-edit-cell-body">
                    <ul class="component-edit-shortcut-items-container clearfix" data-shortcut-images-container="\${id}">
                        <li data-edit-shortcut-add="\${id}">
                            <button class="clean-button component-upload-btn" data-edit-shortcut-add-btn="\${id}"></button>
                        </li>
                    </ul>
                </div>
            </div>
            
            
            <div class="mg-t-20 t-a-center">
                <button class="btn btn-success" data-action="save-component" data-id="\${id}" data-type="6">保存</button>
            </div>
        </div>
    `,
  editCell: `
        <li class="mgl20 mgr20" data-edit-shortcut-cell="\${id}" data-title="\${title}" data-image="\${image}" data-link="\${link}" data-type="\${type}" data-link-type="\${linkType}" data-sub-type-id="\${subTypeId}">
            <img class="item-image" src="\${image}" data-edit-shortcut-cell-image="\${id}">
            <p class="item-title" data-edit-shortcut-cell-title="\${id}">\${title}</p>
            <button class="clean-button upload-remove" data-edit-shortcut-cell-delete="\${id}">×</button>
            <button class="clean-button item-edit" data-edit-shortcut-cell-edit="\${id}">编辑</button>
        </li>
    `,
  editPopup: `
        <div class="modal popup-shortcut" data-shortcut-popup="\${id}">
            <div class="modal-backdrop fade in" data-popup-backdrop="1"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header modal-header-article">
                        <button type="button" class="close" data-popup-close="1"><span>&times;</span></button>
                        <h4 class="modal-title">设置快捷入口</h4>
                    </div>
                    <div class="modal-body">
                        <div class="popup-shortcut-item clearfix">
                            <div class="popup-shortcut-item-title">跳转：</div>
                            <div class="popup-shortcut-item-body">
                                <div class="popup-shortcut-radios">
                                    <label class="radio-inline one-fourth mgl0">
                                        <input type="radio" name="edit-shortcut-popup-type-\${id}" value="1" data-edit-shortcut-popup-type="\${id}" checked> 链接
                                    </label>
                                    <label class="radio-inline one-fourth mgl0">
                                        <input type="radio" name="edit-shortcut-popup-type-\${id}" value="2" data-edit-shortcut-popup-type="\${id}"> 应用
                                    </label>
                                </div>
                                <div class="popup-shortcut-radios-contents">
                                    <div class="popup-shortcut-radios-content" data-edit-shortcut-popup-type-content="\${id}" data-value="1">
                                        <input class="form-control" type="text" placeholder="填写跳转链接" data-edit-shortcut-popup-link="\${id}">
                                    </div>
                                    <div class="popup-shortcut-radios-content clearfix" data-edit-shortcut-popup-type-content="\${id}" data-value="2" style="display: none;">
                                        <div class="btn-group btn-group-dropdown left">
                                            <button type="button" class="btn btn-default" data-toggle="dropdown">
                                                {@each appTypes as typeItem, index}
                                                {@if index == 0}
                                                <span class="text" data-shortcut-popup-selected-type="\${id}" data-type="\${typeItem.type}" data-url="\${typeItem.url}" data-has-sub-type="{@if !!typeItem.subTypes && !!typeItem.subTypes.length}1{@else}0{@/if}">\${typeItem.name}</span>
                                                {@/if}
                                                {@/each}
                                                <span class="caret mgl30"></span>
                                            </button>
                                            <ul class="dropdown-menu">
                                                {@each appTypes as typeItem}
                                                <li><a class="item" href="javascript: void(0);" data-shortcut-popup-select-type="\${id}" data-type="\${typeItem.type}" data-url="\${typeItem.url}" data-has-sub-type="{@if !!typeItem.subTypes && !!typeItem.subTypes.length}1{@else}0{@/if}">\${typeItem.name}</a></li>
                                                {@/each}
                                            </ul>
                                        </div>
                                        <div class="left mgl20">
                                            {@each appTypes as typeItem, index}
                                            {@if !!typeItem.subTypes && !!typeItem.subTypes.length}
                                            <div class="btn-group btn-group-dropdown left" data-shortcut-popup-sub-type-container="\${id}" data-parent-type="\${typeItem.type}" style="{@if index != 0}display: none;{@/if}">
                                                <button type="button" class="btn btn-default" data-toggle="dropdown">
                                                    {@each typeItem.subTypes as subTypeItem, index2}
                                                    {@if index2 == 0}
                                                    <span class="text" data-shortcut-popup-selected-sub-type="\${id}" data-parent-type="\${typeItem.type}" data-sub-type-id="\${subTypeItem.id}" data-url="\${subTypeItem.url}">\${subTypeItem.name}</span>
                                                    {@/if}
                                                    {@/each}
                                                    <span class="caret mgl30"></span>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    {@each typeItem.subTypes as subTypeItem}
                                                    <li><a class="item" href="javascript: void(0);" data-shortcut-popup-select-sub-type="\${id}" data-parent-type="\${typeItem.type}" data-sub-type-id="\${subTypeItem.id}" data-url="\${subTypeItem.url}">\${subTypeItem.name}</a></li>
                                                    {@/each}
                                                </ul>
                                            </div>
                                            {@/if}
                                            {@/each}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="popup-shortcut-item clearfix">
                                <div class="popup-shortcut-item-title">名称：</div>
                                <div class="popup-shortcut-item-body">
                                    <input class="form-control popup-shortcut-title-input" type="text" maxlength="4" data-edit-shortcut-popup-name="\${id}">
                                    <span>（四字内）</span>
                                </div>
                            </div>
                            <div class="popup-shortcut-item clearfix">
                                <div class="popup-shortcut-item-title">图标：</div>
                                <div class="popup-shortcut-item-body">
                                    <ul class="popup-shortcut-select-container clearfix">
                                        <li data-edit-shortcut-popup-add="\${id}"><button class="clean-button component-upload-btn" data-edit-shortcut-popup-add-btn="\${id}"></button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-green pdl20 pdr20" data-edit-shortcut-popup-confirm="\${id}">保存选择</button>
                    </div>
                </div>
            </div>
        </div>
    `,
  editPopupImageCell: `
        <li data-edit-shortcut-popup-image-cell="\${id}" data-image="\${image}">
            <img class="item-image" src="\${image}">
            <button class="clean-button upload-remove" data-edit-shortcut-popup-image-cell-delete="\${id}">×</button>
        </li>
    `,
  editPopupSelect: `
        <div class="btn-group btn-group-dropdown left">
            <button type="button" class="btn btn-default" data-toggle="dropdown">
                <span class="text" data-shortcut-popup-selected-type="\${id}" data-type="\${selectedType}" data-url="\${selectedTypeUrl}" data-has-sub-type="\${selectedTypeHasSubType}">\${selectedTypeName}</span>
                <span class="caret mgl30"></span>
            </button>
            <ul class="dropdown-menu">
                {@each typeItems as typeItem}
                <li><a class="item" href="javascript: void(0);" data-shortcut-popup-select-type="\${id}" data-type="\${typeItem.type}" data-url="\${typeItem.url}" data-has-sub-type="\${typeItem.hasSubType}">\${typeItem.name}</a></li>
                {@/each}
            </ul>
        </div>
    `,
  editPopupSubSelect: `
        <div class="btn-group btn-group-dropdown left" data-shortcut-popup-sub-type-container="\${id}" data-parent-type="\${type}">
            <button type="button" class="btn btn-default" data-toggle="dropdown">
                <span class="text" data-shortcut-popup-selected-sub-type="\${id}" data-parent-type="\${type}" data-sub-type-id="\${selectedSubTypeId}" data-url="\${selectedSubTypeUrl}">\${selectedSubTypeName}</span>
                <span class="caret mgl30"></span>
            </button>
            <ul class="dropdown-menu">
                {@each subTypeItems as subTypeItem}
                <li><a class="item" href="javascript: void(0);" data-shortcut-popup-select-sub-type="\${id}" data-parent-type="\${type}" data-sub-type-id="\${subTypeItem.id}" data-url="\${subTypeItem.url}">\${subTypeItem.name}</a></li>
                {@/each}
            </ul>
        </div>
    `
};
var compiledTpl = {};
Object.keys(tpl).map(function (key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
