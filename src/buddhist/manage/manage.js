/**
 * Created by root on 2017/9/15.
 */

define([
  'jquery',
  './manage/function',
  './manage/view',
  'component/navigation',
], function($, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  func.init();
});
