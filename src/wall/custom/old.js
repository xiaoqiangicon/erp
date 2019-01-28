/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', './function', './view'], function($, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  func.init();
});
