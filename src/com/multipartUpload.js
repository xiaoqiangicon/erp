// 需要用到upload的组件
import '../../../pro-com/src/upload';

import $ from 'jquery';
import axios from 'axios';
import { reportError } from '@senntyou/web-monitor-sdk';

const makeTpl = () => `<input class="out-c-upload" type="file" name="file">`;

const defaultOptions = {
  dataType: 'json',
  paramName: 'file',
  maxChunkSize: 1024 * 1024, // 1M
};

// 上传初始化
const uploadInit = '/upload/multipart/init';
// 上传分片文件
const uploadUpload = '/upload/multipart/upload';
// 合成上传文件
const uploadComplete = '/upload/multipart/complete';

/**
 * 上传工具函数
 *
 * @param el 上传容器，selector或dom，且只能是一个 dom 节点，不能有多个
 *     1. 需要 position: relative/absolute/fixed 的容器
 *     2. 需要固定的宽和高
 *     3. 不能有 input 子元素
 * @param done 上传成功的回调函数, (url, e, data) => {}
 *     url: 返回的URL
 *     e, data: 请参考：https://github.com/blueimp/jQuery-File-Upload/wiki/Options[done]
 * @param progress 上传进度变化的回调函数, (e, data) => {}
 *     e, data: 请参考：https://github.com/blueimp/jQuery-File-Upload/wiki/Options[done]
 * @param uploadOptions jQuery-File-Upload 配置信息
 * @param uploadFail 上传失败的错误处理
 * @param beforeUpload 上传之前的校验（如果要停止上传，返回false），参数与原有的 `add` 方法一致
 *     （原有的add方法已用，请勿覆盖）
 */
export default ({
  el,
  done,
  progress,
  uploadOptions,
  uploadFail,
  beforeUpload,
}) => {
  const htmlTpl = makeTpl();
  const $el = $(el);

  const comOptions = uploadOptions || defaultOptions;

  const options = { ...comOptions };

  options.url = '/';

  options.add = function(e, data) {
    // 保留前置校验的功能，如果返回false，则停止上传
    if (beforeUpload && beforeUpload(e, data) === false) return;

    const d = new URLSearchParams();
    d.append('name', data.files[0].name);

    axios({
      url: uploadInit,
      method: 'post',
      responseType: 'json',
      data: d,
    })
      .then(({ data: res }) => {
        if (res.result > 0) {
          data.url = uploadUpload;
          data.formData = { mark: res.data.mark };

          data.submit();
        } else if (uploadFail)
          uploadFail(
            res.message || res.msg || '上传文件初始化失败，请重新尝试'
          );
      })
      .catch(error => {
        console.error(error);
        reportError(error);

        if (uploadFail) uploadFail(error.message || error.msg || error);
      });
  };

  options.done = function(e, data) {
    const d = new URLSearchParams();
    d.append('mark', data.formData.mark);

    axios({
      url: uploadComplete,
      method: 'post',
      responseType: 'json',
      data: d,
    })
      .then(({ data: res }) => {
        if (res.result > 0) {
          if (done) done(res.data.url, e, data);
        } else if (uploadFail)
          uploadFail(
            res.message || res.msg || '上传文件初始化失败，请重新尝试'
          );
      })
      .catch(error => {
        console.error(error);
        reportError(error);

        if (uploadFail) uploadFail(error.message || error.msg || error);
      });
  };

  options.progress = (e, data) => {
    if (progress) progress(e, data);
  };

  options.processfail = (e, data) => {
    if (!uploadFail) return;

    const currentFile = data.files[data.index];
    if (data.files.error && currentFile.error) {
      uploadFail(currentFile.error);
    }
  };

  $el.append(htmlTpl);

  // 上传图片
  $el.find('input').fileupload(options);

  // 修复PC浏览器拖动上传导致重复上传的问题
  // https://github.com/blueimp/jQuery-File-Upload/issues/3634
  $el.on('fileuploaddrop', e => {
    const container = $el[0];
    if (
      container !== e.delegatedEvent.target &&
      !$.contains(container, e.delegatedEvent.target)
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
};
