/**
 * Created by senntyou on 2017/7/18.
 */

define([
  'jquery',
  'toastr',
  'common/tpl',
  'common/function',
  './data',
  './tpl',
  './ajax',
], function($, toastr, commonTpl, commonFunc, data, tpl) {
  var $contentBody = $('#content-body');

  var func = {};

  // 请求当前所有的广告
  func.requestAds = function() {
    $contentBody.html(commonTpl.placeholder);
    $.seeAjax.get('detail', {}, function(res) {
      if (!res.success || !res.data || !res.data.length) return;

      // 内容
      var htmlStr = '';
      res.data.map(function(item) {
        htmlStr += tpl.row.render(item);
      });
      $contentBody.html(htmlStr);
    });
  };

  return func;
});
