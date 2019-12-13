import './css/index.css';
import $ from 'jquery';
import '../../../pro-com/src/jquery-file-upload/js/jquery.fileupload-image';
import '../../../pro-com/src/jquery-file-upload/js/jquery.fileupload-validate';
import defaults from './defaults';
import tpl from './tpl';
export default (container, done, progress, option) => {
  if (typeof progress !== 'function') {
    option = progress;
    progress = void 0;
  }
  !option && (option = {});
  let htmlTpl = option.multiple ? tpl.multiple : tpl.single;
  let $el = $(container);
  let typeFile = option.type === 'file';
  let customComponentOption = option.componentOption || {};
  let defaultComponentOption = typeFile
    ? window.zzhUploadFileOption ||
      window.zzhUploadOption ||
      defaults.fileOption ||
      defaults.option
    : window.zzhUploadImageOption ||
      window.zzhUploadOption ||
      defaults.imageOption ||
      defaults.option;
  let url = typeFile
    ? window.zzhUploadFileUrl ||
      window.zzhUploadUrl ||
      defaults.fileUrl ||
      defaults.url
    : window.zzhUploadImageUrl ||
      window.zzhUploadUrl ||
      defaults.imageUrl ||
      defaults.url;
  let handle = typeFile
    ? window.zzhUploadFileHandle ||
      window.zzhUploadHandle ||
      defaults.fileHandle ||
      defaults.handle
    : window.zzhUploadImageHandle ||
      window.zzhUploadHandle ||
      defaults.imageHandle ||
      defaults.handle;
  if (window.zzhUploadProcessFail) {
    defaults.processFail = window.zzhUploadProcessFail;
  }
  let currentOption = $.extend(
    !0,
    {},
    defaultComponentOption,
    customComponentOption
  );
  currentOption.url = url;
  currentOption.done = (e, data) => {
    done && done(handle(data.result), e, data);
  };
  currentOption.progressall = (e, data) => {
    progress && progress(e, data);
  };
  $el.append(htmlTpl);
  $el.find('[data-zzh-upload]').fileupload(currentOption);
};
