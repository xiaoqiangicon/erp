/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const $ = require('jquery');
require('jquery-confirm');
require('jquery-confirm/dist/jquery-confirm.min.css');

/**
 * alert
 *
 * @param title 标题
 * @param content 内容
 */
module.exports = (title, content) => {
    if (!content) {
        content = title;
        title = '提示';
    }
    $.dialog({
        title: title,
        content: content
    });
};
