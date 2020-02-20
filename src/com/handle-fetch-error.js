import { Notification } from 'element-ui';

export default function handleFetchError(res) {
  if (res.error) {
    const urlOrigin = res.response.url
      .split('?')[0]
      .split('#')[0]
      .replace('http://', '')
      .replace('https://', '');
    const urlPath = urlOrigin.slice(urlOrigin.indexOf('/'));
    Notification(
      `服务错误，请联系工作人员：url[${urlPath}], status[${res.response.status}], statusText[${res.response.statusText}]`
    );
  }
}
