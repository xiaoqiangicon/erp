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
    // 获取佛像列表
    $.seeAjax.get('shortBuddhaList', {}, function(res) {
      if (res.success && res.data && res.data.length) {
        var $containerPlace = $('[data-filter="place"]');
        var $containerBuddha = $('[data-filter="buddha"]');

        res.data.map(function(item) {
          data.placeData[item.name] = item.buddhaList || [];

          $containerPlace.append(
            tpl.option.render({ id: item.name, name: item.name })
          );
        });

        $('[data-filter-container="1"]').removeClass('hide');
      }
    });

    // 获取所有供奉类型
    $.seeAjax.get('buddhaList', {}, function(res) {
      if (res.success && res.data && res.data.length) {
        var $createPopupType = $('#create-popup-type');
        res.data.map(function(item) {
          $createPopupType.append(tpl.createTypeCell.render(item));
        });
      }
    });
    // 初始化请求列表
    func.requestList();
  };

  // 请求列表
  func.requestList = function() {
    // 清空容器
    $.seeAjax.get('list', data.filter, function(res) {
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
        data.listData[item.id] = item;
        htmlString += tpl.unit.render(item);
      });

    $contentBody.html(htmlString);
  };

  return func;
});
