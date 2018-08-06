/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const $ = require('jquery');
require('jquery-confirm');
require('jquery-confirm/dist/jquery-confirm.min.css');

/**
 * alert
 *
 * @param content 内容
 * @param callback 确定回调函数
 */
module.exports = (content, callback) => {
  $.alert({
    title: !1,
    content: content || '未知错误\uFF0C请重新尝试',
    buttons: {
      ok: {
        text: '确定',
        action: () => {
          if (callback) callback();
        },
      },
    },
    theme: 'white',
  });
};
