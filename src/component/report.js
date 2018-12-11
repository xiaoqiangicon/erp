// 去掉接口错误监听，因为如果 /log/web 本身就报错的话，会死循环

const $ = require('jquery');
const env = require('../util/env');

// 只有正式机才上报错误
if (env.serverEnv === 3) {
  window.onerror = (
    errorMessage,
    scriptURI,
    lineNumber,
    columnNumber,
    errorObj
  ) => {
    const data = {
      type: 'scriptError',
      errorMessage,
      scriptURI,
      lineNumber,
      columnNumber,
      detailMessage: (errorObj && errorObj.message) || '',
      stack: (errorObj && errorObj.stack) || '',
      userAgent: window.navigator.userAgent,
      locationHref: window.location.href,
      cookie: window.document.cookie,
    };

    $.post(
      '/log/web',
      { title: $('title').html(), content: JSON.stringify(data) },
      console.log,
      'json'
    );
  };
}
