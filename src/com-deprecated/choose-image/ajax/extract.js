import seeAjax from 'see-ajax';
let requestKeys = {
  file: 'picUrl',
};
let postHandle = res => {
  res.success = res.result >= 0;
  res.message = res.msg || '未知错误，请稍后重试';
};
seeAjax.config('zzhChooseImageExtract', {
  method: ['post'],
  url: [
    '/zzhadmin/uploadPic/',
    '/src/com-deprecated/choose-image/mock/extract_server.json',
    '/src/com-deprecated/choose-image/mock/extract.json',
  ],
  requestKeys: [requestKeys, requestKeys],
  postHandle: [postHandle, postHandle],
});
