/**
 * @author senntyou <jiangjinbelief@163.com>
 */

let seeAjax = require('see-ajax');
let zzhUtil = require('@zzh/util');

let responseRefactor = {
    todayTotalMoney: 'data.todayPrice',
    todayTotalPeople: 'data.todayJoinNum',
    totalMoney: 'data.totalPrice',
    totalPeople: 'data.joinNum'
};

let preHandle = req => {
    req.charityId = zzhUtil.urlParams.id;
};

seeAjax.config('main', {
    url: [
        '/zzhadmin/charityTotalInfo/',
        '/src/kind/record/data/main_server.json',
        '/src/kind/record/data/main.json'
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