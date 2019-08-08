/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const seeAjax = require('see-ajax');
const zzhUtil = require('../../../../../old-com/util/src');

const responseRefactor = {
  todayTotalMoney: 'data.todayPrice',
  todayTotalPeople: 'data.todayJoinNum',
  totalMoney: 'data.totalPrice',
  totalPeople: 'data.joinNum',
};

const preHandle = req => {
  req.charityId = zzhUtil.urlParams.id;
};

seeAjax.config('main', {
  url: [
    '/zzhadmin/charityTotalInfo/',
    '/src/kind/record/data/main_server.json',
    '/src/kind/record/data/main.json',
  ],
  responseRefactor: [responseRefactor, responseRefactor],
  preHandle: [preHandle, preHandle],
});
