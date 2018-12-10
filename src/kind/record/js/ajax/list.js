/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');
let zzhUtil = require('@zzh/util');

let requestKeys = {
    page: 'pageNum',
    startDate: 'startTime',
    endDate: 'endTime'
};

let responseRefactor = {
    data: [
        {
            name: 'nickName',
            avatar: 'headImg',
            money: 'price',
            time: 'addTime'
        }
    ]
};

let preHandle = req => {
    req.charityId = zzhUtil.urlParams.id;
    req.pageNum -= 1;
    req.pageSize = 20;
};

let postHandle = res => {
    res.totalPages = Math.ceil((res.total || 0) / 20);
};

seeAjax.config('list', {
    url: [
        '/zzhadmin/charityOrderList/',
        '/src/kind/record/data/list_server.json',
        '/src/kind/record/data/list.json'
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
