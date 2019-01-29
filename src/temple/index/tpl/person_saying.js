require('juicer');

const displayComponents = `
{@if components && components.length}
{@each components as com, index}
<div class="cs-pointer row-1" data-container="person-saying" data-id="\${id}" data-com-id="\${com.id}">
  <div class="inner-2">
    <img class="avatar-1" src="\${com.avatar}" data-com-figure-avatar="\${com.id}">
    <div>
      <span class="name-1" data-com-figure-name="\${com.id}">\${com.name}</span>
      <span class="c-badge-1 {@if !com.honorName}dp-none{@/if}" data-com-figure-honor-name="\${com.id}">\${com.honorName}</span>
    </div>
    <div class="desc-1" data-com-figure-descrition="\${com.id}">$\${com.description}</div>
  </div>
</div>
{@if (index + 1) % 3 === 0}<div style="height: 1px; width: 100%; clear: both;"></div>{@/if}
{@/each}
{@else}
<div style="text-align: center; height: 80px; line-height: 80px;">请在右边添加高僧法师</div>
{@/if}
`;

const editComponents = `
{@each components as com, index}
<div class="edit-com-figure-row" data-edit-com-figure-row="\${com.id}">
  <img class="avatar-1" src="\${com.avatar}">
  <button class="clean-button c-btn-1 c-btn-1-orange del-1" data-edit-com-figure-row-del="\${com.id}">删除</button>
  <button class="clean-button c-btn-1 edit-1" data-edit-com-figure-row-edit="\${com.id}">编辑</button>
  <span class="name-1">\${com.name}</span><br>
  <span class="name-2">\${com.honorName}</span>
</div>
{@/each}
`;

var tpl = {
  display: `
  <div class="component-container com-figure {@if subType === 2}com-figure-cell{@/if}" data-container="component-display" data-type="2" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
    <div class="component-container-inner inner-1" data-com-figure-wrapper="\${id}">
      ${displayComponents}
    </div>
    <div class="actions">
      <div class="actions-wrap">
        <span class="action" data-action="edit-component" data-id="\${id}" data-type="2">编辑</span>
        <span class="action" data-action="add-component" data-id="\${id}" data-type="2">加内容</span>
        <span class="action" data-action="delete-component" data-id="\${id}" data-type="2">删除</span>
      </div>
    </div>
    <div class="sort">
      <i class="sort-handler"></i>
    </div>
  </div>
  `,
  displayComponents,
  edit: `
  <div class="component-edit"  data-container="component-edit" data-type="2" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
    <div class="component-edit-cell">
      <p class="component-edit-cell-title">展示样式</p>
      <div class="component-edit-cell-body clearfix">
        <label class="radio-inline one-half left">
          <input type="radio" name="edit-figure-display-type-\${id}" data-edit-com-figure-display-type="\${id}" value="1" {@if subType !== 2}checked{@/if}> 列表展示
        </label>
        <label class="radio-inline one-half mgl0 left">
          <input type="radio" name="edit-figure-display-type-\${id}" data-edit-com-figure-display-type="\${id}" value="2" {@if subType === 2}checked{@/if}> 头像展示
        </label>
      </div>
    </div>
    <div class="component-edit-cell">
      <p class="component-edit-cell-title">法师列表</p>
      <div class="component-edit-cell-body clearfix" data-edit-com-figure-body="\${id}">${editComponents}</div>
    </div>
    <div class="mgt10">
      <button class="clean-button c-btn-1 c-btn-1-round pdl15 pdr15" data-edit-com-figure-add="\${id}">添加法师</button>
    </div>
    <div class="mg-t-20 t-a-center">
      <button class="btn btn-success" data-action="save-component" data-id="\${id}" data-type="2">保存</button>
    </div>
  </div>
  `,
  editComponents,
  avatarRow: `
  <li data-edit-pop-figure-avatar-row="0">
    <img class="item-image" src="\${image}" data-edit-pop-figure-avatar-row-image="0">
    <button class="clean-button upload-remove" data-edit-pop-figure-avatar-row-del="0">×</button>
  </li>
  `,
};
var compiledTpl = {};

Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});

module.exports = compiledTpl;
