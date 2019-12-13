import seeAjax from 'see-ajax';
import './ajax';
export default (url, successCallback, errorCallback) => {
  seeAjax(
    'storeImageSave',
    {
      url,
    },
    res => {
      if (!res || !res.url) errorCallback && errorCallback();
      else successCallback && successCallback(res.url);
    },
    _ => {
      errorCallback && errorCallback();
    }
  );
};
