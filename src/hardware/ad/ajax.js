import $ from 'jquery';
import commonVars from 'common/variables';
import data from './data';
import 'lib/jquery.seeAjax';
var typeTexts = ['自在家', '自定义', '佛事', '文章'];
var requestKeys = {
  switch: {
    id: 'adId',
    hide: 'status',
  },
};
var responseRefactor = {
  detail: {
    data: [
      {
        image: 'picUrl',
        hide: 'status',
        link: 'linkUrl',
      },
    ],
  },
};
var preHandle = {
  detail: function(req) {
    req.machineId = parseInt(commonVars.params.id);
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
  detail: function(res) {
    res.data &&
      res.data.length &&
      res.data.map(function(item) {
        item.typeText = typeTexts[item.type];
      });
  },
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    detail: 'detail',
    switch: 'switch',
  },
  url: {
    detail: [
      '/zzhadmin/merit_machine_ad_list/',
      '/src/hardware/ad/mock/detail_server.json',
      '/src/hardware/ad/mock/detail.json',
    ],
    switch: [
      '/zzhadmin/merit_machine_ad_status/',
      '/src/hardware/ad/mock/switch_server.json',
      '/src/hardware/ad/mock/switch.json',
    ],
  },
  requestKeys: {
    switch: [
      requestKeys.switch,
      requestKeys.switch,
      {
        id: 'id',
        hide: 'hide',
      },
    ],
  },
  responseRefactor: {
    detail: [responseRefactor.detail, responseRefactor.detail],
  },
  preHandle: {
    detail: [preHandle.detail, preHandle.detail],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    detail: [postHandle.detail, postHandle.detail],
  },
});
