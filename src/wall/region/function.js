import $ from 'jquery';
import _ from 'underscore';
import commonFunc from 'common/function';
import commonTpl from 'common/tpl';
import data from './data';
import tpl from './tpl';
import './ajax';
var func = {};
var $contentBody = $('#content-body');
func.init = function() {
  $.seeAjax.get('shortBuddhaList', {}, function(res) {
    if (res.success && res.data && res.data.length) {
      var $containerPlace = $('[data-filter="place"]');
      var $containerBuddha = $('[data-filter="buddha"]');
      res.data.map(function(item) {
        data.placeData[item.name] = item.buddhaList || [];
        $containerPlace.append(
          tpl.option.render({
            id: item.name,
            name: item.name,
          })
        );
      });
      $('[data-filter-container="1"]').removeClass('hide');
    }
  });
  $.seeAjax.get('buddhaList', {}, function(res) {
    if (res.success && res.data && res.data.length) {
      var $createPopupType = $('#create-popup-type');
      res.data.map(function(item) {
        $createPopupType.append(tpl.createTypeCell.render(item));
      });
    }
  });
  func.requestList();
};
func.requestList = function() {
  $.seeAjax.get('list', data.filter, function(res) {
    if (res.success) {
      func.renderList(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
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
export default func;
