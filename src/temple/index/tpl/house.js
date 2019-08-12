import "juicer";
import cookie from "js-cookie";
const openShiJingTanSi = !!parseInt(cookie.get("pw_vr_devote"));
const displayComponents = `
{@if houses && houses.length}
{@each houses as house, index}
<div class="row-1 cs-pointer" data-container="house" data-id="\${id}" data-com-id="\${house.id}">
  <img class="cover-1" src="\${house.covers[0]}" data-com-house-cover="\${house.id}">
  <div class="inner-2">
    <div class="name-1" data-com-house-name="\${house.id}">\${house.name}</div>
    <div class="desc-1" data-com-house-intro="\${house.id}">
      $\${house.intro}
    </div>
  </div>
</div>
{@if (index + 1) % 3 === 0}<div style="height: 1px; width: 100%; clear: both;"></div>{@/if}
{@/each}
{@else}
<div style="text-align: center; height: 80px; line-height: 80px;">请在右边添加殿堂场景</div>
{@/if}
`;
const editComponents = `
{@each houses as house, index}
<div class="edit-com-house-row" data-edit-com-house-row="\${house.id}">
  <img class="cover-1" src="\${house.covers[0]}">
  <button class="clean-button c-btn-1 c-btn-1-orange del-1" data-edit-com-house-row-del="\${house.id}">删除</button>
  <button class="clean-button c-btn-1 edit-1" data-edit-com-house-row-edit="\${house.id}">编辑</button>
  <span class="name-1">\${house.name}</span><br>
</div>
{@/each}
`;
const tip = `
<div class="house-edit-tip">
  <span>开通实景探寺能全方位展示寺院场景，给信众带来惊艳震撼的新式礼佛体验</span>
  <div class="mgt5 text-right">
    <a class="btn btn-green btn-sm pdl20 pdr20" href="/zzhadmin/vr_introduce/">查看详情</a>
  </div>
</div>
`;
var tpl = {
  display: `
  <div class="component-container com-house {@if subType === 2}com-house-cell{@/if}" data-container="component-display" data-type="7" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
    <div class="component-container-inner">
      <div class="title-1">
        <i class="icon-1"></i>
        <span data-com-house-title="\${id}">\${title}</span>
      </div>
      <div class="inner-1" data-com-house-wrapper="\${id}">
        ${displayComponents}
      </div>
    </div>
    <div class="actions">
      <div class="actions-wrap">
        <span class="action" data-action="edit-component" data-id="\${id}" data-type="7">编辑</span>
        <span class="action" data-action="add-component" data-id="\${id}" data-type="7">加内容</span>
        <span class="action" data-action="delete-component" data-id="\${id}" data-type="7">删除</span>
      </div>
    </div>
    <div class="sort">
      <i class="sort-handler"></i>
    </div>
  </div>
  `,
  displayComponents,
  edit: `
  <div class="component-edit"  data-container="component-edit" data-type="7" data-id="\${id}" data-is-update="\${isUpdate}" data-server-sort-id="\${sortId}">
    ${openShiJingTanSi ? "" : tip}
    <div class="component-edit-cell">
      <p class="component-edit-cell-title">展示样式</p>
      <div class="component-edit-cell-body clearfix">
        <label class="radio-inline one-half left">
          <input type="radio" name="edit-house-display-type-\${id}" data-edit-com-house-display-type="\${id}" value="1" {@if subType !== 2}checked{@/if}> 列表展示
        </label>
        <label class="radio-inline one-half mgl0 left">
          <input type="radio" name="edit-house-display-type-\${id}" data-edit-com-house-display-type="\${id}" value="2" {@if subType === 2}checked{@/if}> 卡片展示
        </label>
      </div>
    </div>
    <div class="component-edit-cell">
      <p class="component-edit-cell-title">组件标题（最多 10 字）</p>
      <input type="text" class="form-control" maxlength="10" placeholder="请填写标题" data-edit-com-house-title="\${id}" value="\${title}">
    </div>
    <div class="component-edit-cell">
      <p class="component-edit-cell-title">殿堂列表</p>
      <div class="component-edit-cell-body clearfix" data-edit-com-house-body="\${id}">${editComponents}</div>
    </div>
    <div class="mgt10">
      <button class="clean-button c-btn-1 c-btn-1-round pdl15 pdr15" data-edit-com-house-add="\${id}">添加殿堂</button>
    </div>
    <div class="mg-t-20 t-a-center">
      <button class="btn btn-success" data-action="save-component" data-id="\${id}" data-type="7">保存</button>
    </div>
  </div>
  `,
  editComponents,
  coverRow: `
  <li data-edit-pop-house-cover-row="0">
    <img class="item-image" src="\${image}" data-edit-pop-house-cover-row-image="0">
    <button class="clean-button upload-remove" data-edit-pop-house-cover-row-del="0">×</button>
  </li>
  `
};
var compiledTpl = {};
Object.keys(tpl).map(function (key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
