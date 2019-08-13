import $ from 'jquery';
import commonFunc from 'common/function';
import './ajax';
import '../../../old-com/jquery-qrcode';
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
export default func;
