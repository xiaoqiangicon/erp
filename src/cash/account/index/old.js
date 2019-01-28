/**
 * Created by senntyou on 2016/12/5.
 */
define(['jquery', 'common/variables'], function($, commonVars) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  // 审核不通过，重新编辑
  if (parseInt(commonVars.params.edit)) {
    $('[data-next-link]').map(function() {
      var $this = $(this);
      $this.attr({ href: $this.attr('href') + '&edit=1' });
    });
  }
});
