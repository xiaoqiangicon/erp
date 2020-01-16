let defaults = {
  url: '/zzhadmin/uploadPic/',
  imageUrl: void 0,
  fileUrl: void 0,
  option: void 0,
  imageOption: {
    dataType: 'json',
    paramName: 'file',
    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
    loadImageMaxFileSize: 100 * 1024 * 1024,
    imageMaxWidth: 1000,
    imageMaxHeight: 2000,
    disableImageResize: !1,
    messages: {
      acceptFileTypes: '请上传 jpg, png, gif 图片',
    },
  },
  fileOption: {
    dataType: 'json',
    paramName: 'file',
  },
  handle: res => {
    return res.url;
  },
  imageHandle: void 0,
  fileHandle: void 0,
  processFail: msg => {
    alert(msg);
  },
};
defaults.imageOption.processfail = (e, data) => {
  let currentFile = data.files[data.index];
  if (data.files.error && currentFile.error) {
    defaults.processFail(currentFile.error);
  }
};
export default defaults;
