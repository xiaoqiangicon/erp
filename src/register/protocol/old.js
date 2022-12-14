import pace from 'old/pace.min';
import config from '../submit_data/config';
import Toast from 'old/toast';
import app from './template';
import doRequest from 'old/utils';
import '../../../../pro-com/src/distpicker';
import 'old/backbone';
import 'old/ajaxFileUpload';
import 'old/uploadSize';
import juicer from 'juicer';
import 'bootstrap';
import 'jquery-confirm';
pace.start({
  document: false,
});
$.ajaxSetup({
  cache: false,
});
var foshiId = null,
  editTag = null,
  error = 0,
  uploadOthersId = 6;
$(function() {
  if (
    window.location.pathname == '/zzhadmin/templeApplySubmitData/' &&
    window.navigator.userAgent.indexOf('Chrome/45') == -1
  ) {
    $('nav > div').css('width', '32.7%');
    $('.nav3').css('width', '33.6%');
  }
  $('.uploadRow > .uploadimg').removeClass('hideVS');
  $('.uploadExample').removeClass('hideVS');
  $('.loadEffect').addClass('hide');
});
$('.sloganText').text('通达无碍 身心自在');
$('.slogan').text('通达无碍 身心自在');
$('#templeInfor').on('blur', '.required', function(e) {
  var $tar = $(e.target),
    $tarValue = $tar.val();
  if ($tarValue == '') {
    $tar
      .addClass('redBorder')
      .nextAll('.nullError')
      .removeClass('hide');
    error = 1;
  } else {
    $tar
      .removeClass('redBorder')
      .nextAll('.nullError')
      .addClass('hide');
    error = 0;
  }
});
$('#templeInfor').on('blur', '#templeName', function(e) {
  var $tar = $(e.target),
    $tarValue = $tar.val();
  if (!/^[\u4e00-\u9fa5]+$/gi.test($tarValue)) {
    $tar
      .addClass('redBorder')
      .nextAll('.nullError_msg')
      .removeClass('hide');
    error = 1;
  } else {
    $tar
      .removeClass('redBorder')
      .nextAll('.nullError_msg')
      .addClass('hide');
    error = 0;
  }
});
$('#templeInfor').on('blur', '#templeTel', function(e) {
  var $tar = $(e.target),
    $tarValue = $tar.val();
  var telReg = /^(((1{1}))+\d{10})$/;
  if (!telReg.test($tarValue)) {
    $tar
      .addClass('redBorder')
      .nextAll('.nullError_msg')
      .removeClass('hide');
    error = 1;
  } else {
    $tar
      .removeClass('redBorder')
      .nextAll('.nullError_msg')
      .addClass('hide');
    error = 0;
  }
});
$('#templeInfor').on('blur', '#templePhone', function(e) {
  var $tar = $(e.target),
    $tarValue = $tar.val();
  var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (!telReg.test($tarValue)) {
    $tar
      .addClass('redBorder')
      .nextAll('.nullError_msg')
      .removeClass('hide');
    error = 1;
  } else {
    $tar
      .removeClass('redBorder')
      .nextAll('.nullError_msg')
      .addClass('hide');
    error = 0;
  }
});
$('#templeInfor').on('blur', '#templeEmail', function(e) {
  var $tar = $(e.target),
    $tarValue = $tar.val();
  var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
  if (!emailReg.test($tarValue)) {
    $tar
      .addClass('redBorder')
      .nextAll('.nullError_msg')
      .removeClass('hide');
    error = 1;
  } else {
    $tar
      .removeClass('redBorder')
      .nextAll('.nullError_msg')
      .addClass('hide');
    error = 0;
  }
});
$('.pwdRow ').on('blur', '#phoneNumber', function(e) {
  var $tar = $(e.target),
    $tarValue = $tar.val();
  var telReg = /^(((1{1}))+\d{10})$/;
  if (!telReg.test($tarValue)) {
    $tar
      .addClass('redBorder')
      .nextAll('.nullError_msg')
      .removeClass('hide');
    error = 1;
  } else {
    $tar
      .removeClass('redBorder')
      .nextAll('.nullError_msg')
      .addClass('hide');
    error = 0;
  }
});
$('.pwdRow ').on('blur', '#newPwd', function(e) {
  var $tar = $(e.target),
    $tarValue = $tar.val();
  if ($tarValue.length < 6) {
    $tar
      .addClass('redBorder')
      .nextAll('.nullError_msg')
      .removeClass('hide');
    error = 1;
  } else {
    $tar
      .removeClass('redBorder')
      .nextAll('.nullError_msg')
      .addClass('hide');
    error = 0;
  }
});
$('.pwdRow ').on('blur', '#affirmNewPwd', function(e) {
  var $tar = $(e.target),
    $tarValue = $tar.val(),
    $newPwd = $('#newPwd').val();
  if ($tarValue != $newPwd) {
    $tar
      .addClass('redBorder')
      .nextAll('.nullError_msg')
      .removeClass('hide');
    error = 1;
  } else {
    $tar
      .removeClass('redBorder')
      .nextAll('.nullError_msg')
      .addClass('hide');
    error = 0;
  }
});
var View = Backbone.View.extend({
  el: 'body',
  code: null,
  options: {},
  events: {
    'click #isLegal': 'showLegal',
    'click #noLegal': 'hideLegal',
    'click .imgButton': 'showUploadImg',
    'click [data-type="otherImgButton"]': 'showUploadOtherImg',
    'click #othersUploadButton': 'othersUploadButton',
    'click [data-type="deleteOthersImg"]': 'deleteOthersImg',
    'click #agree': 'preparaNext',
    'click #fillNext': 'submitFillNext',
    'click #submitPrev': 'submitPrev',
    'click #submitNext': 'submitNext',
    'click [data-id="vertifica"]': 'sendVertifica',
    'click #navIcon': 'showNav',
    'click #phoneIcon': 'phoneNav',
    'click #preparaNext': 'prepareEnd',
    'click #suppleInfo': 'suppleInfo',
    'click #returnPrev': 'returnPrev',
    'click #resetPwd': 'resetPwd',
    'click #reSignIn': 'reSignIn',
    'click #getVertifiCode': 'getVertifiCode',
    'click #getCode': 'getCode',
    'click #confirmVertifi': 'confirmVertifi',
    'click #showPassword': 'showPassword',
  },
  initialize: function(e) {
    var self = this;
    var UrlSearch = new self.UrlSearch();
    foshiId = UrlSearch.id;
    $('#preparaNext').attr('data-href', 'javascript:void[0]');
    if (
      window.location.pathname == '/zzhadmin/' ||
      window.location.pathname == '/'
    ) {
      foshiId = verifyData.id;
    } else if (window.location.pathname == '/zzhadmin/findpwd/') {
      self.createCode();
    }
    editTag = UrlSearch.edit;
    if (document.getElementById('protocol') != undefined) {
      document.getElementById('protocol').innerHTML = app.template.protocol;
    }
    if (document.title == '审核') {
      var status = verifyData.status;
      if (status == 1) {
        $('[data-id="submitVerify"]').removeClass('hide');
      } else if (status == 2) {
        $('[data-id="submitFail"]').removeClass('hide');
        $('.uncerticicated').addClass('hide');
        $('.certicicateFail').removeClass('hide');
      }
    }
    if ($('#agree:checked').length == 1) {
      $('#preparaNext').css('background-color', '#0d7652');
      $('#preparaNext').attr('data-href', '/zzhadmin/templeApplyFillInfo/');
    }
    if (
      window.location.pathname ==
        ('/zzhadmin/templeApplySubmitData/' ||
          '/zzhadmin/templeRegisterResult/') ||
      foshiId != undefined
    ) {
      $.ajax({
        type: 'get',
        url: '/zzhadmin/templeApplyInfo',
        async: false,
        success: function(data) {
          var name = data.data.name;
          $('#login').addClass('hide');
          $('#logined')
            .removeClass('hide')
            .text(name);
        },
        error: function(msg) {
          Toast('网络服务出错，请稍后再试', 0);
        },
      });
    }
    if (editTag == 1) {
      $.ajax({
        type: 'get',
        url: '/zzhadmin/templeApplyInfo',
        async: false,
        success: function(data) {
          if (window.location.pathname == '/zzhadmin/templeApplyFillInfo/') {
            var name = data.data.name,
              province = data.data.province,
              city = data.data.city,
              address = data.data.address,
              registrant = data.data.registrant,
              registrantMobile = data.data.registrantMobile,
              placeNo = data.data.placeNo,
              mobile = data.data.mobile,
              email = data.data.email,
              corporation = data.data.corporation;
            $('#login').addClass('hide');
            $('#logined')
              .removeClass('hide')
              .text(name);
            $('.uncerticicated').removeClass('hide');
            $('#templeName').val(name);
            $('#templeCode').val(placeNo);
            $('#address').val(address);
            $('#province').distpicker({
              province: province,
              city: city,
              autoSelect: false,
              placeholder: false,
            });
            $('#templeLegal').val(corporation);
            $('#templeTel').val(mobile);
            if (registrant == '') {
              $('#templeTel')
                .attr('disabled', 'disabled')
                .addClass('frozen');
            }
            $('#templeEmail').val(email);
            if (registrant == '') {
              $('#isLegal').click();
            }
            $('#templeSignin').val(registrant);
            $('#templePhone')
              .val(registrantMobile)
              .attr('disabled', 'disabled')
              .addClass('frozen');
            $('#templeVertifica')
              .attr('disabled', 'disabled')
              .addClass('frozen');
            $('#templePassword')
              .attr('disabled', 'disabled')
              .addClass('frozen');
            $('#vertifica')
              .css('background-color', '#aaa')
              .attr('disabled', 'disabled');
            $('#isLegal')
              .parents('.form-group')
              .addClass('hide');
          } else {
            var placeNoPic = data.data.placeNoPic,
              bankPic = data.data.bankPic,
              idCardPic = data.data.idCardPic,
              certificatePic = data.data.certificatePic,
              otherCertificatePic = data.data.otherCertificatePic;
            $('[data-id="upload1"]').attr('src', placeNoPic);
            $('[data-id="upload2"]').attr('src', bankPic);
            $('[data-id="upload3"]').attr('src', certificatePic);
            $('[data-id="upload4"]').attr('src', idCardPic);
            $('[data-type="otherUploadData"]')
              .find('.uploadImg')
              .remove();
            otherCertificatePic = otherCertificatePic.split(',');
            var otherPic_obj = {};
            otherPic_obj['data'] = otherCertificatePic;
            var template_boxs = juicer(config.template.component.uploadBoxs),
              html_boxs = template_boxs.render(otherPic_obj);
            $('[data-type="otherUploadData"]').append(html_boxs);
          }
          console.log(data);
        },
        error: function(msg) {
          Toast('网络服务出错，请稍后再试', 0);
        },
      });
    } else {
      $('#province').distpicker({
        province: '省份',
        city: '城市',
        autoSelect: false,
        placeholder: true,
      });
    }
  },
  UrlSearch: function() {
    var name, value;
    var str = location.href;
    var num = str.indexOf('?');
    str = str.substr(num + 1);
    var arr = str.split('&');
    for (var i = 0; i < arr.length; i++) {
      num = arr[i].indexOf('=');
      if (num > 0) {
        name = arr[i].substring(0, num);
        value = arr[i].substr(num + 1);
        this[name] = value;
      }
    }
  },
  showLegal: function(e) {
    var self = this,
      $tar = $(e.target);
    $('#isLegal')
      .find('input')
      .prop('checked', 'checked');
    $('#noLegal')
      .find('input')
      .prop('checked', '');
    $('#templeSignin')
      .parents('.form-group')
      .addClass('hide');
    $('#templePhone')
      .parents('.form-group')
      .addClass('hide');
    $('.loginTip').text('法人手机号码为登录账号');
  },
  hideLegal: function(e) {
    var self = this,
      $tar = $(e.target);
    $('#noLegal')
      .find('input')
      .prop('checked', 'checked');
    $('#isLegal')
      .find('input')
      .prop('checked', '');
    $('#templeSignin')
      .parents('.form-group')
      .removeClass('hide');
    $('#templePhone')
      .parents('.form-group')
      .removeClass('hide');
    $('.loginTip').text('注册人手机号码为登录账号');
  },
  othersUploadButton: function(e) {
    var $tar = $(e.target);
    $tar.prev().click();
  },
  showUploadImg: function(e) {
    var self = this,
      $tar = $(e.target);
    $tar.checkFileTypeAndSize({
      allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'bmp'],
      maxSize: 2048,
      success: function(e) {
        var sizePicId = $tar.attr('id');
        $.ajaxFileUpload({
          url: '/zzhadmin/uploadPic/',
          secureuri: false,
          fileElementId: sizePicId,
          dataType: 'JSON',
          data: {},
          success: function(data, status) {
            var jsonValue = data.split(',')[1].split('"'),
              picsValue = jsonValue[3],
              $img = $('#' + sizePicId)
                .parents('.uploadButton')
                .next()
                .find('img');
            $img.attr('src', picsValue);
          },
          error: function(data, status, e) {
            Toast('网络繁忙，请稍后再试', 0);
          },
        });
      },
      extensionerror: function() {
        alert('允许的格式为：jpg、jpeg、gif、png');
        return;
      },
      sizeerror: function() {
        alert('图片文件大小限制在2M内，请压缩后重传。');
        return;
      },
    });
  },
  showUploadOtherImg: function(e) {
    var self = this,
      $tar = $(e.target);
    $tar.checkFileTypeAndSize({
      allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'bmp'],
      maxSize: 2048,
      success: function(e) {
        var sizePicId = $tar.attr('id');
        $.ajaxFileUpload({
          url: '/zzhadmin/uploadPic/',
          secureuri: false,
          fileElementId: sizePicId,
          dataType: 'JSON',
          data: {},
          success: function(data, status) {
            var jsonValue = data.split(',')[1].split('"'),
              picsValue = jsonValue[3],
              $img_length = $('[data-id="uploadOthers"]').length,
              $img = $('[data-id="uploadOthers"]').eq($img_length - 1);
            $img.attr('src', picsValue);
            var delete_template = juicer(
                config.template.component.deleteUpload
              ),
              delete_html = delete_template.render({});
            $img.parent().append(delete_html);
            var template = juicer(config.template.component.uploadBox),
              html = template.render({});
            $('[data-type="otherUploadData"]').append(html);
            $tar.attr('id', uploadOthersId++);
          },
          error: function(data, status, e) {
            Toast('网络繁忙，请稍后再试', 0);
          },
        });
      },
      extensionerror: function() {
        alert('允许的格式为：jpg、jpeg、gif、png');
        return;
      },
      sizeerror: function() {
        alert('图片文件大小限制在2M内，请压缩后重传。');
        return;
      },
    });
  },
  deleteOthersImg: function(e) {
    var $tar = $(e.target);
    $.confirm({
      title: false,
      content: '你确定删除该附件吗?',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            $tar.parent().remove();
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  sendVertifica: function(e) {
    var self = this,
      $tar = $(e.target),
      vertificaError = 0,
      mobile = $('#templeTel').val(),
      isLegal = $('[name="Legal"]:checked').val(),
      registrantMobile = $('#templePhone').val();
    var opt = {};
    if (isLegal == 1) {
      if (mobile == '' || $('#templeTel').hasClass('redBorder')) {
        vertificaError = 1;
        $('body').scrollTop($('#templeTel').offset().top);
        Toast('请填写法人手机号码！', 2);
      } else {
        opt['mobile'] = mobile;
      }
    } else {
      if (registrantMobile == '' || $('#templePhone').hasClass('redBorder')) {
        vertificaError = 1;
        $('body').scrollTop($('#templePhone').offset().top);
        Toast('请填写注册人手机号码！', 2);
      } else {
        opt['mobile'] = registrantMobile;
      }
    }
    if (vertificaError == 0) {
      doRequest(
        '/zzhadmin/templeApplySendCode/',
        opt,
        function(msg) {
          $('#vertifica')
            .attr('disabled', 'disabled')
            .attr('style', 'background-color:#bbb');
          self.timer(60);
          Toast(msg.msg);
        },
        function(msg) {
          Toast('网络出错,发送失败', 0);
        }
      );
    }
  },
  timer: function(e) {
    var self = this,
      time = e;
    if (time == 0) {
      $('#vertifica')
        .removeAttr('disabled')
        .text('重新发送')
        .attr('style', '');
      $('#getVertifiCode')
        .removeAttr('disabled')
        .text('重新发送')
        .attr('style', '');
    } else {
      $('#vertifica').text(time);
      $('#getVertifiCode').text(time);
      time--;
      setTimeout(function() {
        self.timer(time);
      }, 1000);
    }
  },
  preparaNext: function(e) {
    if ($('#agree:checked').length == 1) {
      $('#preparaNext').css('background-color', '#0d7652');
      $('#preparaNext').attr('data-href', '/zzhadmin/templeApplyFillInfo/');
    } else {
      $('#preparaNext').css('background-color', '#ccc');
      $('#preparaNext').attr('data-href', 'javascript:void[0]');
    }
  },
  showNav: function(e) {
    $('#navBar').toggleClass('fadein');
    $('#navIcon').toggleClass('rotateIcon');
  },
  phoneNav: function(e) {
    var $tar = $(e.target);
    e.stopPropagation();
    $('#phoneMenu').animate(
      {
        width: '130px',
      },
      'fast'
    );
    $('#phoneIcon').addClass('hide');
    $('#pageContent').css('margin-right', '130px');
  },
  submitFillNext: function(e) {
    var self = this,
      $tar = $(e.target);
    var name = $('#templeName').val(),
      placeNo = $('#templeCode').val(),
      province = $('[data-id="province"]').val(),
      city = $('[data-id="city"]').val(),
      address = $('#address').val(),
      corporation = $('#templeLegal').val(),
      mobile = $('#templeTel').val(),
      email = $('#templeEmail').val(),
      isLegal = $('[name="Legal"]:checked').val(),
      registrant = $('#templeSignin').val(),
      registrantMobile = $('#templePhone').val(),
      templeVertifica = $('#templeVertifica').val(),
      pwd = $('#templePassword').val();
    if (name == '' || $('#templeName').hasClass('redBorder')) {
      $('body').scrollTop($('#templeName').offset().top);
      error = 1;
      Toast('请正确填写寺院名！', 2);
      return false;
    }
    if (placeNo == '') {
      $('body').scrollTop($('#templeCode').offset().top);
      error = 1;
      Toast('请填写场地编号！', 2);
      return false;
    }
    if (province == '') {
      $('body').scrollTop($('[data-id="province"]').offset().top);
      error = 1;
      Toast('请填写所在省份！', 2);
      return false;
    }
    if (city == '') {
      $('body').scrollTop($('[data-id="city"]').offset().top);
      error = 1;
      Toast('请填写所在城市！', 2);
      return false;
    }
    if (address == '') {
      $('body').scrollTop($('#address').offset().top);
      error = 1;
      Toast('请填写详细地址', 2);
      return false;
    }
    if (corporation == '') {
      $('body').scrollTop($('#templeLegal').offset().top);
      error = 1;
      Toast('请填写法人姓名！', 2);
      return false;
    }
    if (mobile == '' || $('#templeTel').hasClass('redBorder')) {
      $('body').scrollTop($('#templeTel').offset().top);
      error = 1;
      Toast('请正确填写法人手机号码！', 2);
      return false;
    }
    if (email == '' || $('#templeEmail').hasClass('redBorder')) {
      $('body').scrollTop($('#templeEmail').offset().top);
      error = 1;
      Toast('请正确填写邮箱！', 2);
      return false;
    }
    if (isLegal == 0) {
      if (registrant == '') {
        $('body').scrollTop($('#templeSignin').offset().top);
        error = 1;
        Toast('请填写注册人！', 2);
        return false;
      } else if (registrant == corporation) {
        $('body').scrollTop($('#templeSignin').offset().top);
        error = 1;
        Toast('注册人不能与法人相同！', 2);
        return false;
      }
      if (registrantMobile == '' || $('#templePhone').hasClass('redBorder')) {
        $('body').scrollTop($('#templePhone').offset().top);
        error = 1;
        Toast('请正确填写注册人手机号码！', 2);
        return false;
      } else if (registrantMobile == mobile) {
        $('body').scrollTop($('#templePhone').offset().top);
        error = 1;
        Toast('注册人手机号码不能与法人手机号相同！', 2);
        return false;
      }
    }
    if (editTag != 1) {
      if (templeVertifica == '') {
        $('body').scrollTop($('#templeVertifica').offset().top);
        error = 1;
        Toast('请填写验证码！', 2);
        return false;
      }
      if (pwd == '') {
        $('body').scrollTop($('#templePassword').offset().top);
        error = 1;
        Toast('请填写登录密码！', 2);
        return false;
      } else if (pwd.length < 6) {
        $('body').scrollTop($('#templePassword').offset().top);
        error = 1;
        Toast('登录密码至少6位！', 2);
        return false;
      }
    }
    if (error == 0) {
      var opt = {};
      if (editTag == 1) {
        var URL = '/zzhadmin/templeApplyEdit/';
        opt['id'] = foshiId;
      } else {
        var URL = '/zzhadmin/templeApply/';
        opt['code'] = templeVertifica;
        opt['pwd'] = pwd;
      }
      opt['name'] = name;
      opt['placeNo'] = placeNo;
      opt['province'] = province;
      opt['city'] = city;
      opt['address'] = address;
      opt['corporation'] = corporation;
      opt['mobile'] = mobile;
      opt['email'] = email;
      if (isLegal == 0) {
        opt['registrant'] = registrant;
        opt['registrantMobile'] = registrantMobile;
      }
      doRequest(
        URL,
        opt,
        function(msg) {
          Toast('上传成功!');
          if (editTag == 1) {
            var curId = foshiId;
            window.location.href =
              '/zzhadmin/templeApplySubmitData/?edit=1&id=' + curId;
          } else {
            var curId = msg.data.id;
            window.location.href =
              '/zzhadmin/templeApplySubmitData/?id=' + curId;
          }
        },
        function(msg) {
          if (msg.result == -8) {
            Toast('用户已存在', 2);
          } else if (msg.result == -2) {
            Toast('验证码错误', 2);
          } else {
            Toast(msg.msg, 2);
          }
        }
      );
    } else {
      Toast('请填写完整信息！', 2);
    }
  },
  submitPrev: function(e) {
    var self = this,
      $tar = $(e.target),
      curId = foshiId;
    window.location.href =
      '/zzhadmin/templeApplyFillInfo/?id=' + curId + '&edit=1';
  },
  submitNext: function(e) {
    var self = this,
      $tar = $(e.target),
      picsError = 0;
    var placeNoPic = $('[data-id="upload1"]').attr('src'),
      bankPic = $('[data-id="upload2"]').attr('src'),
      certificatePic = $('[data-id="upload3"]').attr('src'),
      idCardPic = $('[data-id="upload4"]').attr('src'),
      otherCertificatePic = '';
    $.each($('[data-id="uploadOthers"]'), function(index, ele) {
      otherCertificatePic += $(ele).attr('src') + ',';
    });
    otherCertificatePic = otherCertificatePic.substr(
      0,
      otherCertificatePic.length - 2
    );
    if (placeNoPic == '') {
      $('body').scrollTop($('[data-id="upload1"]').offset().top);
      picsError = 1;
      Toast('请上传场地证明！', 2);
      return false;
    }
    if (picsError == 0) {
      var opt = {};
      opt['id'] = foshiId;
      opt['placeNoPic'] = placeNoPic;
      opt['bankPic'] = bankPic;
      opt['idCardPic'] = idCardPic;
      opt['certificatePic'] = certificatePic;
      opt['otherCertificatePic'] = otherCertificatePic;
      doRequest(
        '/zzhadmin/templeVerifyPic/',
        opt,
        function(msg) {
          Toast('上传成功!');
          var curId = foshiId;
          window.location.href = '/zzhadmin/templeRegisterResult/?id=' + curId;
        },
        function(msg) {
          Toast('上传失败，请填写完整信息！', 0);
        }
      );
    } else {
      Toast('请填写完整信息！', 2);
    }
  },
  prepareEnd: function(e) {
    var self = this,
      $tar = $(e.target);
    window.location.href = $('#preparaNext').attr('data-href');
  },
  suppleInfo: function(e) {
    var self = this;
    window.location.href =
      '/zzhadmin/templeApplySubmitData/?edit=1&id=' + verifyData.id;
  },
  returnPrev: function(e) {
    var self = this;
    window.location.href =
      '/zzhadmin/templeApplySubmitData/?edit=1&id=' + verifyData.id;
  },
  confirmVertifi: function(e) {
    var self = this,
      $tar = $(e.target),
      phoneNumber = $('#phoneNumber').val(),
      inputCode = $('#input')
        .val()
        .toUpperCase(),
      opt = {};
    if (inputCode.length <= 0) {
      e.preventDefault();
      Toast('请输入验证码！', 2);
    } else if (inputCode != code) {
      e.preventDefault();
      Toast('验证码输入错误！@_@', 2);
      self.createCode();
      $('#input').val('');
    } else {
      $('#vertifiModal').modal('hide');
      opt['mobile'] = phoneNumber;
      doRequest(
        '/zzhadmin/templeApplySendCode/',
        opt,
        function(msg) {
          $('#getVertifiCode')
            .attr('disabled', 'disabled')
            .attr('style', 'background-color:#bbb');
          self.timer(60);
          Toast(msg.msg, 2);
        },
        function(msg) {
          Toast('发送失败', 0);
        }
      );
    }
  },
  resetPwd: function(e) {
    var self = this,
      $tar = $(e.target),
      resetError = 0;
    var phoneNumber = $('#phoneNumber').val(),
      shortMessage = $('#shortMessage').val(),
      newPwd = $('#newPwd').val(),
      affirmNewPwd = $('#affirmNewPwd').val();
    if (phoneNumber == '' || $('#phoneNumber').hasClass('redBorder')) {
      $('body').scrollTop($('#phoneNumber').offset().top);
      resetError = 1;
      Toast('请输入正确的手机号码！', 2);
      return false;
    }
    if (shortMessage == '') {
      $('body').scrollTop($('#shortMessage').offset().top);
      resetError = 1;
      Toast('请输入验证码！', 2);
      return false;
    }
    if (newPwd == '' || $('#newPwd').hasClass('redBorder')) {
      $('body').scrollTop($('#newPwd').offset().top);
      resetError = 1;
      Toast('请重新填写密码！', 2);
      return false;
    }
    if (affirmNewPwd == '' || $('#affirmNewPwd').hasClass('redBorder')) {
      $('body').scrollTop($('#affirmNewPwd').offset().top);
      resetError = 1;
      Toast('填写的两个密码应该一致！', 2);
      return false;
    }
    if (resetError == 0) {
      var opt = {};
      opt['mobile'] = phoneNumber;
      opt['code'] = shortMessage;
      opt['pwd'] = newPwd;
      doRequest(
        '/zzhadmin/editPwd/',
        opt,
        function(msg) {
          Toast('上传成功!');
          window.location.href = '/zzhadmin/newpwd/';
        },
        function(msg) {
          Toast(msg.msg, 2);
        }
      );
    } else {
      Toast('请正确填写信息！', 2);
    }
  },
  reSignIn: function(e) {
    window.location.href = '/accounts/login/';
  },
  getCode: function(e) {
    var self = this,
      $tar = $(e.target);
    self.createCode();
  },
  createCode: function(e) {
    var self = this;
    self.code = '';
    var codeLength = 4;
    var checkCode = document.getElementById('getCode');
    var random = new Array(
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    );
    for (var i = 0; i < codeLength; i++) {
      var index = Math.floor(Math.random() * 36);
      self.code += random[index];
    }
    checkCode.value = self.code;
  },
  getVertifiCode: function(e) {
    var self = this,
      phoneNumber = $('#phoneNumber').val();
    if (phoneNumber == '' || $('#phoneNumber').hasClass('redBorder')) {
      $('body').scrollTop($('#phoneNumber').offset().top);
      Toast('请填写注册人手机号码！', 2);
      return false;
    } else {
      self.createCode();
      $('#input').val('');
    }
  },
  showPassword: function(e) {
    var $tar = $(e.target),
      $passwordInput = $('#templePassword'),
      $passwordType = $('#templePassword').attr('type');
    if ($passwordType == 'text') {
      $passwordInput.attr('type', 'password');
      $tar.attr('class', 'showPassword');
    } else {
      $passwordInput.attr('type', 'text');
      $tar.attr('class', 'hidePassword');
    }
  },
});
new View();
$(document).ready(function(e) {
  if (window.innerWidth < 500) {
    $(document).click(function(event) {
      var curWidth = window.innerWidth - 130;
      $('#phoneIcon').removeClass('hide');
      if (event.pageX < curWidth && $('#phoneMenu').css('width') == '130px') {
        $('#phoneMenu').animate(
          {
            width: '0',
          },
          'fast'
        );
        $('#pageContent').css('margin-right', '0');
        return false;
      }
    });
    $(window).scroll(function() {
      if (window.pageYOffset > 0) {
        $('#toTop').removeClass('hide');
      } else {
        $('#toTop').addClass('hide');
      }
    });
    $('body').on('click', '#toTop', function(e) {
      $('body').scrollTop(0);
    });
  }
});
