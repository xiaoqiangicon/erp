/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');
let zzhUtil = require('@zzh/util');

let preHandleAdd = require('./pre_handle_add');

let requestKeys = {
    title: 'name',
    intro: 'details',
    payItems: 'spec',
    shareTitle: 'shareName',
    shareDesc: 'shareDetails',
    shareIcon: 'shareHeadImg',
    showPeopleCountWhenShare: 'isShowJoinNum'
};

let preHandle = req => {
    req.charityId = zzhUtil.urlParams.id;
    preHandleAdd(req);
};

seeAjax.config('edit', {
    method: [
        'post'
    ],
    url: [
        '/zzhadmin/charityEdit/',
        '/static/src/kind/edit/data/edit_server.json',
        '/static/src/kind/edit/data/edit.json'
    ],
    requestKeys: [
        requestKeys,
        requestKeys
    ],
    preHandle: [
        preHandle,
        preHandle,
        req => {req.id = zzhUtil.urlParams.id}
    ]
});
