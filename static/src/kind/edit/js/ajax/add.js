/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');

let preHandle = require('./pre_handle_add');

let requestKeys = {
    title: 'name',
    intro: 'details',
    payItems: 'spec',
    shareTitle: 'shareName',
    shareDesc: 'shareDetails',
    shareIcon: 'shareHeadImg',
    showPeopleCountWhenShare: 'isShowJoinNum'
};

seeAjax.config('add', {
    method: [
        'post'
    ],
    url: [
        '/zzhadmin/charityCreate/',
        '/static/src/kind/edit/data/add_server.json',
        '/static/src/kind/edit/data/add.json'
    ],
    requestKeys: [
        requestKeys,
        requestKeys
    ],
    preHandle: [
        preHandle,
        preHandle
    ]
});
