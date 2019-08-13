import $ from 'jquery';
import toastr from 'toastr';
import commonTpl from 'common/tpl';
import commonFunc from 'common/function';
import data from './data';
import tpl from './tpl';
import './ajax';
var $contentBody = $('#content-body');
var func = {};
func.requestAds = function() {
  $contentBody.html(commonTpl.placeholder);
  $.seeAjax.get('detail', {}, function(res) {
    if (!res.success || !res.data || !res.data.length) return;
    var htmlStr = '';
    res.data.map(function(item) {
      htmlStr += tpl.row.render(item);
    });
    $contentBody.html(htmlStr);
  });
};
export default func;
