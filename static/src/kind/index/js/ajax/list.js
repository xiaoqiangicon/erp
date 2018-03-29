/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');

let requestKeys = {
    page: 'pageNum'
};

let responseRefactor = {
    data: [
        {
            title: 'name',
            totalMoney: 'totalPrice',
            totalPeople: 'joinNum'
        }
    ]
};

let preHandle = req => {
    req.pageNum -= 1;
    req.pageSize = 20;
};

let postHandle = res => {
    res.totalPages = Math.ceil((res.total || 0) / 20);
};

seeAjax.config('list', {
    url: [
        '/zzhadmin/charityList',
        '/static/src/kind/index/data/list_server.json',
        '/static/src/kind/index/data/list.json'
    ],
    requestKeys: [
        requestKeys,
        requestKeys
    ],
    responseRefactor: [
        responseRefactor,
        responseRefactor
    ],
    preHandle: [
        preHandle,
        preHandle
    ],
    postHandle: [
        postHandle,
        postHandle
    ]
});
