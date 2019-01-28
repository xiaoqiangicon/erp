/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'common/function',
  'common/tpl',
  './data',
  './tpl',
  './ajax',
], function($, _, commonFunc, commonTpl, data, tpl) {
  var func = {};

  var $contentBody = $('#content-body');

  // 初始化操作
  func.init = function() {
    // 初始化请求列表
    func.requestList();
  };

  // 请求列表
  func.requestList = function() {
    // 清空容器
    $.seeAjax.get('list', {}, function(res) {
      if (res.success) {
        func.renderList(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 渲染列表
  func.renderList = function(res) {
    var htmlString = '';
    res.data &&
      res.data.length &&
      res.data.map(function(item) {
        htmlString += tpl.unit.render(item);
      });

    $contentBody.html(htmlString);
  };

  return func;
});
