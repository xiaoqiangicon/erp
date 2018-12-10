/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const seeAjax = require('see-ajax').default;

const preHandle = require('./pre_handle_add');

const requestKeys = {
  title: 'name',
  intro: 'details',
  payItems: 'specs',
  shareTitle: 'shareName',
  shareDesc: 'shareDetails',
  shareIcon: 'shareHeadImg',
  showPeopleCountWhenShare: 'isShowJoinNum',
};

seeAjax.config('add', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/charityCreate/',
    '/src/kind/edit/data/add_server.json',
    '/src/kind/edit/data/add.json',
  ],
  requestKeys: [requestKeys, requestKeys],
  preHandle: [preHandle, preHandle],
});
