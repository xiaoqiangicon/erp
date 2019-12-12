import $ from 'jquery';
import commonFunc from 'common/function';
import Toast from 'old/toast';
import data from './data';
import tpl from './tpl';
import func from './function';
import ChooseImage from '../../component/choose-image';
import './ajax';
import 'jquery-confirm';
import seeView from 'see-view';
seeView({
  events: {
    'click #back-nav': 'onClickBackNav',
    'beforeunload window': 'beforeUnLoad',
    'keyup [data-ele="textarea"]': 'onKeyupTextarea',
    'click [data-ele="add-img"]': 'onClickAddImg',
    'click [data-ele="delete-img"]': 'onClickDeleteImg',
    'click [data-ele="add-sound"]': 'onClickAddSound',
    'click [data-ele="delete-sound"]': 'onClickDeleteSound',
    'click #submit': 'onClickSubmit',
    'click #cancel': 'onClickCancel',
  },
  onClickBackNav: function(e) {
    e.preventDefault();
    window.history.back();
  },
  beforeUnLoad: function(e) {
    var confirmationMessage = '你确定离开吗?（未保存的修改将不生效）';
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  },
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
  onClickAddImg: function(e) {
    var upload = new ChooseImage({
      type: 1,
      multiUpload: true,
      multiSelect: true,
      fieldName: 'files',
      onSubmit: function(resData) {
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
  onClickAddSound: function(e) {
    var $inputFile = $('[data-ele="sound-input-file"]');
    $inputFile.click();
  },
  onClickDeleteSound: function(e) {
    var $addSoundContainer = $('[data-ele="add-sound-container"]'),
      $audioContainer = $('[data-ele="audio-container"]'),
      $audio = $('[data-ele="audio"]');
    data.updateSetParams.sound = '';
    $audio.prop('src', '');
    $audioContainer.hide();
    $addSoundContainer.show();
  },
  onClickSubmit: function(e) {
    var $scene = $('#scene'),
      $summary = $('#summary'),
      $audio = $('[data-ele="audio"]'),
      sceneId = parseInt($scene.val()),
      summary = $summary.val(),
      pic = '',
      newArr = [],
      sound = $audio.attr('src');
    data.imgData.map(function(item) {
      newArr.push(item.src);
    });
    pic = newArr.toString();
    if (isNaN(sceneId)) {
      Toast('请选择场景', 0, 3000, false);
      return false;
    }
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
  onClickCancel: function(e) {
    commonFunc.confirm('未保存内容，要离开本页面吗？', function() {
      window.location.href = '/zzhadmin/vr_scene/';
    });
  },
});
