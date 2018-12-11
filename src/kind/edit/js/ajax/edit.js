/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const seeAjax = require('see-ajax').default;
const zzhUtil = require('@zzh/util');

const preHandleAdd = require('./pre_handle_add');

const requestKeys = {
  title: 'name',
  intro: 'details',
  payItems: 'specs',
  shareTitle: 'shareName',
  shareDesc: 'shareDetails',
  shareIcon: 'shareHeadImg',
  showPeopleCountWhenShare: 'isShowJoinNum',
};

const preHandle = req => {
  req.charityId = zzhUtil.urlParams.id;
  preHandleAdd(req);
};

seeAjax.config('edit', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/charityEdit/',
    '/src/kind/edit/data/edit_server.json',
    '/src/kind/edit/data/edit.json',
  ],
  requestKeys: [requestKeys, requestKeys],
  preHandle: [
    preHandle,
    preHandle,
    req => {
      req.id = zzhUtil.urlParams.id;
    },
  ],
});
