import seeAjax from 'see-ajax';
let requestKeys = {
  ids: 'picIdList',
};
let postHandle = res => {
  res.success = res.result >= 0;
  res.message = res.msg || '未知错误，请稍后重试';
};
seeAjax.config('zzhChooseImageDelete', {
  method: ['post'],
  url: [
    '/zzhadmin/materialPicDel/',
    '/src/com-deprecated/choose-image/mock/delete_server.json',
    '/src/com-deprecated/choose-image/mock/delete.json',
  ],
  requestKeys: [requestKeys, requestKeys],
  postHandle: [postHandle, postHandle],
});
