/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'common/function', './data', './tpl', './ajax'], function(
  $,
  commonFunc,
  data,
  tpl
) {
  var $contentBody = $('#content-body');

  var func = {};

  func.init = function() {
    func.requestList();
  };

  // 请求列表
  func.requestList = function() {
    $.seeAjax.get('list', {}, function(res) {
      if (res.success) {
        res.data.map(function(item) {
          $contentBody.append(tpl.unit.render(item));
        });
      }
    });
  };

  return func;
});
