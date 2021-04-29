import './preset';
import '../../component/nav';
import '../../css/common/index.css';

import 'jquery-confirm/dist/jquery-confirm.min.css';
import 'colors.css/css/colors.css';
import '@senntyou/shortcut.css';
import 'toastr/build/toastr.css';

import 'bootstrap-select/dist/css/bootstrap-select.css';
import 'bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
import '../../old/jquery-ui.css';
import '../../old/bootstrap-datetimepicker.css';
import '../../old/city-picker.css';

import './index.css';

import 'bootstrap-datepicker';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min.js';

import '../../component/ueditor_config';
import '../../../../pro-com/src/ueditor/ueditor.config';
import '../../../../pro-com/src/ueditor/ueditor.all';

import '../../component/ueditor_plugins/xiu_mi';
import '../../component/ueditor_plugins/import_wx_article';
import '../../component/ueditor_plugins/video';
import '../../component/ueditor_plugins/choose_image';
import '../../component/ueditor_plugins/choose_image_multi';

import '../../old/bootstrap-datetimepicker';
import '../../old/bootstrap-datetimepicker.zh-CN';

import upload from '../../../../pro-com/src/upload';
import './old';
import $ from 'jquery';
import Toast from 'old/toast';
import Const from './const';

upload({
  el: $('#coverVideo').get(0),
  uploadUrl: `${window.location.origin}/zzhadmin/uploadPic/`,
  done(res, e, data) {
    console.log(res.url, e, data, 'done');
    // 添加视频后隐藏上传视频按钮，出现视频缩略图

    $('#videoBox')
      .find('#video-loading')
      .remove();
    var videoHtml =
      '<div class="video-pic glyphicon" id="video-pic" data-url="' +
      res.url +
      '"><img class="video-small-pic" src="' +
      res.url +
      '?vframe/jpg/offset/1" alt="" /><span class="glyphicon-remove-circle delPic" style="vertical-align: top;cursor: pointer;" id="del-video"></span></div>';
    $('#videoBox').prepend(videoHtml);
    Const.isUploading = !1;
  },
  uploadHandle: res => {
    return res;
  },
  uploadOptions: {
    formData: {},
    add: (e, data) => {
      var fileName = data.files[0].name;
      var size = data.files[0].size;
      var limitSize = 50 * 1024 * 1024;
      console.log(size, data.files[0]);
      if (
        fileName.indexOf('mp4') < 0 &&
        fileName.indexOf('MP4') < 0 &&
        fileName.indexOf('MOV') < 0 &&
        fileName.indexOf('rmvb') < 0 &&
        fileName.indexOf('mov') < 0
      ) {
        Toast('请上传正确的视频格式', 2);

        return;
      }
      if (size > limitSize) {
        Toast('请上传不超过50M的文件', 2);
        return;
      }

      Const.isUploading = !0;
      $('#coverVideo').hide();

      // 添加视频后增加加载视频的ico
      var loadingHtml =
        '<div class="video-loading" id="video-loading"><img class="video-loading-pic" src="https://pic.zizaihome.com/454256ce-e1a3-4ab5-99ab-28042c02614f.gif" alt="" /></div>';
      $('#videoBox').prepend(loadingHtml);

      data.process().done(() => {
        data.submit();
      });
    },
    fail: (e, data) => {
      Const.isUploading = !1;
      $('#videoBox')
        .find('#video-loading')
        .remove();
      $('#coverVideo').show();
      Toast('上传视频失败', 2);
    },
  },
});
