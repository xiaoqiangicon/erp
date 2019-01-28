/**
 * Created by senntyou on 2016/12/5.
 */
define(['jquery', './func', './view'], function($, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  func.init();
});
