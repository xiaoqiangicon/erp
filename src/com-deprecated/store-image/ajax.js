import seeAjax from 'see-ajax';
import data from './data';
let implement = (cb, reqData) => {
  cb({
    url:
      '______new_image______' +
      reqData.url.slice(1, -1) +
      '______new_image______',
  });
};
seeAjax.config('storeImageSave', {
  settings: [
    {
      timeout: data.requestTimeOut,
    },
  ],
  method: ['post'],
  url: ['/upload/uploadByUrl'],
  implement: [void 0, implement, implement, implement, implement],
});
