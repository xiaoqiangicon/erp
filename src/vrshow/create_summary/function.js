/**
 * Created by kang on 2017/11/21.
 * 添加/编辑简介
 */

define([
  'jquery',
  'old/toast',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  'common/upload_file',
  './ajax',
  'bootstrap-select',
], function($, Toast, commonFunc, commonVars, data, tpl, uploadFile) {
  var func = {};
  func.init = function() {
    $('#loading-toast').addClass('hide');
    var $navBarTitle = $('[data-ele="nav-bar-title"]'),
      id = commonVars.params.id;
    // 绑定上传音频
    uploadFile(
      $('[data-ele="sound-input-file"]'),
      {
        maxFileSize: 1 * 1024 * 1024,
        messages: { maxFileSize: '请上传大小不超过1M的音频' },
      },
      function(url) {
        // done
        var $addSound = $('[data-ele="add-sound"]'),
          $addSoundContainer = $('[data-ele="add-sound-container"]'),
          $audioContainer = $('[data-ele="audio-container"]'),
          $audio = $('[data-ele="audio"]'),
          $submit = $('#submit');
        $addSound.removeClass('background-loading');
        Toast('上传成功', 1, 2000, false);
        $audio.prop('src', url);
        $addSoundContainer.hide();
        $audioContainer.show();
        $submit.prop('disabled', false);
      },
      function(e, data) {
        // progress
        var $addSound = $('[data-ele="add-sound"]'),
          $submit = $('#submit');
        $addSound.addClass('background-loading');
        $submit.prop('disabled', true);
      }
    );

    // 获取链接参数
    if (typeof id !== 'undefined') {
      // 存在id
      data.getSceneParams.type = 2;
      // 渲染场景下拉菜单
      func.getSceneSet({ sceneId: id }, function(res) {
        func.renderOneSceneSelect(res.data);
        $navBarTitle.html('编辑简介');
        func.renderSet(res.data);
      });
    } else {
      data.getSceneParams.type = 3;
      // 渲染场景下拉菜单
      func.getScene(data.getSceneParams, function(res) {
        func.renderSceneSelect(res);
      });
    }
  };

  // 请求场景列表/
  func.getScene = function(params, callback) {
    $.seeAjax.get('getScene', params, function(res) {
      if (res.success) {
        res.data.map(function(item) {
          data.getSceneData[item.sceneId] = item;
        });
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 渲染场景下拉菜单
  func.renderSceneSelect = function(res) {
    var $container = $('#scene'),
      htmlStr = '';
    if (res.data.length) {
      res.data.map(function(item) {
        htmlStr += tpl.sceneSelect.render(item);
      });
    } else {
      htmlStr = '<option>暂无可选场景</option>>';
    }
    $container.html(htmlStr);
    $container.selectpicker('refresh');
  };
  // 渲染位移场景下拉菜单
  func.renderOneSceneSelect = function(d) {
    var $container = $('#scene'),
      htmlStr = '';
    htmlStr = tpl.sceneSelect.render({
      sceneId: d.sceneId,
      sceneName: d.sceneName,
    });
    $container.html(htmlStr);
    $container.selectpicker('refresh');
  };
  // 获取设置
  func.getSceneSet = function(params, callback) {
    $.seeAjax.get('getSceneSet', params, function(res) {
      if (res.success) {
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 渲染设置
  func.renderSet = function(d) {
    // 场景简介图片音频
    var $scene = $('#scene'),
      $summary = $('#summary'),
      $numTip = $summary.next(),
      number = d.summary.length,
      total = parseInt($numTip.html().match(/\/(\d+)/)[1]),
      $imgContainer = $('[data-ele="img-container"]'),
      $imgCellContainer = $('[data-ele="img-cell-container"]'),
      $addImg = $('[data-ele="add-img"]'),
      $addSoundContainer = $('[data-ele="add-sound-container"]'),
      $audioContainer = $('[data-ele="audio-container"]'),
      $audio = $('[data-ele="audio"]');
    // 下拉菜单
    $scene.prop('disabled', true);
    $scene.val(d.sceneId).selectpicker('refresh');
    // 简介 一定有简介 改变数字的颜色
    $summary.html(d.summary);
    $summary.next().addClass('color-dd524d');
    $numTip.html(number + '/' + total);
    // 图片
    if (!!d.pic) {
      var newAry = [],
        htmlStr = '';
      newAry = d.pic.split(',');
      newAry.map(function(item) {
        data.imgData.push({ src: item });
        htmlStr += tpl.imgCell.render({ src: item });
      });
      $imgContainer.addClass('has-img');
      $imgCellContainer.html(htmlStr);
      if (data.imgData.length === 5) {
        $addImg.hide();
      }
    }
    // 语音
    if (!!d.sound) {
      $addSoundContainer.hide();
      $audio.prop('src', d.sound);
      $audioContainer.show();
    }
  };
  // 更新设置
  func.updateSet = function(params, callback) {
    $.seeAjax.post('updateSet', params, function(res) {
      if (res.success) {
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  return func;
});
