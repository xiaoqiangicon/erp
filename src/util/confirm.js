/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const $ = require('jquery');
require('jquery-confirm');
require('jquery-confirm/dist/jquery-confirm.min.css');

/**
 * confirm
 *
 * @param title 标题
 * @param content 内容
 * @param confirmCallback 确定回调
 * @param cancelCallback 取消回调
 */
module.exports = (title, content, confirmCallback, cancelCallback) => {
  /* eslint-disable no-param-reassign */
  if (typeof content === 'function') {
    cancelCallback = confirmCallback;
    confirmCallback = content;
    content = title;
    title = '';
  }
  $.confirm({
    title: title || !1,
    content,
    buttons: {
      confirm: {
        text: '确定',
        action: () => {
          if (confirmCallback) confirmCallback();
        },
      },
      cancel: {
        text: '取消',
        action: () => {
          if (cancelCallback) cancelCallback();
        },
      },
    },
  });
};
