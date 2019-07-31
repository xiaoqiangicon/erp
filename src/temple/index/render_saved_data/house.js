define([
  'jquery',
  '../data',
  '../tpl/common',
  '../view/house/util',
  'jquery-confirm',
], function($, indexData, commonTpl, util) {
  // 添加殿堂场景组件后事件添加
  function postHandleForHouse($displayComponent, $editContainer, data) {
    if (data.houses)
      data.houses.forEach(function(house) {
        // 替换 <br> 为 \n
        house.intro = house.intro.replace(/<br>/g, '\n');
      });

    $editContainer.find('[data-edit-com-house-body]').sortable({
      stop: function(e) {
        util.afterSortable();
      },
    });
  }

  return postHandleForHouse;
});
