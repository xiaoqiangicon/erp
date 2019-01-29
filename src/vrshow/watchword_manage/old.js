/**
 * Created by kang on 2017/10/19.
 * 实景礼佛-法语设置
 */

define([
  'jquery',
  './watchword_manage/function',
  './watchword_manage/view',
  'component/navigation',
], function($, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  func.init();
});
