/**
 * Created by kang on 2017/10/23.
 */

define([
  'jquery',
  'common/function',
  './data',
  './tpl',
  'clipboard',
  './ajax',
  'bootstrap-select',
], function($, commonFunc, data, tpl, Clipboard) {
  var func = {};
  func.init = function() {
    $('#loading-toast').addClass('hide');
    new Clipboard('.copy-link');
    $('.select-picker').selectpicker('refresh');
    func.getTempleSet({}, function(res) {
      func.renderTempleSet(res);
    });
  };
  // 奖励设置
  func.getTempleSet = function(params, callback) {
    $.seeAjax.get('getTempleSet', params, function(res) {
      // 存储返回的数据
      if (res.success) {
        data.templeSetRes = res;
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  func.renderTempleSet = function(res) {
    // 推广设置
    $('#wx-link').val(res.url);
    $('#qrcode-container').qrcode({
      width: 500,
      height: 500,
      text: res.url,
    });
    // 奖励设置
    res.giftList.map(function(item) {
      $('[data-input-day-type=' + item.type + ']').val(item.content);
      $('[data-select-day-type=' + item.type + ']')
        .val(item.formType)
        .selectpicker('refresh');
    });
    // 免费香设置
    if (typeof res.freeNumber !== 'undefined' && res.freeNumber !== -1) {
      $('#free-incense-limit').prop('checked', true);
      $('#limit-num').val(res.freeNumber);
    } else {
      $('#free-incense-not-limit').prop('checked', true);
    }
    // 音乐列表
    func.renderMusicList(res.musicList);
  };
  // 渲染音乐列表
  func.renderMusicList = function(data) {
    var $container = $('#music-list-container'),
      htmlStr = '';
    data.map(function(item) {
      htmlStr += tpl.musicCell.render(item);
    });
    $container.html(htmlStr);
  };
  // 更新寺院设置
  func.updateTempleSet = function(params, callback) {
    $.seeAjax.post(
      'updateTempleSet',
      params,
      function(res) {
        params.giftList = JSON.stringify(params.giftList);
        if (res.success) {
          params.giftList = JSON.parse(params.giftList);
          callback && callback(res);
        } else {
          res.message && commonFunc.alert(res.message);
        }
      },
      true
    );
  };
  return func;
});
