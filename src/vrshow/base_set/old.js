/**
 * Created by kang on 2017/10/19.
 * 实景礼佛基础设置
 */

define(['jquery', './function', './view'], function($, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  func.init();
});
