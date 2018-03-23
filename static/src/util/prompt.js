/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const $ = require('jquery');
require('jquery-confirm');
require('jquery-confirm/dist/jquery-confirm.min.css');

let alert = require('./alert');

/**
 * prompt
 *
 * @param title 标题
 * @param callback 确定回调函数
 */
module.exports = (title, callback) => {
    // 只有一个参数，且是回调函数
    if (typeof title === 'function') {
        callback = title;
        title = !1;
    }
    $.confirm({
        title: title,
        content: '' +
        '<div class="form-group">' +
        '<label>请输入</label>' +
        '<input type="text" class="form-control">' +
        '</div>',
        buttons: {
            formSubmit: {
                text: '确定',
                action: function () {
                    let value = this.$content.find('input').val();
                    if(!value){
                        alert('输入不能为空，请重新输入');
                        return !1;
                    }
                    callback(value);
                }
            },
            cancel: {
                text: '取消'
            }
        },
        theme: 'white'
    });
};
