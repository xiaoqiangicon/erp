const dialog = require('util/dialog');

window.importWxArticleEmptyHandle = msg => {
  dialog(msg);
};

// 本地测试环境
if (location.hostname === 'localhost') {
  window.importWxArticleGetArticle = (url, callback) => {
    callback(
      `<div style="color: green;">啦啦啦啦啦啦啦啦啦<br>啦啦啦啦啦啦啦啦啦</div>`
    );
  };
}
