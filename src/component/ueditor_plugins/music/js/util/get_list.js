import $ from 'jquery';
import data from '../data';
import handleList from './handle_list';
$.ajaxSetup({
  cache: !0,
});
export default (key, success, fail) => {
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
