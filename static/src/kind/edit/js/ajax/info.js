/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');

let requestKeys = {
    id: 'charityId'
};

let responseRefactor = {
    data: {
        title: 'name',
        intro: 'details',
        payItems: 'spec',
        _payItems: [
            {
                desc: 'benison',
                icon: 'indexImg'
            }
        ],
        shareTitle: 'shareName',
        shareDesc: 'shareDetails',
        shareIcon: 'shareHeadImg',
        showPeopleCountWhenShare: 'isShowJoinNum'
    }
};

let postHandle = res => {
    let covers = [];
    res.data.img && res.data.img.length && res.data.img.forEach(item => {
        covers.push(item.url);
    });
    res.data.covers = covers;
};

seeAjax.config('info', {
    url: [
        '/zzhadmin/charityGet/',
        '/static/src/kind/edit/data/info_server.json',
        '/static/src/kind/edit/data/info.json'
    ],
    requestKeys: [
        requestKeys,
        requestKeys
    ],
    responseRefactor: [
        responseRefactor,
        responseRefactor
    ],
    postHandle: [
        postHandle,
        postHandle
    ]
});
