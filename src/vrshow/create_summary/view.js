/**
 * Created by kang on 2017/11/21.
 * 添加/编辑简介
 */

define([
  'jquery',
  'common/function',
  'old/toast',
  './data',
  './tpl',
  './function',
  '@zzh/choose-image',
  './ajax',
  'jquery-confirm',
  'lib/jquery.seeView',
], function($, commonFunc, Toast, data, tpl, func, ChooseImage) {
  $.seeView({
    events: {
      // 返回上一级导航
      'click #back-nav': 'onClickBackNav',
      // 离开页面
      'beforeunload window': 'beforeUnLoad',
      // textarea 输入文本 修改字数提示
      'keyup [data-ele="textarea"]': 'onKeyupTextarea',
      // 添加图片
      'click [data-ele="add-img"]': 'onClickAddImg',
      // 删除图片
      'click [data-ele="delete-img"]': 'onClickDeleteImg',
      // 添加语音
      'click [data-ele="add-sound"]': 'onClickAddSound',
      // 删除语音
      'click [data-ele="delete-sound"]': 'onClickDeleteSound',
      // 保存页面设置
      'click #submit': 'onClickSubmit',
      // 点击取消
      'click #cancel': 'onClickCancel',
    },
    // 返回上一级导航
    onClickBackNav: function(e) {
      e.preventDefault();
      window.history.back();
    },
    // 离开页面
    beforeUnLoad: function(e) {
      var confirmationMessage = '你确定离开吗?（未保存的修改将不生效）';
      (e || window.event).returnValue = confirmationMessage; // Gecko and Trident
      return confirmationMessage;
    },
    // textarea 输入文本 修改字数提示
    onKeyupTextarea: function(e) {
      var $tar = $(e.target),
        $numTip = $tar.next(),
        total = parseInt($numTip.html().match(/\/(\d+)/)[1]),
        number = $tar.val().length;
      if (number) {
        $numTip.addClass('color-dd524d');
      } else {
        $numTip.removeClass('color-dd524d');
      }
      if (number === total) {
        Toast('简介不超过' + total + '个字', 0, 1000, false);
      }
      $numTip.html(number + '/' + total);
    },
    // 点击添加图片
    onClickAddImg: function(e) {
      var upload = new ChooseImage({
        type: 1, // 1: 图片, 2: 图标
        multiUpload: true, // 是否支持多张图片上传(多张图片会以数组的形式上传)
        multiSelect: true, // 是否多选，如果 type=2, 则默认为false
        fieldName: 'files', // 字段名，默认是file(单张图片上传)， files(多张图片)
        // 点击确定的回调函数，返回一个数组
        onSubmit: function(resData) {
          // resData:[{id src type:1自己上传2系统图片}]
          var $container = $('[data-ele="img-cell-container"]'),
            $imgContainer = $('[data-ele="img-container"]'),
            $addImg = $('[data-ele="add-img"]'),
            htmlStr = '';
          data.imgData = data.imgData.concat(resData);
          console.log(data.imgData);

          if (data.imgData.length > 5) {
            Toast('上传图片大于五张，已自动选取前五张上传', 2, 2000, false);
            data.imgData = data.imgData.slice(0, 5);
            $addImg.hide();
          } else if (data.imgData.length === 5) {
            $addImg.hide();
          } else {
            $addImg.show();
          }
          data.imgData.map(function(item) {
            htmlStr += tpl.imgCell.render(item);
          });
          $container.html(htmlStr);
          $imgContainer.addClass('has-img');
        },
      });
      upload.show();
    },
    // 点击删除图片
    onClickDeleteImg: function(e) {
      var $tar = $(e.target),
        $deleteImg = $('[data-ele="delete-img"]'),
        $imgContainer = $('[data-ele="img-container"]'),
        $addImg = $('[data-ele="add-img"]');
      $deleteImg.each(function(index, ele) {
        if (ele === $tar.get(0)) {
          data.imgData.splice(index, 1);
        }
      });
      $tar.parent().remove();
      if (data.imgData.length < 5) {
        $addImg.show();
      }
      if (data.imgData.length === 0) {
        $imgContainer.removeClass('has-img');
      } else {
        $imgContainer.addClass('has-img');
      }
    },
    // 点击添加语音
    onClickAddSound: function(e) {
      var $inputFile = $('[data-ele="sound-input-file"]');
      $inputFile.click();
    },
    // 删除语音
    onClickDeleteSound: function(e) {
      var $addSoundContainer = $('[data-ele="add-sound-container"]'),
        $audioContainer = $('[data-ele="audio-container"]'),
        $audio = $('[data-ele="audio"]');
      data.updateSetParams.sound = '';
      $audio.prop('src', '');
      $audioContainer.hide();
      $addSoundContainer.show();
    },
    // 保存页面设置
    onClickSubmit: function(e) {
      var $scene = $('#scene'),
        $summary = $('#summary'),
        $audio = $('[data-ele="audio"]'),
        sceneId = parseInt($scene.val()),
        summary = $summary.val(),
        pic = '',
        newArr = [],
        sound = $audio.attr('src');
      // 获取图片信息
      data.imgData.map(function(item) {
        newArr.push(item.src);
      });
      pic = newArr.toString();
      // 判断是否有sceneId 不存在场景时 $scene.val() 获取的是字符串 暂无可选场景
      if (isNaN(sceneId)) {
        Toast('请选择场景', 0, 3000, false);
        return false;
      }
      // 判断简介是否填写
      if (summary === '') {
        Toast('请填写简介', 0, 3000, false);
        return false;
      }
      data.updateSetParams.sceneId = sceneId;
      data.updateSetParams.summary = summary;
      data.updateSetParams.pic = pic;
      data.updateSetParams.sound = sound;
      func.updateSet(data.updateSetParams, function(res) {
        Toast('保存设置成功', 1, 1000, false);
        setTimeout(function() {
          window.location.href = '/zzhadmin/vr_scene/';
        }, 1000);
      });
    },
    // 点击取消
    onClickCancel: function(e) {
      commonFunc.confirm('未保存内容，要离开本页面吗？', function() {
        window.location.href = '/zzhadmin/vr_scene/';
      });
    },
  });
});
