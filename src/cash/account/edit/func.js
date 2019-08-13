import $ from 'jquery';
import commonVars from 'common/variables';
import commonFunc from 'common/function';
import data from './data';
import './ajax';
var func = {};
func.init = function() {
  if (data.isEdit) {
    $.seeAjax.get('info', {}, function(res) {
      if (res.success) {
        if (data.type == 2) {
          res.data.templateImage = res.data.licenceImage;
          res.data.licenceImage = '';
        }
        func.fillInfo(res.data);
        func.initUI();
      } else {
        commonFunc.dialog('获取信息失败，请稍后再试');
      }
    });
  } else {
    if (window.sessionStorage[data.cacheKey]) {
      func.fillInfo(JSON.parse(window.sessionStorage[data.cacheKey]));
      delete window.sessionStorage[data.cacheKey];
    }
    func.initUI();
  }
};
func.fillInfo = function(info) {
  info.bank && $('#input-bank').selectpicker('val', info.bank);
  info.subBank && $('#input-sub-bank').val(info.subBank);
  if (info.bankCard) {
    if (info.bank === '中国农业银行') {
      var $region = $('#input-bank-region');
      $region.removeClass('dp-none');
      if (info.bankCard.length > 19) {
        $region.val(info.bankCard.slice(0, info.bankCard.length - 19));
        info.bankCard = info.bankCard.slice(-19);
      }
    }
    $('#input-bank-card').val(info.bankCard);
  }
  info.account && $('#input-account').val(info.account);
  if (data.type == 2) {
    info.templateImage &&
      $('#image-template').attr({
        src: info.templateImage,
        'data-uploaded': 1,
      });
    info.idCardImage1 &&
      $('#image-id-card-1').attr({
        src: info.idCardImage1,
        'data-uploaded': 1,
      });
    info.idCardImage2 &&
      $('#image-id-card-2').attr({
        src: info.idCardImage2,
        'data-uploaded': 1,
      });
  } else {
    info.licenceImage &&
      $('#image-licence').attr({
        src: info.licenceImage,
        'data-uploaded': 1,
      });
  }
};
func.initUI = function() {
  var $title = $('#title');
  if (data.type == 2) {
    $title.text('个人银行账户');
    $('[ data-content-row="2"]').removeClass('hide');
  } else {
    $title.text('寺院对公账户');
    $('[ data-content-row="1"]').removeClass('hide');
  }
  !data.isEdit
    ? $('#prev-step').removeClass('hide')
    : $('#save').text('保存更新');
};
export default func;
