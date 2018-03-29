/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');

seeAjax.config('add', {
    method: [
        'post',
        'post',
        'post'
    ],
    url: [
        '',
        '',
        '/static/src/kind/edit/data/add.json'
    ]
});
