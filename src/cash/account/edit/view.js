import $ from 'jquery';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import ChooseImage from '../../../../old-com/choose-image/src';
import data from './data';
import func from './func';
import './ajax';
import 'lib/jquery.seeView';
var templateUpload;
var idCard1Upload;
var idCard2Upload;
var licenceUpload;
$.seeView({
  events: {
    'click [data-show-dialog]': 'onClickShowDialog',
    'click [data-dialog-close]': 'onClickDialogClose',
    '!click #upload-template': 'onClickUploadTemplate',
    '!click #upload-id-card-1': 'onClickUploadIdCard1',
    '!click #upload-id-card-2': 'onClickUploadIdCard2',
    '!click #upload-licence': 'onClickUploadLicence',
    '!click #save': 'onClickSave',
    '!click #prev-step': 'onClickPrevStep',
    'change #input-bank': 'onChangeInputBank',
  },
  onClickShowDialog: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-show-dialog'));
    $('[data-dialog="' + id + '"]').show();
    $('body').addClass('overflow-hidden');
  },
  onClickDialogClose: function(e) {
    $(e.target)
      .parents('.dialog')
      .hide();
    $('body').removeClass('overflow-hidden');
  },
  onClickUploadTemplate: function(e) {
    if (!templateUpload) {
      templateUpload = new ChooseImage({
        multiSelect: !1,
        onSubmit: function(items) {
          $('#image-template').attr({
            src: items[0].src,
            'data-uploaded': 1,
          });
          $('#upload-template').text('更新说明函照');
        },
      });
    }
    templateUpload.show();
  },
  onClickUploadIdCard1: function(e) {
    if (!idCard1Upload) {
      idCard1Upload = new ChooseImage({
        multiSelect: !1,
        onSubmit: function(items) {
          $('#image-id-card-1').attr({
            src: items[0].src,
            'data-uploaded': 1,
          });
          $('#upload-id-card-1').text('更新身份证正面照');
        },
      });
    }
    idCard1Upload.show();
  },
  onClickUploadIdCard2: function(e) {
    if (!idCard2Upload) {
      idCard2Upload = new ChooseImage({
        multiSelect: !1,
        onSubmit: function(items) {
          $('#image-id-card-2').attr({
            src: items[0].src,
            'data-uploaded': 1,
          });
          $('#upload-id-card-2').text('更新身份证反面照');
        },
      });
    }
    idCard2Upload.show();
  },
  onClickUploadLicence: function(e) {
    if (!licenceUpload) {
      licenceUpload = new ChooseImage({
        multiSelect: !1,
        onSubmit: function(items) {
          $('#image-licence').attr({
            src: items[0].src,
            'data-uploaded': 1,
          });
          $('#upload-licence').text('更新许可证照片');
        },
      });
    }
    licenceUpload.show();
  },
  onClickSave: function(e) {
    var self = this,
      $this = $(e.target),
      handling =
        $this.attr('data-handling') && !!parseInt($this.attr('data-handling')),
      result = self.checkFields();
    if (handling) return;
    if (!result.success) {
      commonFunc.dialog(result.message);
      return;
    }
    data.type == 2 && (result.licenceImage = result.templateImage);
    delete result.success;
    delete result.message;
    delete result.templateImage;
    $this
      .attr({
        'data-handling': 1,
      })
      .text('保存中...');
    $.seeAjax.post(data.isEdit ? 'update' : 'add', result, function(res) {
      $this
        .attr({
          'data-handling': 0,
        })
        .text(data.isEdit ? '保存更新' : '提交审核');
      if (res.success) {
        commonFunc.alert(
          (data.isEdit ? '保存更新' : '提交审核') + '成功，请耐心等待',
          function() {
            location.href = '/zzhadmin/cashTake/';
          }
        );
      } else {
        commonFunc.alert(res.message || '保存失败，请稍后再试');
      }
    });
  },
  checkFields: function() {
    var $imageLicence = $('#image-licence');
    var $imageTemplate = $('#image-template');
    var $imageIdCard1 = $('#image-id-card-1');
    var $imageIdCard2 = $('#image-id-card-2');
    var values = {
      success: !0,
      message: '',
      type: data.type,
      bank: $('#input-bank').val(),
      subBank: $('#input-sub-bank').val(),
      bankCard: $('#input-bank-card').val(),
      account: $('#input-account').val(),
      licenceImage: !!parseInt($imageLicence.attr('data-uploaded'))
        ? $imageLicence.attr('src')
        : '',
      templateImage: !!parseInt($imageTemplate.attr('data-uploaded'))
        ? $imageTemplate.attr('src')
        : '',
      idCardImage1: !!parseInt($imageIdCard1.attr('data-uploaded'))
        ? $imageIdCard1.attr('src')
        : '',
      idCardImage2: !!parseInt($imageIdCard2.attr('data-uploaded'))
        ? $imageIdCard2.attr('src')
        : '',
    };
    if (!values.bank) {
      values.success = !1;
      values.message = '银行不能为空';
      return values;
    }
    if (!values.subBank) {
      values.success = !1;
      values.message = '开户银行支行名称不能为空';
      return values;
    }
    if (!values.bankCard) {
      values.success = !1;
      values.message = '银行卡号不能为空';
      return values;
    }
    var region = $.trim($('#input-bank-region').val());
    if (values.bank === '中国农业银行') {
      values.bankCard = region + values.bankCard;
    }
    if (!values.account) {
      values.success = !1;
      values.message = '银行开户名称不能为空';
      return values;
    }
    if (data.type == 1 && !values.licenceImage) {
      values.success = !1;
      values.message = '许可证图片不能为空';
      return values;
    }
    if (data.type == 2 && !values.templateImage) {
      values.success = !1;
      values.message = '说明函照不能为空';
      return values;
    }
    if (data.type == 2 && !values.idCardImage1) {
      values.success = !1;
      values.message = '身份证正面照不能为空';
      return values;
    }
    if (data.type == 2 && !values.idCardImage2) {
      values.success = !1;
      values.message = '身份证反面照不能为空';
      return values;
    }
    return values;
  },
  onClickPrevStep: function(e) {
    var self = this,
      result = self.checkFields();
    delete result.success;
    delete result.message;
    window.sessionStorage[data.cacheKey] = JSON.stringify(result);
    history.back();
  },
  onChangeInputBank: function(e) {
    var value = $(e.target).val();
    var $region = $('#input-bank-region');
    if (value === '中国农业银行') $region.removeClass('dp-none');
    else $region.addClass('dp-none');
  },
});
