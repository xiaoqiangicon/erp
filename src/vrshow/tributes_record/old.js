/**
 * Created by kang on 2017/10/25.
 * 实景礼佛-供奉记录
 */

define(['jquery', './function', './view'], function($, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  func.init();
});
