/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');

let requestKeys = {
    id: 'charityId'
};

seeAjax.config('delete', {
    url: [
        '/zzhadmin/charityDel/',
        '/static/src/kind/index/data/delete_server.json',
        '/static/src/kind/index/data/delete.json'
    ],
    requestKeys: [
        requestKeys,
        requestKeys
    ]
});
