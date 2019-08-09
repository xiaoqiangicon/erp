/**
 * Created by kang on 2017/10/23.
 */

define(['jquery', 'common/function', './ajax', '../../../old-com/jquery-qrcode'], function(
  $,
  commonFunc
) {
  var func = {};
  func.init = function() {
    $('#loading-toast').addClass('hide');
    $('#experience-qrcode').qrcode({
      width: 128,
      height: 128,
      text: 'https://wx.zizaihome.com/vr/devoteIndex?templeId=6',
    });
    $('#application-qrcode').qrcode({
      width: 128,
      height: 128,
      text: 'https://wx.zizaihome.com/commodity/commodityAuth?commodityId=2112',
    });
  };
  return func;
});
