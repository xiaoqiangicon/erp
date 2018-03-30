/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');
let zzhUtil = require('@zzh/util');

let responseRefactor = {
    todayTotalMoney: 'data.todayPrice',
    todayTotalPeople: 'data.todayJoinNum',
    totalMoney: 'data.totalPrice',
    totalPeople: 'data.todayJoinNum'
};

let preHandle = req => {
    req.charityId = zzhUtil.urlParams.id;
};

seeAjax.config('main', {
    url: [
        '/zzhadmin/charityTotalInfo/',
        '/static/src/kind/record/data/main_server.json',
        '/static/src/kind/record/data/main.json'
    ],
    responseRefactor: [
        responseRefactor,
        responseRefactor
    ],
    preHandle: [
        preHandle,
        preHandle
    ]
});