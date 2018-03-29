/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');
let zzhUtil = require('@zzh/util');

let preHandle = req => {
    req.id = zzhUtil.urlParams.id;
};

seeAjax.config('edit', {
    method: [
        'post',
        'post',
        'post'
    ],
    url: [
        '',
        '',
        '/static/src/kind/edit/data/edit.json'
    ],
    preHandle: [
        preHandle,
        preHandle,
        preHandle
    ]
});
