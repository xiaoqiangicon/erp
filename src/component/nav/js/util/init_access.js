const $ = require('jquery');
const cookie = require('js-cookie');

module.exports = items => {
  // 重复报错
  const idsMap = {};

  const subIdsMap = {};

  items.map(item => {
    if (idsMap[item.id]) throw new Error(`component/nav: id(${item.id}) 重复`);
    idsMap[item.id] = !0;

    // 主菜单
    const $menuItem = $(`[data-menu-item-id="${item.id}"]`);
    // 这否显示这个主菜单
    let showMenuItem = !1;
    // 类型2元素队列
    const type2ElsQueue = [];
    // 类型1元素显示计数
    let type1ShowCount = 0;
    item.subItems.map(subItem => {
      if (subIdsMap[subItem.id])
        throw new Error(`component/nav: sub-id(${subItem.id}) 重复`);
      subIdsMap[subItem.id] = !0;

      const $subItemParent = $(
        `[data-menu-sub-item-id="${subItem.id}"]`
      ).parent();
      // 不受控制
      if (!subItem.control) {
        showMenuItem = !0;
        $subItemParent.removeClass('hide');
      } else {
        // 类型2，别人不显示，自己才显示
        if (subItem.controlType === 2) {
          showMenuItem = !0;
          type2ElsQueue.push($subItemParent);
        }
        // 类型1
        else {
          // 可以显示
          if (
            subItem.controlMark &&
            parseInt(cookie.get(subItem.controlMark))
          ) {
            showMenuItem = !0;
            type1ShowCount += 1;
            $subItemParent.removeClass('hide');
          }
        }
      }
    });
    // 显示类型2的菜单
    if (!type1ShowCount)
      type2ElsQueue.map($el => {
        $el.removeClass('hide');
      });

    // 显示主菜单
    if (showMenuItem) $menuItem.removeClass('hide');
    else $menuItem.remove();
  });
};
