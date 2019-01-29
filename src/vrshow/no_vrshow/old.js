/**
 * Created by kang on 2017/10/19.
 * 实景礼佛-应用介绍
 */

define([
  'jquery',
  './no_vrshow/function',
  './no_vrshow/view',
  'component/navigation',
], function($, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  func.init();
});
