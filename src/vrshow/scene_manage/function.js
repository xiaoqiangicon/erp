/**
 * Created by kang on 2017/11/20.
 */

define([
  'jquery',
  'common/function',
  './data',
  './tpl',
  './ajax',
  'bootstrap-select',
], function($, commonFunc, data, tpl) {
  var func = {};
  func.init = function() {
    $('#loading-toast').addClass('hide');
    func.getSceneList(data.getSceneListParams, function(res) {
      func.renderSceneList(res);
    });
  };

  // 请求简介列表
  func.getSceneList = function(params, callback) {
    $.seeAjax.get('getSceneList', params, function(res) {
      if (res.success) {
        data.getSceneListRes = res;
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 渲染简介列表
  func.renderSceneList = function(res) {
    var $container = $('#summary-tbody'),
      htmlStr = '';
    // 渲染数据
    res.data.map(function(item) {
      data.getSceneListData[item.sceneId] = item;
      htmlStr += tpl.summaryTableCell.render(item);
    });
    !htmlStr && (htmlStr = tpl.summaryTbodyEmpty.render({}));
    $container.html(htmlStr);
  };
  // 请求链接列表
  func.getLinkList = function(params, callback) {
    $.seeAjax.get('getLinkList', params, function(res) {
      if (res.success) {
        data.getLinkListRes = res;
        res.data.map(function(item) {
          data.getLinkListData[item.id] = item;
        });
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 渲染链接列表
  func.renderLinkList = function(res) {
    var $container = $('#link-tbody'),
      htmlStr = '';
    // 渲染数据
    res.data.map(function(item) {
      htmlStr += tpl.linkTableCell.render(item);
    });
    !htmlStr && (htmlStr = tpl.linkTbodyEmpty.render({}));
    $container.html(htmlStr);
  };
  // 渲染select
  func.renderSceneSelect = function(res, $container) {
    var htmlStr = '';
    res.data.map(function(item) {
      htmlStr += tpl.sceneSelect.render(item);
    });
    $container.html(htmlStr);
    $container.selectpicker('refresh');
  };
  // 删除简介
  func.deleteScene = function(params, callback) {
    $.seeAjax.get('deleteScene', params, function(res) {
      if (res.success) {
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 更新链接（添加/编辑）
  func.updateLink = function(params, callback) {
    $.seeAjax.post(
      'updateLink',
      params,
      function(res) {
        if (res.success) {
          callback && callback(res);
        } else {
          res.message && commonFunc.alert(res.message);
        }
      },
      true
    );
  };
  // 删除链接
  func.deleteLink = function(params, callback) {
    $.seeAjax.get('deleteLink', params, function(res) {
      if (res.success) {
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  return func;
});
