define([
  'jquery',
  '../data',
  '../tpl/common',
  '../view/figure/util',
  'jquery-confirm',
], function($, indexData, commonTpl, util) {
  // 添加高僧法师组件后事件添加
  function postHandleForPersonSaying($displayComponent, $editContainer, data) {
    if (data.components)
      data.components.forEach(function(item) {
        // 替换 <br> 为 \n
        item.description = item.description.replace(/<br>/g, '\n');
      });

    $editContainer.find('[data-edit-com-figure-body]').sortable({
      stop: function(e) {
        util.afterSortable();
      },
    });
  }

  return postHandleForPersonSaying;
});
