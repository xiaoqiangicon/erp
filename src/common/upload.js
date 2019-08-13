import $ from 'jquery';
import commonFunc from './function';
import '../../old-com/jquery-file-upload/js/jquery.fileupload-image';
import '../../old-com/jquery-file-upload/js/jquery.fileupload-validate';
import 'lib/jquery.seeAjax';
var env;
var url;
var upload = function(el, option, done, progress) {
  if (typeof option == 'function') {
    progress = done;
    done = option;
    option = void 0;
  }
  var $el,
    elType = typeof el;
  if (elType == 'string') $el = $(el);
  else if (
    elType == 'object' &&
    el.nodeType == 1 &&
    typeof el.nodeName == 'string'
  )
    $el = $(el);
  else if (el instanceof $) $el = el;
  else
    throw new Error(
      'common/upload: 未知父容器；父容器必须是：selector选择器, dom对象, jquery对象'
    );
  if (typeof env == 'undefined') {
    env = $.seeAjax.getEnv();
    url = env === 0 ? '/zzhadmin/uploadPic/' : '/mock/upload_server.json';
  }
  var defaultOption = {
    url: url,
    dataType: 'json',
    paramName: 'file',
    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
    loadImageMaxFileSize: 100 * 1024 * 1024,
    imageMaxWidth: 1000,
    imageMaxHeight: 1000,
    disableImageResize: !1,
    messages: {
      acceptFileTypes: '请上传 jpg, png, gif 图片',
    },
    processfail: function(e, data) {
      var currentFile = data.files[data.index];
      if (data.files.error && currentFile.error) {
        commonFunc.dialog(currentFile.error);
      }
    },
    done: function(e, data) {
      done && done(data.result.url, e, data);
    },
    progressall: function(e, data) {
      progress && progress(e, data);
    },
  };
  if (option) $.extend(!0, defaultOption, option);
  $el.fileupload(defaultOption);
};
export default upload;
