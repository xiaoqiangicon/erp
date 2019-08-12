import $ from "jquery";
import cookie from "js-cookie";
export default items => {
  const idsMap = {};
  const subIdsMap = {};
  items.map(item => {
    if (idsMap[item.id]) throw new Error(`component/nav: id(${item.id}) 重复`);
    idsMap[item.id] = !0;
    const $menuItem = $(`[data-menu-item-id="${item.id}"]`);
    let showMenuItem = !1;
    const type2ElsQueue = [];
    let type1ShowCount = 0;
    item.subItems.map(subItem => {
      if (subIdsMap[subItem.id]) throw new Error(`component/nav: sub-id(${subItem.id}) 重复`);
      subIdsMap[subItem.id] = !0;
      const $subItemParent = $(`[data-menu-sub-item-id="${subItem.id}"]`).parent();
      if (!subItem.control) {
        showMenuItem = !0;
        $subItemParent.removeClass("hide");
      } else {
        if (subItem.controlType === 2) {
          showMenuItem = !0;
          type2ElsQueue.push($subItemParent);
        } else {
          if (subItem.controlMark && parseInt(cookie.get(subItem.controlMark))) {
            showMenuItem = !0;
            type1ShowCount += 1;
            $subItemParent.removeClass("hide");
          }
        }
      }
    });
    if (!type1ShowCount) type2ElsQueue.map($el => {
      $el.removeClass("hide");
    });
    if (showMenuItem) $menuItem.removeClass("hide"); else $menuItem.remove();
  });
};
