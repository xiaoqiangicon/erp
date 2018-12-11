const $ = require('jquery');

const data = require('../data');
const handleList = require('./handle_list');

// qq音乐的 jsonp 接口上不能加 `_` 参数，否则请求不到数据
$.ajaxSetup({ cache: !0 });

/**
 * 请求列表数据
 *
 * @param key 搜索关键字
 * @param success 成功的回调函数
 * @param fail 失败的回调函数
 */
module.exports = (key, success, fail) => {
  $.ajax({
    url: `${
      data.dataUrl
    }jsonCallback=success_jsonpCallback&remoteplace=txt.weixin.officialaccount&w=${encodeURIComponent(
      key
    )}&platform=weixin&perpage=${data.total}&curpage=1`,
    dataType: 'jsonp',
    jsonp: 'callback',
    jsonpCallback: 'success_jsonpCallback',
    type: 'get',
    success: res => {
      success(handleList(res));
    },
    error: () => {
      fail();
    },
  });
};
