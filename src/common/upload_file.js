/**
 * 通用上传便捷函数（普通文件）
 *
 * js: define(['common/upload_file', function(uploadFile) {
 *     uploadFile(el, done);
 *     uploadFile(el, done, progress);
 *     uploadFile(el, option, done);
 *     uploadFile(el, option, done, progress);
 *         el: selector选择器, dom对象, jquery对象
 *         option: {} // 自定义配置, 参考：https://github.com/blueimp/jQuery-File-Upload/wiki/Options
 *         done: function(url, e, data){} // 上传成功的回调函数
 *             url: 返回的图片URL
 *             e, data: 请参考：https://github.com/blueimp/jQuery-File-Upload/wiki/Options[done]
 *         progress: function(e, data){} // 上传进度变化的回调函数
 *             参数请参考：https://github.com/blueimp/jQuery-File-Upload/wiki/Options[progressall]
 * }]);
 *
 * Created by senntyou on 2017/9/21.
 */

define([
  'jquery',
  './function',
  '../../old-com/jquery-file-upload/js/jquery.fileupload',
  'lib/jquery.seeAjax',
], function($, commonFunc) {
  var env;
  var url;

  var upload = function(el, option, done, progress) {
    // (el. done, progress)
    if (typeof option == 'function') {
      progress = done;
      done = option;
      option = void 0;
    }

    var $el,
      elType = typeof el;
    // selector
    if (elType == 'string') $el = $(el);
    // dom
    else if (
      elType == 'object' &&
      el.nodeType == 1 &&
      typeof el.nodeName == 'string'
    )
      $el = $(el);
    else if (el instanceof $) $el = el;
    else
      throw new Error(
        'common/upload_file: 未知父容器；父容器必须是：selector选择器, dom对象, jquery对象'
      );

    if (typeof env == 'undefined') {
      env = $.seeAjax.getEnv();
      url = env === 0 ? '/zzhadmin/uploadPic/' : '/mock/upload_server.json';
    }

    var defaultOption = {
      url: url,
      dataType: 'json',
      paramName: 'file',
      processfail: function(e, data) {
        var currentFile = data.files[data.index];
        if (data.files.error && currentFile.error) {
          commonFunc.dialog(currentFile.error);
        }
      },
      //完成
      done: function(e, data) {
        done && done(data.result.url, e, data);
      },

      // 更新进度条
      progressall: function(e, data) {
        progress && progress(e, data);
      },
    };

    if (option) $.extend(!0, defaultOption, option);

    // 上传图片
    $el.fileupload(defaultOption);
  };

  return upload;
});
