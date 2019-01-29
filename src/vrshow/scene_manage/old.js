/**
 * Created by kang on 2017/11/20.
 * 场景管理
 */

define([
  'jquery',
  './scene_manage/function',
  './scene_manage/view',
  'component/navigation',
], function($, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  func.init();
});
