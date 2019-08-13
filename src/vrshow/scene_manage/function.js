import $ from 'jquery';
import commonFunc from 'common/function';
import data from './data';
import tpl from './tpl';
import './ajax';
import 'bootstrap-select';
var func = {};
func.init = function() {
  $('#loading-toast').addClass('hide');
  func.getSceneList(data.getSceneListParams, function(res) {
    func.renderSceneList(res);
  });
};
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
func.renderSceneList = function(res) {
  var $container = $('#summary-tbody'),
    htmlStr = '';
  res.data.map(function(item) {
    data.getSceneListData[item.sceneId] = item;
    htmlStr += tpl.summaryTableCell.render(item);
  });
  !htmlStr && (htmlStr = tpl.summaryTbodyEmpty.render({}));
  $container.html(htmlStr);
};
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
func.renderLinkList = function(res) {
  var $container = $('#link-tbody'),
    htmlStr = '';
  res.data.map(function(item) {
    htmlStr += tpl.linkTableCell.render(item);
  });
  !htmlStr && (htmlStr = tpl.linkTbodyEmpty.render({}));
  $container.html(htmlStr);
};
func.renderSceneSelect = function(res, $container) {
  var htmlStr = '';
  res.data.map(function(item) {
    htmlStr += tpl.sceneSelect.render(item);
  });
  $container.html(htmlStr);
  $container.selectpicker('refresh');
};
func.deleteScene = function(params, callback) {
  $.seeAjax.get('deleteScene', params, function(res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
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
func.deleteLink = function(params, callback) {
  $.seeAjax.get('deleteLink', params, function(res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
export default func;
