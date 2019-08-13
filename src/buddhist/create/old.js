import $ from 'jquery';
import _ from 'underscore';
import Toast from 'old/toast';
import moment from 'moment';
import ClipBoard from 'clipboard';
import ChooseImage from '../../../old-com/choose-image/src';
import config from './config';
import Const from './const';
import modelDispose from './dispose_model';
import myTool from './util';
import StoreImage from '../../../old-com/store-image/src';
import purifyATarget from 'util/purify_a_target';
import doRequest from 'old/utils';
import 'old/backbone';
import 'juicer';
import 'jquery-confirm';
import 'bootstrap-select';
import 'bootstrap-switch';
import 'jquery-ui/ui/widgets/sortable';
$.ajaxSetup({
  cache: false,
});
var is_test_environment = config.environment;
window.contentData = {};
var myRegExp = {
  suixi_price: /((\d)+(\.(\d)+)?(\,|\，)?)+/g,
  suixi_price_right: /^(\d+)(\.(\d+))*((,|，)\d+(\.(\d+))?)*$/,
};
var foshiId = null,
  templateId = null,
  editType = null,
  foshiName = null,
  ifTemplate = null,
  verifyId = null,
  sizeIteration = 0,
  origin_printer_list = [],
  printer_list = [],
  selection_list = [],
  no_selection_list = [],
  ifFirstSave = true,
  first_set = true,
  overall_if_open_printer = false,
  set_imagetext = 1,
  template_content = {},
  has_local_storage = false,
  has_tip = false,
  if_set_printer = false,
  if_submiting_pic = false,
  ifSingleMoney;
var View = Backbone.View.extend({
  el: 'body',
  locationBc: 0,
  sizePostscript: {},
  prepareRemovePostscript: {},
  prepareRemovePostscriptId: null,
  PicssId: 0,
  PicId: 1,
  addClassId: null,
  ready_editor: 0,
  show_printer_id: 0,
  new_template_name: 0,
  show_printer_type: null,
  html: $('.upload_wrap').html(),
  sizes: null,
  sizesView: null,
  additionItems: null,
  additionView: null,
  sizesAddition: null,
  sizesAdditionView: null,
  classification: [],
  events: {
    'keyup [data-ele="s-textarea"]': 'onKeyupSTextarea',
    'show.bs.modal #classificationModal': 'showClassificationModal',
    'hide.bs.modal #classificationModal': 'hideClassificationModal',
    'click .deleteClassificationList': 'deleteClassificationList',
    'click .reviseClassificationList': 'reviseClassificationList',
    'click #addClassificationList': 'addClassificationList',
    'click #coverPic0': 'uploadCoverPic',
    'click .delPic': 'delPic',
    'click #myEditor': 'focusMyEditor',
    'click #generateRandom': 'generateRandom',
    'keyup #suixiInput': 'detectSuixiInput',
    'blur #suixiInput': 'blurSuixiInput',
    'click #needPay': 'showSuixiInput',
    'click #noNeedPay': 'hideSuixiInput',
    'show.bs.modal #sub-set-modal': 'showSubSetModal',
    'click #save-sub-set': 'onClickSaveSubSet',
    'click #proStyleBtn': 'showSizeBox',
    'changed.bs.select [name="sizeType"]': 'onChangeSubType',
    'blur #proName': 'proName',
    'blur .proSizeName': 'setProValue',
    'blur .proPrice': 'setProValue',
    'blur .proStock': 'setProValue',
    'focus .proPrice': 'showRandomPrice',
    'mousedown [data-id="generateRandomPrice"]': 'generateRandomPrice',
    'mousedown [data-id="autoFinishOrder"]': 'autoFinishOrder',
    'keydown .proPrice': 'changeIfSingleMoney',
    'keyup .proPrice': 'detectRandom',
    'focus #suixiInput': 'showSuixiRandomPrice',
    'click .smallPicture': 'uploadSmallPic',
    'click .delSmallPic': 'delSmallPic',
    'click .copyProSize': 'copyProSize',
    'click .removeProSize': 'removeProSize',
    'click #sizesAddAddition': 'sizesAddAddition',
    'click #sizesAddAdditionItem': 'sizesAddAdditionItem',
    'show.bs.modal #sizesPostModal': 'showSizesPostModal',
    'click #saveSizeInputSetting': 'saveSizeInputSetting',
    'click #saveSizeDateSetting': 'saveSizeDateSetting',
    'click #saveSizeSelectSetting': 'saveSizeSelectSetting',
    'click #saveSizeInstructSetting': 'saveSizeInstructSetting',
    'click #saveSizeImagesSetting': 'saveSizeImagesSetting',
    'click #saveSizeRadioSetting': 'saveSizeRadioSetting',
    'show.bs.modal #inputSizeAdditionModal': 'showSizeAdditionModal',
    'show.bs.modal #dateSizeAdditionModal': 'showSizeAdditionModal',
    'show.bs.modal #selectSizeAdditionModal': 'showSizeAdditionModal',
    'show.bs.modal #instuctSizeAdditionModal': 'showSizeAdditionModal',
    'show.bs.modal #imagesSizeAdditionModal': 'showSizeAdditionModal',
    'show.bs.modal #radioSizeAdditionModal': 'showSizeAdditionModal',
    'click [data-id="closeSizePostscript"]': 'closeSizePostscript',
    'click .sizesAdditionRemove': 'sizesAdditionRemove',
    'click .saveAdd': 'saveAddition',
    'blur .sizeAdditionName': 'setSizeAdditionName',
    'hide.bs.modal #selectAdditionModal': 'hideselectAdditionModal',
    'click [name="sizeTelVerify"]': 'onClickSizeTelVerify',
    'click #addAddition': 'addAddition',
    'click #addAdditionItem': 'addAdditionItem',
    'show.bs.modal #inputAdditionModal': 'showInputAdditionModal',
    'show.bs.modal #dateAdditionModal': 'showInputAdditionModal',
    'show.bs.modal #imagesAdditionModal': 'showInputAdditionModal',
    'show.bs.modal #instuctAdditionModal': 'showInputAdditionModal',
    'show.bs.modal #selectAdditionModal': 'showInputAdditionModal',
    'show.bs.modal #radioAdditionModal': 'showInputAdditionModal',
    'click .additionRemove': 'removeAddition',
    'blur .additionName': 'setAdditionName',
    'click #saveInputSetting': 'saveInputSetting',
    'click #saveInstructSetting': 'saveInstructSetting',
    'click #saveImagesSetting': 'saveImagesSetting',
    'click #saveDateSetting': 'saveDateSetting',
    'click #saveRadioSetting': 'saveRadioSetting',
    'click #saveSelectSetting': 'saveSelectSetting',
    'click [name="telVerify"]': 'onClickTelVerify',
    'click [data-ele="recharge-msg-num"]': 'onClickRechargeMsgNum',
    'click [name="showFeedbackImg"]': 'onClickShowFeedbackImg',
    'click [data-ele="feedback-type"]': 'onClickFeedbackType',
    'click [name="if_feedback"]': 'if_feedback',
    'mouseenter [data-ele="preview-spcl-sub-ps"]': 'enter_spcl_sub_ps',
    'mouseleave [data-ele="preview-spcl-sub-ps"]': 'leave_spcl_sub_ps',
    'click [name="summaryArea"]': 'onClickSummaryArea',
    'click [data-ele="summary-area-type"]': 'onClickSummaryAreaType',
    'changed.bs.select #selectPrinter': 'selectPrinter',
    'click [data-type="no_selection_printer_div"]': 'selectNoSelectionPrinter',
    'changed.bs.select #printNumber': 'change_print_number',
    'click [data-type="dimension_code_label"]': 'dimension_code_label',
    'click [data-type="print_tel_label"]': 'print_tel_label',
    'show.bs.modal #setPrintModal': 'setPrintModal',
    'hide.bs.modal #setPrintModal': 'closeSetPrintModal',
    'click [data-type="surePrint"]': 'surePrint',
    'click .print_label': 'print_switch',
    'click [data-type="selection_checkbox"]': 'selection_checkbox',
    'click #submit': 'submit',
    'click #closeNotSetPrinterModal': 'showSetPrinterModal',
    'click #skip-set-printer-and-save': 'skipSetPrinterAndSave',
    'hide.bs.modal #notSetPrinterModal': 'hideNotSetPrinterModal',
    'click #set_template': 'set_template',
    'click #save-draft': 'save_draft',
    'click [data-type="confirm_template"]': 'confirm_template',
    'click [data-type="cancel_template"]': 'cancel_template',
    'click #cancel': 'cancel',
    'hide.bs.modal #addCalendarModal': 'closeAddCalendarModal',
    'click [data-action="close"][data-type="promotion"]':
      'onClickClosePromotion',
    'click #sureCalendar': 'sureCalendar',
  },
  onKeyupSTextarea: function(e) {
    var $curTar = $(e.currentTarget),
      $numTip = $curTar.next(),
      textLen = $curTar.val().length,
      maxLen = $curTar.prop('maxlength');
    $numTip.html(textLen + '/' + maxLen);
  },
  showClassificationModal: function() {
    var self = this,
      classification = self.res,
      fragmentHtml = '';
    _.each(classification, function(item, index) {
      fragmentHtml +=
        "<li class='list-group-item' style='overflow: hidden;'>" +
        '<input  data-id=' +
        item.ceremonyTypeId +
        " class='form-control pull-left ' style='width: 200px' value=" +
        item.name +
        '  />' +
        "<button class='btn btn-warning btn-xs pull-right deleteClassificationList' data-id=" +
        item.ceremonyTypeId +
        "  style='margin-top: 6px;'>删除</button>" +
        "<button class='btn btn-warning btn-xs pull-right reviseClassificationList' data-id=" +
        item.ceremonyTypeId +
        "  style='margin-top: 6px; margin-right:6px;'>修改</button>" +
        '</li>';
    });
    $('#classificationSelBox').html(fragmentHtml);
  },
  hideClassificationModal: function(e) {
    var self = this,
      classification = self.res,
      currentSelect = $('#classification').selectpicker('val');
    if (classification == undefined) {
      classification = [];
    }
    if (typeof classification == 'object' && classification.length > 0) {
      $('#classifiSelect').removeClass('hide');
      var opHtml = '';
      _.each(classification, function(item, index) {
        opHtml +=
          '<option value=' +
          item.ceremonyTypeId +
          ' data-id=' +
          item.ceremonyTypeId +
          '>' +
          item.name +
          '</option>';
      });
      $('#classification').selectpicker('destroy');
      $('#classification').html(opHtml);
      $('#classification').selectpicker({});
      _.each(classification, function(item, index) {
        if (currentSelect == item.ceremonyTypeId) {
          $('#classification').selectpicker('val', item.ceremonyTypeId);
        } else {
        }
      });
    } else if (classification.length == 0) {
      $('#classifiSelect').addClass('hide');
      var opHtml = '';
      $('#classification').selectpicker('destroy');
      $('#classification').html(opHtml);
      $('#classification').selectpicker({});
    }
  },
  deleteClassificationList: function(e) {
    var self = this,
      $tar = $(e.target),
      classification = self.res,
      id = parseInt($tar.attr('data-id')),
      typeopt = {};
    typeopt['id'] = id;
    $.confirm({
      title: false,
      content: '你确定删除吗?',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            doRequest(
              '/zzhadmin/delCeremonyType/',
              typeopt,
              function(res) {},
              function(msg) {}
            );
            classification = _.filter(classification, function(item) {
              return item.ceremonyTypeId != id;
            });
            self.res = classification;
            self.showClassificationModal();
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  reviseClassificationList: function(e) {
    var self = this,
      $tar = $(e.target),
      classification = self.res,
      id = parseInt($tar.attr('data-id')),
      name = $tar
        .prev()
        .prev()
        .val(),
      typeopt = {};
    typeopt['id'] = id;
    typeopt['name'] = name;
    doRequest(
      '/zzhadmin/managerEditCeremonyType/',
      typeopt,
      function(res) {
        if (res.result == 0) {
          Toast('修改成功!');
        }
      },
      function(msg) {}
    );
    if (typeof classification == 'object' && classification.length > 0) {
      _.each(classification, function(item, index) {
        if (item.ceremonyTypeId == id) {
          item.name = name;
        }
      });
    }
  },
  addClassificationList: function(e) {
    var self = this,
      $tar = $(e.target),
      classification = self.res,
      value = $('#addClassificationItem').val();
    if ($.trim(value).length > 0) {
      var typeopt = {};
      typeopt['name'] = value;
      doRequest(
        '/zzhadmin/createCeremonyType/',
        typeopt,
        function(res) {
          self.addClassId = res.typeId;
          if (typeof classification == 'undefined') {
            classification = [];
          }
          classification.push({
            ceremonyTypeId: self.addClassId,
            name: value,
          });
          self.res = classification;
          self.showClassificationModal();
          $('#addClassificationItem').val('');
        },
        function(res) {
          self.addClassId = res;
        }
      );
    } else {
      Toast('请输入要添加分类的内容', 2);
    }
  },
  uploadCoverPic: function(e) {
    var self = this,
      $tar = $(e.target),
      maxAddPics = 5 - $tar.parents('#pictureBox').find('img').length;
    upload = new ChooseImage({
      multiSelect: !0,
      onSubmit: function(data) {
        if (data.length > maxAddPics) {
          Toast('封面图片数量最多为五张！', 2);
        } else {
          for (var i = 0; i < data.length; i++) {
            var html = self.html,
              imgSrc = data[i].src,
              sizePicId = $tar.attr('id');
            if (data.length == 5) {
              $('.upload_box', '#pictureBox')
                .not('.upload_wrap_change ')
                .addClass('hideEle');
            }
            $('.pic_icon')
              .css('opacity', '0')
              .removeClass('tip_icon_error');
            var img = document.createElement('img');
            img.src = imgSrc;
            var PicsSpan = document.createElement('span');
            PicsSpan.setAttribute(
              'class',
              'glyphicon glyphicon-remove-circle delPic'
            );
            PicsSpan.setAttribute(
              'style',
              'position:absolute;right:3px;color:rgb(212, 106, 64);'
            );
            var length = $tar
              .parents('.upload_box')
              .find('img')
              .not(img)
              .remove().length;
            var modihtml = html
              .replace(/coverPic0/, 'coverPic' + self.PicId++)
              .replace(/data-id="uploadCover"/, '');
            if (length == 0) {
              $('.upload_wrap').prepend(modihtml);
            }
            $('#coverPic' + ++self.PicssId)
              .removeClass('picture')
              .attr('type', '')
              .addClass('dpblock')
              .parents('.upload_box')
              .addClass('upload_wrap_change ui-state-default posRel')
              .append(img)
              .append(PicsSpan);
            $(img).css({
              width: '100px',
              height: '100px',
              position: 'absolute',
              top: 0,
            });
            picsImgsLen = $('.upload_wrap').find('img').length;
            if (picsImgsLen == 5) {
              $('.upload_box', '#pictureBox')
                .not('.upload_wrap_change ')
                .addClass('hideEle');
            }
          }
        }
      },
    });
    upload.show();
  },
  delPic: function(e) {
    var self = this,
      $tar = $(e.target);
    $tar.parents('.upload_box').remove();
    var picsLen = $('.upload_wrap').find('img').length;
    if (picsLen == 4) {
      $('.upload_box', '#pictureBox')
        .not('.upload_wrap_change ')
        .removeClass('hideEle');
    }
  },
  focusMyEditor: function(e) {
    $('#myEditor').focus();
  },
  generateRandom: function(e) {
    var $tar = $(e.target);
    e.preventDefault();
    var randomList =
      '5,5,5,5.55,5.88,6,6,6.66,6.68,6.88,7.77,8,8.88,9.66,9.99,10,10,10,10,10.01,10.88,11.11,13.14,13.88,15.68,16,16.66,16.88,18,18.18,18.88,19.19,19.88,20,20,20,20.66,22,22.22,25.55,26.66,26.88,28,28.88,33.33,36,38.88,46.66,49.99,50,66.66,68.68,88.88,99.99,100,108,168';
    $('#suixiInput').val(randomList);
    $tar.addClass('hide');
    $('#autoFinishSwitch').bootstrapSwitch({
      size: 'mini',
      onText: '开',
      offText: '关',
      onColor: 'primary',
      offColor: 'info',
      state: true,
      onSwitchChange: function() {},
    });
    $('#autoFinishSwitch').bootstrapSwitch('state', true);
    $tar.next().removeClass('hide');
  },
  detectSuixiInput: function(e) {
    var $tar = $(e.target);
    var get_val = $tar.val();
    var showRandom =
      get_val.toString().indexOf(',') + get_val.toString().indexOf('，');
    if (showRandom > -2) {
      $tar.next().addClass('hide');
      $('#autoFinishSwitch').bootstrapSwitch({
        size: 'mini',
        onText: '开',
        offText: '关',
        onColor: 'primary',
        offColor: 'info',
        state: true,
        onSwitchChange: function() {},
      });
      $tar
        .next()
        .next()
        .removeClass('hide');
    } else {
      $tar.next().removeClass('hide');
      $tar
        .next()
        .next()
        .addClass('hide');
      $('#autoFinishSwitch').bootstrapSwitch('destroy');
    }
  },
  blurSuixiInput: function(e) {
    var self = this;
    var $tar = $(e.target),
      get_val = $tar.val();
    if (get_val != '') {
      var suixi_match_right = get_val
        .toString()
        .match(myRegExp.suixi_price_right);
      if (suixi_match_right) {
      } else {
        Toast('支付金额格式出错，请以逗号分隔数字', 2);
        self.addRedBorder($tar);
      }
    }
  },
  showSuixiInput: function(e) {
    var $suixiInput = $('#suixiInput').parents('.form-group'),
      $generateRandom = $('#generateRandom'),
      suixiInputVal = $('#suixiInput').val(),
      showRandom = suixiInputVal.indexOf(',') + suixiInputVal.indexOf('，');
    $(e.target).prop('checked') == true
      ? $suixiInput.removeClass('hide')
      : $suixiInput.addClass('hide');
    if (showRandom > -2) {
      $generateRandom.addClass('hide');
    } else {
      $(e.target).prop('checked') == true
        ? $generateRandom.removeClass('hide')
        : $generateRandom.addClass('hide');
    }
  },
  hideSuixiInput: function(e) {
    var $suixiInput = $('#suixiInput').parents('.form-group'),
      $generateRandom = $('#generateRandom');
    $(e.target).prop('checked') == true
      ? $suixiInput.addClass('hide')
      : $suixiInput.removeClass('hide');
    $(e.target).prop('checked') == true
      ? $generateRandom.addClass('hide')
      : $generateRandom.removeClass('hide');
  },
  showSubSetModal: function(e) {
    var $relatedTarget = $(e.relatedTarget),
      $tar = $(e.target),
      $subEndTime = $('#sub-end-time'),
      $subSetModal = $('#sub-set-modal');
    if ($tar.get(0) === $subEndTime.get(0)) {
      return;
    }
    var self = this,
      cid = $relatedTarget.attr('data-cid'),
      curSubModal = self.sizes.get(cid),
      $saveSubSet = $('#save-sub-set'),
      $subSetModalTitle = $('#sub-set-modal-title'),
      name = curSubModal.get('name'),
      endTime = curSubModal.get('endTime'),
      enrollNum = curSubModal.get('enroll_num'),
      subType = curSubModal.get('subdivide_type');
    $saveSubSet.attr('data-cid', cid);
    $subSetModalTitle.text('选择项设置：' + name);
    $subEndTime.val(endTime);
    $('[name="sub-enroll-limit"][value="' + enrollNum + '"]').prop(
      'checked',
      true
    );
    var $durationTimeFormGroup = $('#sub-duration-time-form-group');
    var $durationTimeNum = $('#sub-duration-time-num');
    var $durationTimeUnit = $('#sub-duration-time-unit');
    var durationDay = curSubModal.get('durationDay');
    var durationTimeNum = null;
    var durationTimeUnit = null;
    if (durationDay < 30) {
      durationTimeUnit = 'day';
      durationTimeNum = durationDay;
    } else if (durationDay < 365) {
      durationTimeUnit = 'month';
      durationTimeNum = Math.ceil(durationDay / 30);
    } else {
      durationTimeUnit = 'year';
      durationTimeNum = Math.ceil(durationDay / 365);
    }
    $durationTimeFormGroup.show();
    $durationTimeNum.val(durationTimeNum);
    $durationTimeUnit.selectpicker('val', durationTimeUnit);
  },
  onClickSaveSubSet: function(e) {
    var $tar = $(e.target),
      $modal = $('#sub-set-modal'),
      self = this,
      cid = $tar.attr('data-cid'),
      curSubModal = self.sizes.get(cid),
      subType = curSubModal.get('subdivide_type'),
      verifyObj = {
        value: true,
        reason: '',
      };
    var $endTime = $('#sub-end-time'),
      endTime = $endTime.val();
    var enrollNum = parseInt($('[name="sub-enroll-limit"]:checked').val());
    var durationTimeNum = $('#sub-duration-time-num').val();
    var durationTimeUnit = $('#sub-duration-time-unit').val();
    var durationDay = null;
    if (durationTimeNum === '' || durationTimeNum === '0') {
      durationDay = 0;
    } else {
      if (isNaN(parseInt(durationTimeNum, 10))) {
        verifyObj.value = false;
        verifyObj.reason = '供奉时长应为整数';
      } else {
        if (durationTimeUnit == 'day') {
          if (durationTimeNum < 1 || durationTimeNum > 30) {
            verifyObj.value = false;
            verifyObj.reason = '天数应为1-30';
          } else {
            durationDay = durationTimeNum;
          }
        } else if (durationTimeUnit == 'month') {
          if (durationTimeNum < 1 || durationTimeNum > 12) {
            verifyObj.value = false;
            verifyObj.reason = '月份应为1-12';
          } else {
            durationDay = durationTimeNum * 30;
          }
        } else if (durationTimeUnit == 'year') {
          if (durationTimeNum < 1 || durationTimeNum > 20) {
            verifyObj.value = false;
            verifyObj.reason = '年份应为1-20';
          } else {
            durationDay = durationTimeNum * 365;
          }
        }
      }
    }
    if (verifyObj.value) {
      curSubModal.set('endTime', endTime);
      curSubModal.set('enroll_num', enrollNum);
      curSubModal.set('durationDay', durationDay);
      $modal.modal('hide');
    } else {
      Toast(verifyObj.reason, 2);
    }
  },
  showSizeBox: function(e) {
    var self = this;
    e.preventDefault();
    var sizeBox = $('#proStyle').parents('.form-group'),
      addBox = $('#proStyleBtn')
        .parents('div')
        .prev()[0];
    addBox.innerHTML = '';
    if (sizeBox.hasClass('hide')) {
      if (self.sizes.length == 0) {
        self.sizes.add(new SizeModel({}));
        self.sizesView.render();
      }
      self.sizesView.render();
      $('#proStore,#needPay')
        .parents('.form-group')
        .hide();
      $('#generateRandom')
        .parents('.form-group')
        .addClass('hide');
      sizeBox.removeClass('hide');
    } else {
      self.sizes.add(new SizeModel({}));
      self.sizesView.render();
    }
    self.selection_change_printer_text(1);
  },
  onChangeSubType: function(e) {
    var self = this,
      $tar = $(e.target),
      subType = $tar.val();
    e.preventDefault();
  },
  proName: function(e) {
    var titleLen = $('#proName').val().length;
    if (titleLen > 30) {
      $('#proName')
        .nextAll('.nullError_msg')
        .removeClass('hide');
    } else {
      $('#proName')
        .nextAll('.nullError_msg')
        .addClass('hide');
    }
  },
  setProValue: function(e) {
    var self = this,
      $tar = $(e.target),
      value = $tar.val(),
      cid = $tar.attr('data-cid');
    if ($tar.hasClass('proSizeName')) {
      if (value != '') {
        $tar.parents('.ui-state-default').removeClass('has-error');
      } else {
        $tar.parents('.ui-state-default').addClass('has-error');
      }
      self.sizes.get(cid).set('name', value);
    } else if ($tar.hasClass('proPrice')) {
      var isAutoFinish = $tar.attr('data-isAutoFinish');
      self.sizes.get(cid).set('price', value);
      $tar.prev().addClass('hide');
      if (value != '') {
        var suixi_match_right = value
          .toString()
          .match(myRegExp.suixi_price_right);
        if (suixi_match_right) {
          if (
            suixi_match_right[0].indexOf(',') +
              suixi_match_right[0].indexOf(',') ===
            -2
          ) {
            self.sizes.get(cid).set('isSingleMoney', 1);
          } else {
            self.sizes.get(cid).set('isSingleMoney', 0);
          }
        } else {
          self.sizes.get(cid).set('isSingleMoney', 1);
          Toast(
            '选择项支付金额格式出错，请以逗号分隔数字且无其它无关字符出现',
            2
          );
          self.addRedBorder($tar);
        }
      } else {
        self.sizes.get(cid).set('isSingleMoney', 1);
      }
    } else if ($tar.hasClass('proStock')) {
      self.sizes.get(cid).set('stock', value);
    }
  },
  showRandomPrice: function(e) {
    var $tar = $(e.target),
      inputValue = $tar.val().toString();
    e.preventDefault();
    var ifHide = inputValue.indexOf(',') + inputValue.indexOf('，');
    if (ifHide > -2) {
      $tar
        .prev()
        .prev()
        .removeClass('hide');
      $tar.prev().addClass('hide');
    } else {
      $tar.prev().removeClass('hide');
      $tar
        .prev()
        .prev()
        .addClass('hide');
    }
  },
  generateRandomPrice: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.next().attr('data-cid');
    e.preventDefault();
    var randomList =
      '5,5,5,5.55,5.88,6,6,6.66,6.68,6.88,7.77,8,8.88,9.66,9.99,10,10,10,10,10.01,10.88,11.11,13.14,13.88,15.68,16,16.66,16.88,18,18.18,18.88,19.19,19.88,20,20,20,20.66,22,22.22,25.55,26.66,26.88,28,28.88,33.33,36,38.88,46.66,49.99,50,66.66,68.68,88.88,99.99,100,108,168';
    $tar.next().val(randomList);
    self.sizes.get(cid).set('price', randomList);
    self.sizes.get(cid).set('isAutoFinish', 1);
    self.sizes.get(cid).set('isSingleMoney', 0);
    var uploadBox = $tar.parents('tr').find('.upload_box');
    if (uploadBox.hasClass('upload_wrap_change')) {
    } else {
      var img = document.createElement('img');
      if (self.locationBc === 0) {
        img.src =
          'https://pic.zizaihome.com/e0898a9c-23a1-11e9-9b75-00163e0c001e.jpg';
      } else if (self.locationBc === 1) {
        img.src =
          'https://pic.zizaihome.com/e0898a9c-23a1-11e9-9b75-00163e0c001e.jpg';
      } else if (self.locationBc === 2) {
        img.src =
          'https://pic.zizaihome.com/e0898a9c-23a1-11e9-9b75-00163e0c001e.jpg';
      }
      if (cid.length > 0) {
        self.sizes.get(cid).set('pic', img.src);
      }
      var top = 0;
      $(img).css({
        width: '50px',
        height: '50px',
        'z-index': '-1',
        position: 'absolute',
        top: top,
      });
      if ($('.rePos').length != 0) {
        var right = -$('.rePos')
          .eq(0)
          .position().left;
        $('.delSmallPic').css('right', right);
      }
      uploadBox.addClass('upload_wrap_change');
    }
  },
  autoFinishOrder: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar
        .parent()
        .next()
        .next()
        .attr('data-cid');
    $tar
      .parent()
      .find('input.autoFinishSwitch')
      .bootstrapSwitch('toggleState');
  },
  changeIfSingleMoney: function(e) {
    var self = this,
      $tar = $(e.target);
    var get_val = $tar.val();
    var showRandom =
      get_val.toString().indexOf(',') + get_val.toString().indexOf('，');
    if (showRandom > -2) {
      ifSingleMoney = !1;
    } else {
      ifSingleMoney = !0;
    }
  },
  detectRandom: function(e) {
    var self = this,
      $tar = $(e.target);
    var get_val = $tar.val();
    var cid = $tar.attr('data-cid');
    var showRandom =
      get_val.toString().indexOf(',') + get_val.toString().indexOf('，');
    self.sizes.get(cid).set('price', get_val);
    if (showRandom > -2) {
      $tar.prev().addClass('hide');
      $tar
        .prev()
        .prev()
        .removeClass('hide');
      if (ifSingleMoney) {
        $tar
          .prev()
          .prev()
          .find('.autoFinishSwitch')
          .bootstrapSwitch('state', true);
      }
      self.sizes.get(cid).set(
        'isAutoFinish',
        Number(
          $tar
            .prev()
            .prev()
            .find('.autoFinishSwitch')
            .bootstrapSwitch('state')
        )
      );
    } else {
      $tar.prev().removeClass('hide');
      $tar
        .prev()
        .prev()
        .addClass('hide');
      self.sizes.get(cid).set('isAutoFinish', 0);
    }
  },
  showSuixiRandomPrice: function(e) {
    var $tar = $(e.target),
      inputValue = $tar.val().toString();
    e.preventDefault();
    var ifHide = inputValue.indexOf(',') + inputValue.indexOf('，');
    if (ifHide > -2) {
      $tar.next().addClass('hide');
    } else {
      $tar.next().removeClass('hide');
    }
  },
  uploadSmallPic: function(e) {
    var self = this;
    var $tar = $(e.target);
    upload = new ChooseImage({
      multiSelect: !1,
      onSubmit: function(data) {
        var img = document.createElement('img');
        img.src = data[0].src;
        var cid = $tar.attr('data-cid');
        if (cid.length > 0) {
          self.sizes.get(cid).set('pic', img.src);
        }
        $(img).css({
          width: '50px',
          height: '50px',
          'z-index': '-1',
          position: 'absolute',
          top: 0,
        });
        if ($('.rePos').length != 0) {
          var right = -$('.rePos')
            .eq(0)
            .position().left;
          $('.delSmallPic').css('right', right);
        }
      },
    });
    upload.show();
  },
  delSmallPic: function(e) {
    var self = this,
      $tar = $(e.target);
    e.preventDefault();
    var cid = $tar
      .prev()
      .prev()
      .attr('data-cid');
    self.sizes.get(cid).set('pic', '');
    self.sizesView.render();
    $tar.prev().remove();
    $tar.parents('.upload_box').removeClass('upload_wrap_change');
    $tar.remove();
    if ($('.rePos').length != 0) {
      var right = -$('.rePos')
        .eq(0)
        .position().left;
      $('.delSmallPic').css('right', right);
    }
  },
  copyProSize: function(e) {
    $('.proSizeName').blur();
    var $tar = $(e.target),
      cid = $tar.data('cid'),
      self = this;
    var currentSize = self.sizes.get(cid).clone();
    if (typeof self.sizes.get(cid).attributes.postScript == 'undefined') {
      currentSize['attributes']['postScript'] = undefined;
      currentSize['attributes']['id'] = '';
      currentSize['attributes']['printer'] = [];
      var newCid = currentSize['cid'];
      self.sizes.add(currentSize);
      self.sizesView.render();
      self.sizePostscript[newCid] = newSizeModelPostscript;
    } else {
      var currentPostscript = self.sizes.get(cid).attributes.postScript.clone();
      var currentPostscriptModels = currentPostscript.models,
        currentPostscriptModelsLen = currentPostscriptModels.length;
      for (var i = 0; i < currentPostscriptModelsLen; i++) {
        var postCid = currentPostscriptModels[0]['cid'];
        var getPostscriptModel = null;
        getPostscriptModel = currentPostscript.get(postCid);
        getPostscriptModel['id'] = '';
        var newPostScriptModel = getPostscriptModel.clone();
        currentPostscript.shift(postCid);
        currentPostscript.push(newPostScriptModel);
      }
      var newSizeModelPostscript = new sizesAdditionCollection(
        currentPostscriptModels
      );
      currentSize['attributes']['postScript'] = newSizeModelPostscript;
      currentSize['attributes']['id'] = '';
      currentSize['attributes']['printer'] = [];
      var newCid = currentSize['cid'];
      self.sizes.add(currentSize);
      self.sizesView.render();
      self.sizePostscript[newCid] = newSizeModelPostscript;
    }
    if ($('.rePos').length != 0) {
      var right = -$('.rePos')
        .eq(0)
        .position().left;
      $('.delSmallPic').css('right', right);
    }
  },
  removeProSize: function(e) {
    var $tar = $(e.target),
      cid = $tar.data('cid'),
      self = this,
      sizeTr = $('#sizeBox').find('tr').length;
    $.confirm({
      title: false,
      content: '你确定删除吗?',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            if (cid.length > 0) {
              self.sizes.remove(cid);
              if (self.sizes.length >= 1) {
                self.sizesView.render();
              } else {
                var sizeBox = $('#proStyle').parents('.form-group');
                $('#proStore,#needPay')
                  .parents('.form-group')
                  .show();
                if ($('#needPay').prop('checked') == true) {
                  $('#generateRandom')
                    .parents('.form-group')
                    .removeClass('hide');
                }
                sizeBox.addClass('hide');
              }
            }
            if (sizeTr == 1) {
              var addBox = $('#proStyleBtn')
                .parents('div')
                .prev()[0];
              addBox.innerHTML =
                '选择项&nbsp;' +
                '<i class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" ' +
                'title="可添加信众参与的选项">' +
                '</i>：&nbsp;';
              $(addBox)
                .find('[data-toggle="tooltip"]')
                .tooltip();
              self.show_printer_type && (self.show_printer_type = null);
              self.show_printer_id = 0;
              self.selection_change_printer_text(0);
            }
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  sizesAddAddition: function(e) {
    var self = this;
    e.preventDefault();
    var subCid = $('#sizesPostModal').attr('data-sub-cid'),
      subModel = self.sizes.get(subCid),
      subType = subModel.get('subdivide_type');
    self.sizesAddition = new sizesAdditionCollection([
      new sizesAdditionModel({
        subType: subType,
      }),
    ]);
    self.sizesAdditionView = new SizesAdditionsView({
      el: '#sizesAdditionBox',
      model: self.sizesAddition,
    });
    self.sizesAdditionView.render();
    $('#sizesAdditionTable,#sizesAddAdditionItem')
      .parents('.form-group')
      .css('display', 'block')
      .removeClass('hide');
    $('#sizesAddAddition')
      .parents('.form-group')
      .css('display', 'none')
      .addClass('hide');
  },
  sizesAddAdditionItem: function(e) {
    var self = this;
    e.preventDefault();
    var subCid = $('#sizesPostModal').attr('data-sub-cid'),
      subModel = self.sizes.get(subCid),
      subType = subModel.get('subdivide_type');
    self.sizesAddition.add(
      new sizesAdditionModel({
        subType: subType,
      })
    );
    var curSizesAddition = self.sizesAddition,
      curSizesAdditionModels = curSizesAddition.models,
      curSizesAdditionModelsLen = curSizesAdditionModels.length;
    for (var i = 0; i < curSizesAdditionModelsLen; i++) {
      var postCid = curSizesAdditionModels[0]['cid'];
      var getPostscriptModel = null;
      getPostscriptModel = curSizesAddition.get(postCid);
      var newPostScriptModel = getPostscriptModel.clone();
      curSizesAddition.shift(postCid);
      curSizesAddition.push(newPostScriptModel);
    }
    self.sizesAddition = new sizesAdditionCollection(curSizesAddition.models);
    self.sizesAdditionView = new SizesAdditionsView({
      el: '#sizesAdditionBox',
      model: self.sizesAddition,
    });
    self.sizesAdditionView.render();
  },
  showSizesPostModal: function(e) {
    var $relatedTarget = $(e.relatedTarget),
      self = this,
      cid = $relatedTarget.attr('data-cid');
    $('.proSizeName').blur();
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.sizes.get(cid),
        name = model.get('name');
      $('#sizesPostModal').attr('data-sub-cid', cid);
      $('#sizeName').text(
        '选择项：' + name + ' (假如需要用户下单时填写信息，请在此处添加)'
      );
      if (self.sizes.get(cid).get('postScript')) {
        self.sizePostscript[cid] = self.sizes.get(cid).get('postScript');
        var sizesPostScript = self.sizePostscript[cid];
      }
      $('.saveAdd').attr('data-cid', cid);
      if (sizesPostScript) {
        var getSizesAddition = sizesPostScript,
          getSizesAdditionModels = getSizesAddition.models,
          getSizesAdditionModelsLen = getSizesAdditionModels.length;
        self.sizesAddition = new sizesAdditionCollection(
          getSizesAddition.models
        );
        self.sizesAdditionView = new SizesAdditionsView({
          el: '#sizesAdditionBox',
          model: self.sizesAddition,
        });
        self.sizesAdditionView.render();
        $('#sizesAdditionTable,#sizesAddAdditionItem')
          .parents('.form-group')
          .css('display', 'block')
          .removeClass('hide');
        $('#sizesAddAddition')
          .parents('.form-group')
          .css('display', 'none')
          .addClass('hide');
      } else {
        $('#sizesAdditionTable,#sizesAddAdditionItem')
          .parents('.form-group')
          .css('display', 'none')
          .addClass('hide');
        $('#sizesAddAddition')
          .parents('.form-group')
          .css('display', 'block')
          .removeClass('hide');
      }
    }
  },
  saveSizeInputSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid'),
      subCid = $('#sizesPostModal').attr('data-sub-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var subModel = self.sizes.get(subCid),
        subType = subModel.get('subdivide_type'),
        model = self.sizesAddition.get(cid),
        inputType = model.get('inputType'),
        isMust = parseInt($('input[name=inputSizeRequire]:checked').val()),
        placeholder = $('#inputSizePlaceholder').val(),
        describtion = $('#inputSizeDescribtion').val();
      if (inputType == 5) {
        var isVerify = parseInt($('input[name=sizeTelVerify]:checked').val());
        model.set('isVerify', isVerify);
      } else {
        model.set('isVerify', 0);
      }
      if (
        (subType == 2 && inputType == 11) ||
        (subType == 3 && inputType == 12)
      ) {
        var maxNameNum = parseInt($('#sizesInputMaxNameNum').val());
        model.set('pic_num', maxNameNum);
      }
      if (
        (subType == 2 && (inputType == 10 || inputType == 11)) ||
        (subType == 3 && inputType == 12)
      ) {
        var nameWordLimit = parseInt($('#sizesInputNameWordLimit').val());
        model.set('font_length', nameWordLimit);
      }
      if (subType == 3 && inputType == 15) {
        var qiFuWishWordLimit = parseInt(
          $('#sizesInputQiFuWishWordLimit').val()
        );
        model.set('font_length', qiFuWishWordLimit);
      }
      if (inputType == 15 && subType != 3) {
        var wishWordLimit = parseInt($('#sizesInputWishWordLimit').val());
        model.set('font_length', wishWordLimit);
      }
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      model.set('prompt_text', placeholder);
      model.set('describe', describtion);
      $('#inputSizeAdditionModal').modal('hide');
    }
  },
  saveSizeDateSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.sizesAddition.get(cid),
        isMust = parseInt($('input[name=dateSizeRequired]:checked').val()),
        dateRange = parseInt($('input[name=dateSizeRange]:checked').val()),
        describtion = $('#dateSizeDescribtion').val();
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      dateRange == 0 || dateRange == 1
        ? model.set('dataType', ++dateRange)
        : alert('dateRange has error');
      model.set('describe', describtion);
      $('#dateSizeAdditionModal').modal('hide');
    }
  },
  saveSizeSelectSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.sizesAddition.get(cid),
        isMust = parseInt($('input[name=selectSizeRequire]:checked').val()),
        dataType = parseInt($('input[name=selectSizeType]:checked').val()),
        selectInput = $('#selectSizeTextarea').val(),
        describtion = $('#selectSizeDescribtion').val();
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      dataType == 0 || dataType == 1
        ? model.set('dataType', dataType)
        : alert('dataType has error');
      model.set('describe', describtion);
      if (selectInput == '') {
        var selectInputArr = [];
      } else {
        selectInput = selectInput.split('\n');
        selectInput = _.compact(selectInput);
        var selectInputArr = [];
        _.each(selectInput, function(item, index) {
          if (editType == 2 || editType == 3) {
            selectInputArr.push(item);
          } else {
            selectInputArr.push(item);
          }
        });
      }
      model.set('selectInput', selectInputArr);
      $('#selectSizeAdditionModal').modal('hide');
    }
  },
  saveSizeInstructSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.sizesAddition.get(cid),
        instruction = $('#sizeInstruction').val(),
        describtion = $('#sizeInstructionDescribtion').val();
      model.set('prompt_text', instruction);
      model.set('describe', describtion);
      $('#instuctSizeAdditionModal').modal('hide');
    }
  },
  saveSizeImagesSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.sizesAddition.get(cid),
        isMust = parseInt($('input[name=imagesSizeRequire]:checked').val()),
        maxUploadNum = parseInt($('#inputImagesSizeUploadNum').val()),
        describtion = $('#imagesSizeDescribtion').val();
      if (maxUploadNum < 1) {
        Toast('最大上传数必须大于0', 2);
        return false;
      } else if (maxUploadNum > 10) {
        Toast('最大上传数必须小于11', 2);
        return false;
      }
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      model.set('pic_num', maxUploadNum);
      model.set('describe', describtion);
      $('#imagesSizeAdditionModal').modal('hide');
    }
  },
  saveSizeRadioSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.sizesAddition.get(cid),
        isMust = parseInt($('input[name=radioSizeRequired]:checked').val()),
        describtion = $('#radioSizeDescribtion').val();
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      model.set('describe', describtion);
      $('#radioSizeAdditionModal').modal('hide');
    }
  },
  showSizeAdditionModal: function(e) {
    var $relatedTarget = $(e.relatedTarget),
      $tar = $(e.target),
      self = this,
      subCid = $('#sizesPostModal').attr('data-sub-cid'),
      cid = $relatedTarget.attr('data-cid'),
      cur_title = $tar.find('.modal-title');
    if (typeof cid == 'string' && cid.length > 0) {
      var subModal = self.sizes.get(subCid),
        subType = subModal.get('subdivide_type'),
        model = self.sizesAddition.get(cid),
        inputType = model.get('inputType'),
        isMust = model.get('is_must'),
        placeholder = model.get('prompt_text'),
        describtion = model.get('describe'),
        dataType = model.get('dataType'),
        selectInput = model.get('selectInput'),
        picNum = model.get('pic_num'),
        font_length = model.get('font_length'),
        isVerify = model.get('isVerify'),
        cur_addition_name = config.argument.addition_list[inputType];
      cur_title.text(cur_addition_name + '设置');
      $('#saveSizeInputSetting').attr('data-cid', cid);
      $('#saveSizeDateSetting').attr('data-cid', cid);
      $('#saveSizeSelectSetting').attr('data-cid', cid);
      $('#saveSizeInstructSetting').attr('data-cid', cid);
      $('#saveSizeImagesSetting').attr('data-cid', cid);
      $('#saveSizeRadioSetting').attr('data-cid', cid);
      if (isMust == 1) {
        $('#selectSizeRequired').prop('checked', true);
        $('#sizesInputRequired').prop('checked', true);
        $('#dateSizeRequired').prop('checked', true);
        $('#radioSizeRequired').prop('checked', true);
        $('#imagesSizeRequired').prop('checked', true);
        $('#selectSizeUnRequired').prop('checked', false);
        $('#sizesInputUnRequired').prop('checked', false);
        $('#dateSizeUnRequired').prop('checked', false);
        $('#radioSizeUnRequired').prop('checked', false);
        $('#imagesSizeUnRequired').prop('checked', false);
      } else if (isMust == 0) {
        $('#selectSizeRequired').prop('checked', false);
        $('#sizesInputRequired').prop('checked', false);
        $('#dateSizeRequired').prop('checked', false);
        $('#radioSizeRequired').prop('checked', false);
        $('#imagesSizeRequired').prop('checked', false);
        $('#selectSizeUnRequired').prop('checked', true);
        $('#sizesInputUnRequired').prop('checked', true);
        $('#dateSizeUnRequired').prop('checked', true);
        $('#radioSizeUnRequired').prop('checked', true);
        $('#imagesSizeUnRequired').prop('checked', true);
      } else {
        alert('isMust has error');
      }
      if (inputType == 2 || inputType == 9) {
        if (dataType == 2) {
          $('#dateSizeAll').prop('checked', true);
          $('#dateSizeToFuture').prop('checked', false);
        } else if (dataType == 1) {
          $('#dateSizeAll').prop('checked', false);
          $('#dateSizeToFuture').prop('checked', true);
        } else {
        }
      }
      if (inputType == 3) {
        if (dataType == 0) {
          $('#singleSizeSelect').prop('checked', true);
        } else {
          $('#multiSizeSelect').prop('checked', true);
        }
      }
      if (inputType == 5) {
        $('[name="sizeTelVerify"][value="' + isVerify + '"]').prop(
          'checked',
          true
        );
        $('[data-ele="size-tel-verify-form-group"]').removeClass('hide');
        var isSubPs = 1;
        self.initTelPsVerifyMsg(isSubPs, isVerify);
      } else {
        $('[name="sizeTelVerify"][value="' + 0 + '"]').prop('checked', true);
        $('[data-ele="size-tel-verify-form-group"]').addClass('hide');
        $('#size-input-required-form-group').show();
      }
      if (typeof placeholder == 'string' && placeholder.length > 0) {
        $('#inputSizePlaceholder').val(placeholder);
      } else {
        $('#inputSizePlaceholder').val('');
      }
      if (typeof describtion == 'string' && describtion.length > 0) {
        $('#inputSizeDescribtion').val(describtion);
        $('#dateSizeDescribtion').val(describtion);
        $('#selectSizeDescribtion').val(describtion);
        $('#sizeInstructionDescribtion').val(describtion);
        $('#imagesSizeDescribtion').val(describtion);
        $('#radioSizeDescribtion').val(describtion);
      } else {
        $('#inputSizeDescribtion').val('');
        $('#dateSizeDescribtion').val('');
        $('#selectSizeDescribtion').val('');
        $('#sizeInstructionDescribtion').val('');
        $('#imagesSizeDescribtion').val('');
        $('#radioSizeDescribtion').val('');
      }
      if (inputType == 13) {
        $('#sizeInstruction').val(placeholder);
      }
      if (inputType == 14) {
        $('#inputImagesSizeUploadNum').val(picNum);
      }
      if (typeof selectInput == 'object' && selectInput.length > 0) {
        var my_input = '';
        for (var i = 0; i < selectInput.length; i++) {
          my_input += selectInput[i] + '\n';
        }
        $('#selectSizeTextarea').val(my_input);
      } else {
        $('#selectSizeTextarea').val('');
      }
      var $sizesInputRequired = $('#sizesInputRequired'),
        $sizesInputRequiredFormGroup = $sizesInputRequired.parents(
          '.form-group'
        );
      if (
        (subType == 2 && (inputType == 10 || inputType == 11)) ||
        (subType == 3 && inputType == 12)
      ) {
        $sizesInputRequiredFormGroup.addClass('hide');
      } else {
        $sizesInputRequiredFormGroup.removeClass('hide');
      }
      var $sizesInputMaxNameNum = $('#sizesInputMaxNameNum'),
        $sizesInputMaxNameNumFormGroup = $sizesInputMaxNameNum.parents(
          '.form-group'
        );
      if (
        (subType == 2 && inputType == 11) ||
        (subType == 3 && inputType == 12)
      ) {
        $sizesInputMaxNameNum.val(picNum);
        $sizesInputMaxNameNumFormGroup.removeClass('hide');
      } else {
        $sizesInputMaxNameNumFormGroup.addClass('hide');
      }
      var $sizesInputNameWordLimit = $('#sizesInputNameWordLimit'),
        $sizesInputNameWordLimitFormGroup = $sizesInputNameWordLimit.parents(
          '.form-group'
        );
      if (
        (subType == 2 && (inputType == 10 || inputType == 11)) ||
        (subType == 3 && inputType == 12)
      ) {
        $sizesInputNameWordLimit.val(font_length);
        $sizesInputNameWordLimitFormGroup.removeClass('hide');
      } else {
        $sizesInputNameWordLimitFormGroup.addClass('hide');
      }
      var $sizesInputQiFuWishWordLimit = $('#sizesInputQiFuWishWordLimit'),
        $sizesInputQiFuWishWordLimitFormGroup = $sizesInputQiFuWishWordLimit.parents(
          '.form-group'
        );
      if (subType == 3 && inputType == 15) {
        $sizesInputQiFuWishWordLimit.val(font_length);
        $sizesInputQiFuWishWordLimitFormGroup.removeClass('hide');
      } else {
        $sizesInputQiFuWishWordLimitFormGroup.addClass('hide');
      }
      var $sizesInputWishWordLimit = $('#sizesInputWishWordLimit'),
        $sizesInputWishWordLimitFormGroup = $sizesInputWishWordLimit.parents(
          '.form-group'
        );
      if (inputType == 15 && subType != 3) {
        $sizesInputWishWordLimit.val(font_length);
        $sizesInputWishWordLimitFormGroup.removeClass('hide');
      } else {
        $sizesInputWishWordLimitFormGroup.addClass('hide');
      }
    } else {
      alert('alert cid is not exsit');
    }
  },
  closeSizePostscript: function(e) {
    var self = this;
    if (self.prepareRemovePostscriptId != '') {
      self.sizePostscript[self.prepareRemovePostscriptId] =
        self.prepareRemovePostscript;
    }
  },
  sizesAdditionRemove: function(e) {
    var $tar = $(e.target),
      cid = $tar.data('cid'),
      allCid = $('.saveAdd').attr('data-cid'),
      self = this;
    $.confirm({
      title: false,
      content: '你确定删除吗?',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            if (cid.length > 0) {
              self.sizesAddition.remove(cid);
              if (self.sizesAddition.length >= 1) {
                self.sizesAdditionView.render();
              } else {
                self.prepareRemovePostscriptId = allCid;
                self.prepareRemovePostscript = self.sizePostscript[allCid];
                self.sizePostscript[allCid] = '';
                $('#sizesAdditionTable,#sizesAddAdditionItem')
                  .parents('.form-group')
                  .css('display', 'none')
                  .addClass('hide');
                $('#sizesAddAddition')
                  .parents('.form-group')
                  .css('display', 'block')
                  .removeClass('hide');
              }
            }
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  saveAddition: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid'),
      nameFault = 0;
    if (
      $('#sizesAddAddition')
        .parents('.form-group')
        .hasClass('hide')
    ) {
      $('#sizesAdditionBox > tr').each(function(index, ele) {
        var curCid = ele.id,
          curModel = self.sizesAddition.get(curCid),
          curInputType = curModel.get('inputType'),
          getName = $(ele)
            .find('.sizeAdditionName')
            .val();
        if (getName == '' && curInputType != 13) {
          e.preventDefault();
          nameFault = 1;
          Toast('请填写附言名称！', 2);
          return false;
        } else {
          curModel.set('name', getName);
        }
      });
    }
    if (nameFault == 1) {
      return false;
    }
    var model = self.sizes.get(cid);
    if (
      $('#sizesAddAddition')
        .parents('.form-group')
        .hasClass('hide')
    ) {
      self.sizePostscript[cid] = self.sizesAddition;
      model.set('postScript', self.sizePostscript[cid]);
    }
    if (self.sizesAddition.length == 0) {
      model.attributes.postScript = self.sizePostscript[cid];
    }
    self.prepareRemovePostscriptId = '';
    self.prepareRemovePostscript = {};
    Toast('保存成功！');
    $('#sizesPostModal').modal('hide');
  },
  setSizeAdditionName: function(e) {
    var self = this,
      $tar = $(e.target),
      value = $tar.val(),
      cid = $tar.attr('data-cid');
    self.sizesAddition.get(cid).set('name', value);
    self.sizesAdditionView.render();
  },
  hideselectAdditionModal: function(e) {
    $('#selectTextarea').val('');
  },
  onClickSizeTelVerify: function(e) {
    var $checkedRadio = $('[name="sizeTelVerify"]:checked');
    var self = this,
      isSubPs = 1,
      isVerify = parseInt($checkedRadio.val());
    self.initTelPsVerifyMsg(isSubPs, isVerify);
  },
  addAddition: function(e) {
    var self = this;
    e.preventDefault();
    self.additionView.render();
    $('#additionTable,#addAdditionItem')
      .parents('.form-group')
      .removeClass('hide');
    $('#addAddition')
      .parents('.form-group')
      .addClass('hide');
  },
  addAdditionItem: function(e) {
    var self = this;
    e.preventDefault();
    var additionBox = $('#addAdditionItem').parents('.form-group');
    if (additionBox.hasClass('hide')) {
      if (self.additionItems.length == 0) {
        self.additionItems.add(new AdditionModel({}));
      }
      self.additionView.render();
      $('#additionTable,#addAdditionItem')
        .parents('.form-group')
        .removeClass('hide');
      additionBox.addClass('hide');
    } else {
      self.additionItems.add(new AdditionModel({}));
      self.additionView.render();
    }
  },
  showInputAdditionModal: function(e) {
    var $relatedTarget = $(e.relatedTarget),
      $tar = $(e.target),
      self = this,
      cid = $relatedTarget.attr('data-cid'),
      cur_title = $tar.find('.modal-title');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.additionItems.get(cid),
        inputType = model.get('inputType'),
        isMust = model.get('is_must'),
        isVerify = model.get('isVerify'),
        placeholder = model.get('prompt_text'),
        describetion = model.get('describe'),
        dataType = model.get('dataType'),
        selectInput = model.get('selectInput'),
        picNum = model.get('pic_num'),
        font_length = model.get('font_length'),
        cur_addition_name = config.argument.addition_list[inputType];
      cur_title.text(cur_addition_name + '设置');
      $('#saveInputSetting').attr('data-cid', cid);
      $('#saveDateSetting').attr('data-cid', cid);
      $('#saveSelectSetting').attr('data-cid', cid);
      $('#saveInstructSetting').attr('data-cid', cid);
      $('#saveImagesSetting').attr('data-cid', cid);
      $('#saveRadioSetting').attr('data-cid', cid);
      if (isMust == 1) {
        $('#selectRequired').prop('checked', true);
        $('#inputRequired').prop('checked', true);
        $('#dateRequired').prop('checked', true);
        $('#radioRequired').prop('checked', true);
        $('#imagesRequired').prop('checked', true);
        $('#selectUnRequired').prop('checked', false);
        $('#inputUnRequired').prop('checked', false);
        $('#dateUnRequired').prop('checked', false);
        $('#radioUnRequired').prop('checked', false);
        $('#imagesUnRequired').prop('checked', false);
      } else if (isMust == 0) {
        $('#selectRequired').prop('checked', false);
        $('#inputRequired').prop('checked', false);
        $('#dateRequired').prop('checked', false);
        $('#radioRequired').prop('checked', false);
        $('#imagesRequired').prop('checked', true);
        $('#selectUnRequired').prop('checked', true);
        $('#inputUnRequired').prop('checked', true);
        $('#dateUnRequired').prop('checked', true);
        $('#radioUnRequired').prop('checked', true);
        $('#imagesUnRequired').prop('checked', true);
      } else {
        alert('isMust has error');
      }
      if (typeof placeholder == 'string' && placeholder.length > 0) {
        $('#inputPlaceholder').val(placeholder);
      } else {
        $('#inputPlaceholder').val('');
      }
      if (typeof describetion == 'string' && describetion.length > 0) {
        $('#inputDescribtion').val(describetion);
        $('#dateDescribtion').val(describetion);
        $('#imagesDescribtion').val(describetion);
        $('#instructionDescribtion').val(describetion);
        $('#selectDescribtion').val(describetion);
        $('#radioDescribtion').val(describetion);
      } else {
        $('#inputDescribtion').val('');
        $('#dateDescribtion').val('');
        $('#imagesDescribtion').val('');
        $('#instructionDescribtion').val('');
        $('#selectDescribtion').val('');
        $('#radioDescribtion').val('');
      }
      if (inputType == 5) {
        $('[name="telVerify"][value="' + isVerify + '"]').prop('checked', true);
        $('[data-ele="tel-verify-form-group"]').removeClass('hide');
        var isSubPs = 0;
        self.initTelPsVerifyMsg(isSubPs, isVerify);
      } else {
        $('[name="telVerify"][value="' + 0 + '"]').prop('checked', true);
        $('[data-ele="tel-verify-form-group"]').addClass('hide');
        $('#input-required-form-group').show();
      }
      if (inputType == 2 || inputType == 9) {
        if (dataType == 2) {
          $('#dateAll').prop('checked', true);
          $('#dateToFuture').prop('checked', false);
        } else if (dataType == 1) {
          $('#dateAll').prop('checked', false);
          $('#dateToFuture').prop('checked', true);
        } else {
        }
      }
      if (inputType == 3) {
        if (dataType == 0) {
          $('#singleSelect').prop('checked', true);
        } else {
          $('#multiSelect').prop('checked', true);
        }
      }
      if (inputType == 13) {
        $('#instruction').val(placeholder);
      }
      if (inputType == 14) {
        $('#inputImagesUploadNum').val(picNum);
      }
      if (typeof selectInput == 'object' && selectInput.length > 0) {
        var my_input = '';
        for (var i = 0; i < selectInput.length; i++) {
          my_input += selectInput[i] + '\n';
        }
        $('#selectTextarea').val(my_input);
      }
      if (inputType == 15) {
        if (font_length) {
          $('#wishWordLimit').val(font_length);
        } else {
          $('#wishWordLimit').val('');
        }
        $('#wishWordLimit')
          .parent()
          .parent('div')
          .removeClass('hide');
      } else {
        $('#wishWordLimit').val('0');
        $('#wishWordLimit')
          .parent()
          .parent('div')
          .addClass('hide');
      }
    } else {
      alert('alert cid is not exsit');
    }
  },
  removeAddition: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.data('cid');
    $.confirm({
      title: false,
      content: '你确定删除吗?',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            if (cid.length > 0) {
              self.additionItems.remove(cid);
              if (self.additionItems.length >= 1) {
                self.additionView.render();
              } else {
                self.additionItems.add(new AdditionModel({}));
                $('#additionTable,#addAdditionItem')
                  .parents('.form-group')
                  .addClass('hide');
                $('#addAddition')
                  .parents('.form-group')
                  .removeClass('hide');
              }
            }
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  setAdditionName: function(e) {
    var self = this,
      $tar = $(e.target),
      value = $tar.val(),
      cid = $tar.attr('data-cid');
    if (value != '') {
      $tar.parents('.ui-state-default').removeClass('has-error');
    } else {
      $tar.parents('.ui-state-default').addClass('has-error');
    }
    self.additionItems.get(cid).set('name', value);
    self.additionItems.get(cid).isValid();
  },
  saveInputSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.additionItems.get(cid),
        isMust = parseInt($('input[name=inputRequire]:checked').val()),
        placeholder = $('#inputPlaceholder').val(),
        describtion = $('#inputDescribtion').val();
      var inputType = model.get('inputType');
      if (inputType == 15) {
        var font_length = parseInt($('#wishWordLimit').val());
        if (isNaN(font_length)) {
          font_length = 0;
        }
        model.set('font_length', font_length);
      } else {
        model.set('font_length', 0);
      }
      if (inputType == 5) {
        var isVerify = parseInt($('input[name=telVerify]:checked').val());
        model.set('isVerify', isVerify);
      } else {
        model.set('isVerify', 0);
      }
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      model.set('prompt_text', placeholder);
      model.set('describe', describtion);
      $('#inputAdditionModal').modal('hide');
    }
  },
  saveInstructSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.additionItems.get(cid),
        instruction = $('#instruction').val(),
        describtion = $('#instructionDescribtion').val();
      model.set('prompt_text', instruction);
      model.set('describe', describtion);
      $('#instuctAdditionModal').modal('hide');
    }
  },
  saveImagesSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.additionItems.get(cid),
        isMust = parseInt($('input[name=imagesRequire]:checked').val()),
        maxUploadNum = parseInt($('#inputImagesUploadNum').val()),
        describtion = $('#imagesDescribtion').val();
      if (maxUploadNum < 1) {
        Toast('最大上传数必须大于0', 2);
        return false;
      } else if (maxUploadNum > 10) {
        Toast('最大上传数必须小于11', 2);
        return false;
      }
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      model.set('pic_num', maxUploadNum);
      model.set('describe', describtion);
      $('#imagesAdditionModal').modal('hide');
    }
  },
  saveDateSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.additionItems.get(cid),
        isMust = parseInt($('input[name=dateRequire]:checked').val()),
        dateRange = parseInt($('input[name=dateRange]:checked').val()),
        describtion = $('#dateDescribtion').val();
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      dateRange == 0 || dateRange == 1
        ? model.set('dataType', ++dateRange)
        : alert('dateRange has error');
      model.set('describe', describtion);
      $('#dateAdditionModal').modal('hide');
    }
  },
  saveRadioSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.additionItems.get(cid),
        isMust = parseInt($('input[name=radioRequired]:checked').val()),
        describtion = $('#radioDescribtion').val();
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      model.set('describe', describtion);
      $('#radioAdditionModal').modal('hide');
    }
  },
  saveSelectSetting: function(e) {
    var self = this,
      $tar = $(e.target),
      cid = $tar.attr('data-cid');
    if (typeof cid == 'string' && cid.length > 0) {
      var model = self.additionItems.get(cid),
        isMust = parseInt($('input[name=selectRequire]:checked').val()),
        dataType = parseInt($('input[name=selectType]:checked').val()),
        selectInput = $('#selectTextarea').val(),
        describtion = $('#selectDescribtion').val();
      isMust == 0 || isMust == 1
        ? model.set('is_must', isMust)
        : alert('is must has error');
      dataType == 0 || dataType == 1
        ? model.set('dataType', dataType)
        : alert('dataType has error');
      model.set('describe', describtion);
      selectInput = selectInput.split('\n');
      selectInput = _.compact(selectInput);
      var selectInputArr = [];
      _.each(selectInput, function(item, index) {
        if (editType == 2 || editType == 3) {
          selectInputArr.push(item);
        } else {
          selectInputArr.push(item);
        }
      });
      model.set('selectInput', selectInputArr);
      $('#selectAdditionModal').modal('hide');
    }
  },
  onClickTelVerify: function(e) {
    var $checkedRadio = $('[name="telVerify"]:checked');
    var self = this,
      isSubPs = 0,
      isVerify = parseInt($checkedRadio.val());
    self.initTelPsVerifyMsg(isSubPs, isVerify);
  },
  onClickRechargeMsgNum: function(e) {
    window.open('/zzhadmin/volunteer_sendSMS_index/', '_blank');
  },
  onClickShowFeedbackImg: function(e) {
    const $curTar = $(e.currentTarget);
    const feedbackType = parseInt($curTar.val(), 10);
    const $feedbackImgContainer = $('#feedback-img-container');
    if (feedbackType === 0) {
      $feedbackImgContainer.hide();
    } else {
      $(`[data-ele="feedback-type"][data-type="${feedbackType}"]`).click();
      $feedbackImgContainer.show();
    }
  },
  onClickFeedbackType: function(e) {
    const $curTar = $(e.currentTarget);
    const $feedbackImg = $('#feedback-img');
    const feedbackType = parseInt($curTar.attr('data-type'), 10);
    const feedbackImgSrc = Const.feedbackImgArr.find(
      item => item.value === feedbackType
    ).src;
    $('[data-ele="feedback-type"]').removeClass('active');
    $curTar.addClass('active');
    $feedbackImg.attr('src', feedbackImgSrc);
  },
  if_feedback: function(e) {
    var $tar = $(e.target),
      cur_id = $tar.attr('id'),
      ue2 = UE.getEditor('myEditor2', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      });
    if (cur_id === 'open_feedback') {
      $('#myEditor2').removeClass('hide');
      ue2.ready(function() {
        ue2.setContent(config.template.component.pay_succ_details, false);
      });
    } else {
      $('#myEditor2').addClass('hide');
    }
  },
  enter_spcl_sub_ps: function(e) {
    var $tar = $(e.target);
    var curIndex = $tar.attr('data-index'),
      curImg = $tar.attr('data-src');
    var $container = $(
      '[data-ele="spcl-sub-ps-overview-modal-' + curIndex + '"]'
    );
    if (!!$container.length) {
      $container.stop(true).fadeIn();
      return !1;
    }
    var $container = $(
      juicer(config.template.component.spclSubPsOverview).render({
        src: curImg,
        index: curIndex,
      })
    );
    $container
      .appendTo('body')
      .stop(true)
      .fadeIn();
  },
  leave_spcl_sub_ps: function(e) {
    var $tar = $(e.target);
    var curIndex = $tar.attr('data-index');
    $('[data-ele="spcl-sub-ps-overview-modal-' + curIndex + '"]')
      .stop(true)
      .fadeOut();
  },
  onClickSummaryArea: function(e) {
    var $curTar = $(e.currentTarget),
      value = parseInt($curTar.val(), 10);
    var $summaryAreaTypeContainer = $(
        '[data-ele="summary-area-type-container"]'
      ),
      $summaryAreaType = $('[data-ele="summary-area-type"]'),
      $summaryAreaType1 = $('[data-ele="summary-area-type"][data-type="1"]'),
      $summaryAreaSet = $('[data-ele="summary-area-set"]'),
      $summaryAreaSet2 = $('[data-ele="summary-area-set"][data-type="2"]'),
      $targetAmount = $('#target-amount');
    if (value) {
      $summaryAreaTypeContainer.show();
      $summaryAreaType.removeClass('active');
      $summaryAreaType1.addClass('active');
      $summaryAreaSet2.hide();
    } else {
      $summaryAreaTypeContainer.hide();
    }
  },
  onClickSummaryAreaType: function(e) {
    var $curTar = $(e.currentTarget),
      type = parseInt($curTar.attr('data-type'), 10);
    var $summaryAreaTypeContainer = $(
        '[data-ele="summary-area-type-container"]'
      ),
      $summaryAreaType = $('[data-ele="summary-area-type"]'),
      $summaryAreaType2 = $('[data-ele="summary-area-type"][data-type="2"]'),
      $summaryAreaSet = $('[data-ele="summary-area-set"]'),
      $summaryAreaSet2 = $('[data-ele="summary-area-set"][data-type="2"]'),
      $targetAmount = $('#target-amount');
    $summaryAreaType.removeClass('active');
    $curTar.addClass('active');
    if (type === 2) {
      $targetAmount.val('');
      $summaryAreaSet2.show();
    } else {
      $summaryAreaSet2.hide();
    }
  },
  selectPrinter: function(e) {
    var self = this,
      $tar = $(e.target),
      opt = {},
      getVal = $tar.val(),
      get_printer_list = printer_list;
    $('#seletionItemList')
      .find('input')
      .removeAttr('checked');
    $('#printNumber')
      .val(1)
      .selectpicker('refresh');
    $('#print_all').prop('checked', 'checked');
    if (getVal >= 0) {
      $('[data-id="printNumber"]').removeAttr('disabled');
      $('[data-type="seletionItemList"]')
        .find('input')
        .removeAttr('disabled');
      opt['printerId'] = getVal;
      doRequest(
        '/zzhadmin/getPrinterStatus/',
        opt,
        function(res) {
          $('[data-type="exception_tip"]')
            .eq(0)
            .text(res.msg);
          if (res.msg != '在线，工作状态正常。') {
            $('[data-type="seletionItemList"]')
              .find('input')
              .attr('disabled', 'disabled');
            if (res.msg == null) {
              alert('打印机服务器出错，请联系平台工作人员。');
            }
          } else {
            $('[data-type="seletionItemList"]')
              .find('input')
              .removeAttr('disabled');
          }
        },
        function(res) {
          $('[data-type="exception_tip"]')
            .eq(0)
            .text(res.msg);
          $('[data-type="seletionItemList"]')
            .find('input')
            .attr('disabled', 'disabled');
          Toast('获取打印机状态失败！', 0);
        }
      );
      $.each(get_printer_list, function(index, ele) {
        if (getVal == ele['id']) {
          var selection_input = $('#seletionItemList').find('input'),
            curContinuousPrint_num = ele['continuousPrintNum'],
            isPrintMobile = ele['isPrintMobile'],
            qrcodePrint = ele['qrcodePrint'];
          var selection_arr = ele['selection'];
          if (
            typeof curContinuousPrint_num != 'undefined' &&
            curContinuousPrint_num.length != 0
          ) {
            $('#printNumber').val(curContinuousPrint_num[0]);
            $('#printNumber').selectpicker('refresh');
          } else {
            $('#printNumber').val(1);
            $('#printNumber').selectpicker('refresh');
          }
          if (typeof qrcodePrint != 'undefined' && qrcodePrint[0] === 2) {
            $('#print_divide').prop('checked', 'checked');
          } else if (
            typeof qrcodePrint != 'undefined' &&
            qrcodePrint[0] === 1
          ) {
            $('#print_all').prop('checked', 'checked');
          } else if (
            typeof qrcodePrint != 'undefined' &&
            qrcodePrint[0] === 3
          ) {
            $('#print_non_qrcode').prop('checked', 'checked');
          } else {
            $('#print_all').prop('checked', 'checked');
          }
          if (typeof isPrintMobile != 'undefined' && isPrintMobile[0] === 1) {
            $('#print_tel').prop('checked', 'checked');
          } else if (
            typeof isPrintMobile != 'undefined' &&
            isPrintMobile[0] === 0
          ) {
            $('#print_non_tel').prop('checked', 'checked');
          } else {
            $('#print_tel').prop('checked', 'checked');
          }
          $.each(selection_input, function(subIndex, subEle) {
            var cur_select_sort = $(subEle).attr('data-sort');
            if (typeof selection_arr != 'undefined') {
              for (var j = 0; j < selection_arr.length; j++) {
                cur_select_sort == selection_arr[j] &&
                  $(subEle).prop('checked', 'checked');
              }
            }
          });
        }
      });
    } else {
      $('[data-type="seletionItemList"]')
        .find('input')
        .attr('disabled', 'disabled');
    }
  },
  selectNoSelectionPrinter: function(e) {
    var self = this,
      $tar = $(e.target),
      opt = {};
    var $tarParent = $tar.parent(),
      tarName = $tarParent
        .find('span')
        .eq(0)
        .text(),
      ifSelected = $tarParent
        .find('input')
        .eq(0)
        .prop('checked');
    if (ifSelected) {
      opt['printerId'] = $tarParent
        .find('input')
        .eq(0)
        .attr('data-id');
      doRequest(
        '/zzhadmin/getPrinterStatus/',
        opt,
        function(res) {
          $('[data-type="exception_tip"]')
            .eq(0)
            .text(tarName + ':' + res.msg);
          if (res.msg != '在线，工作状态正常。') {
            $tar.removeAttr('checked');
            if (res.msg == null) {
              alert('打印机服务器出错，请联系平台工作人员。');
            }
          }
        },
        function(res) {
          Toast('获取打印机状态失败！', 0);
        }
      );
    } else {
      $('[data-type="exception_tip"]')
        .eq(0)
        .text('');
    }
  },
  change_print_number: function(e) {
    var self = this,
      $tar = $(e.target),
      getVal = $tar.val(),
      cur_printer = $('#selectPrinter').val();
    if (getVal == 1 && $('#print_divide').prop('checked') == true) {
      alert('请先把“打印联数”设置为大于1，再设置隔联打印功能。');
      $('#printNumber')
        .val(2)
        .selectpicker('refresh');
      return false;
    }
    $.each(printer_list, function(index, ele) {
      if (parseInt(cur_printer) === ele['id']) {
        $.each(ele['continuousPrintNum'], function(subIndex, subEle) {
          ele['continuousPrintNum'][subIndex] = getVal;
        });
      }
    });
  },
  dimension_code_label: function(e) {
    var self = this,
      $tar = $(e.target),
      $checkBox = $tar.parents('.form-group').find('#print_divide'),
      cur_printer = $('#selectPrinter').val();
    if ($('#printNumber').val() < 2 && $checkBox.prop('checked')) {
      alert('请先把“打印联数”设置为大于1，再设置隔联打印功能。');
      $('#print_all').prop('checked', 'checked');
      return false;
    }
    $.each(printer_list, function(index, ele) {
      if (parseInt(cur_printer) === ele['id']) {
        $.each(ele['qrcodePrint'], function(subIndex, subEle) {
          var cur_ercode = '';
          cur_ercode = parseInt($('[name="print_method"]:checked').val());
          ele['qrcodePrint'][subIndex] = cur_ercode;
        });
      }
    });
  },
  print_tel_label: function(e) {
    var self = this,
      $tar = $(e.target),
      cur_printer = $('#selectPrinter').val();
    $.each(printer_list, function(index, ele) {
      if (parseInt(cur_printer) === ele['id']) {
        $.each(ele['isPrintMobile'], function(subIndex, subEle) {
          var mobile_print = '';
          mobile_print = parseInt($('[name="print_tel_method"]:checked').val());
          ele['isPrintMobile'][subIndex] = mobile_print;
        });
      }
    });
  },
  setPrintModal: function(e) {
    var self = this,
      ifHasSelectItem = !$('#proStyle')
        .parents('.form-group')
        .hasClass('hide');
    var status_str =
      '<option value="1" data-action="print-number" >1联</option>' +
      '<option value="2" data-action="print-number" >2联</option>' +
      '<option value="3" data-action="print-number" >3联</option>' +
      '<option value="4" data-action="print-number" >4联</option>' +
      '<option value="5" data-action="print-number" >5联</option>';
    $('#printNumber').html(status_str);
    $('#printNumber')
      .val(1)
      .selectpicker('refresh');
    var printerList = '',
      opt = {};
    $.ajax({
      type: 'get',
      url: '/zzhadmin/getPrinterList/',
      async: false,
      success: function(res) {
        printerList = res.data;
      },
      error: function(res) {
        Toast('网络出错，获取打印机列表失败', 0);
      },
    });
    if (printerList.length == 0) {
      $('#noPrinterModal').modal('show');
      return false;
    }
    if (
      ((editType == 1 || editType == 0 || editType == 3) && first_set) ||
      (has_local_storage && first_set)
    ) {
      first_set = false;
      var if_hide_size = $('#proStyle')
        .parents('.form-group')
        .hasClass('hide');
      if (
        typeof ceremonyMap.printerId == 'undefined' &&
        if_hide_size == false
      ) {
        var wrap_arr = [];
        $('#sizeBox > tr').each(function(index, ele) {
          var curCid = $(ele).attr('id'),
            singleSizesJson = {},
            curModel = self.sizes.get(curCid),
            curPrinterObj = curModel.get('printer');
          $.each(curPrinterObj, function(subIndex, subEle) {
            if (wrap_arr.length == 0) {
              var sub_wrap_obj = {},
                sub_wrap_arr_continuousPrint_num = [],
                sub_wrap_arr_qrcodePrint = [],
                sub_wrap_arr_isPrintMobile = [],
                sub_wrap_arr_selection = [];
              sub_wrap_arr_continuousPrint_num.push(
                subEle['continuousPrintNum']
              );
              sub_wrap_arr_qrcodePrint.push(subEle['qrcodePrint']);
              sub_wrap_arr_isPrintMobile.push(subEle['isPrintMobile']);
              sub_wrap_arr_selection.push(curCid);
              sub_wrap_obj['id'] = subEle['printerId'];
              sub_wrap_obj[
                'continuousPrintNum'
              ] = sub_wrap_arr_continuousPrint_num;
              sub_wrap_obj['qrcodePrint'] = sub_wrap_arr_qrcodePrint;
              sub_wrap_obj['isPrintMobile'] = sub_wrap_arr_isPrintMobile;
              sub_wrap_obj['selection'] = sub_wrap_arr_selection;
              wrap_arr[subIndex] = sub_wrap_obj;
            } else {
              var sub_wrap_arr_continuousPrint_num = [],
                sub_wrap_arr_qrcodePrint = [],
                sub_wrap_arr_isPrintMobile = [],
                sub_wrap_arr_selection = [];
              sub_wrap_arr_continuousPrint_num.push(
                subEle['continuousPrintNum']
              );
              sub_wrap_arr_qrcodePrint.push(subEle['qrcodePrint']);
              sub_wrap_arr_isPrintMobile.push(subEle['isPrintMobile']);
              sub_wrap_arr_selection.push(curCid);
              var printer_id_arr = [],
                if_has_same_id = false,
                the_same_index = -1;
              $.each(wrap_arr, function(getIndex, getEle) {
                printer_id_arr[getIndex] = getEle['id'];
              });
              for (var k = 0; k < printer_id_arr.length; k++) {
                if (subEle['printerId'] == printer_id_arr[k]) {
                  if_has_same_id = true;
                  the_same_index = k;
                }
              }
              if (if_has_same_id) {
                wrap_arr[the_same_index]['selection'].push(curCid);
                wrap_arr[the_same_index]['qrcodePrint'].push(
                  subEle['qrcodePrint']
                );
                wrap_arr[the_same_index]['isPrintMobile'].push(
                  subEle['isPrintMobile']
                );
                wrap_arr[the_same_index]['continuousPrintNum'].push(
                  subEle['continuousPrintNum']
                );
              } else {
                var add_wrap_obj = {};
                add_wrap_obj['id'] = subEle['printerId'];
                add_wrap_obj[
                  'continuousPrintNum'
                ] = sub_wrap_arr_continuousPrint_num;
                add_wrap_obj['qrcodePrint'] = sub_wrap_arr_qrcodePrint;
                add_wrap_obj['isPrintMobile'] = sub_wrap_arr_isPrintMobile;
                add_wrap_obj['selection'] = sub_wrap_arr_selection;
                wrap_arr.push(add_wrap_obj);
              }
            }
          });
        });
        origin_printer_list = wrap_arr;
      }
    }
    var $noSelectPrinterDiv = $('[data-type="noSelectPrinter"]').eq(0);
    if (ifHasSelectItem) {
      printer_list = myTool.deepCopy(origin_printer_list);
      if (typeof printer_list == 'undefined') {
        printer_list = [];
      }
      if (
        printer_list.length > 0 &&
        editType != 1 &&
        editType != 0 &&
        editType != 3 &&
        !has_local_storage
      ) {
        $('#selectPrinter').val('-1');
        $('#selectPrinter').selectpicker('refresh');
        $('[data-id="printNumber"]').attr('disabled', 'disabled');
        $('#print_divide').prop('checked', 'checked');
      } else {
        if (printerList.length > 0) {
          var printerList_str = '<option value="-1">请选择打印机</option>';
          for (var i = 0; i < printerList.length; i++) {
            printerList_str +=
              '<option value="' +
              printerList[i]['id'] +
              '" data-action="printer-select" >' +
              printerList[i]['address'] +
              '</option>';
            var printer_object = {},
              printer_arr = [];
            printer_object['id'] = printerList[i]['id'];
            if (editType >= 0 || has_local_storage) {
              var if_new_printer = true;
              for (var j = 0; j < printer_list.length; j++) {
                if (printer_list[j]['id'] == printer_object['id']) {
                  if_new_printer = false;
                  break;
                }
              }
              if (if_new_printer) {
                printer_list.push(printer_object);
              }
            } else {
              printer_list[i] = printer_object;
            }
          }
          $('#selectPrinter').html(printerList_str);
          $('#selectPrinter').selectpicker('refresh');
        } else {
          $('#noPrinterModal').modal('show');
          return false;
        }
        $('[data-id="printNumber"]').attr('disabled', 'disabled');
      }
      var sizesJson = {},
        sizesArr = [];
      $('#sizeBox > tr').each(function(index, ele) {
        var curCid = $(ele).attr('id'),
          singleSizesJson = {};
        var curModel = self.sizes.get(curCid);
        singleSizesJson['name'] = curModel.get('name');
        singleSizesJson['curId'] = curCid;
        sizesArr[index] = singleSizesJson;
      });
      sizesJson['data'] = sizesArr;
      var template = juicer(config.template.component.print_tmp);
      $('[data-type="seletionItemList"]')
        .eq(0)
        .html(template.render(sizesJson));
      $('[data-type="seletionItemList"]')
        .find('input')
        .attr('disabled', 'disabled');
      $noSelectPrinterDiv.parent().addClass('hide');
      $('[data-type="seletionItemList"]')
        .eq(0)
        .parent()
        .removeClass('hide');
      $('#selectPrinter')
        .parents('.form-group')
        .removeClass('hide');
      $('#open_print')
        .parents('.form-group')
        .addClass('hide');
      $('[data-type="selection_tip"]')
        .eq(0)
        .removeClass('hide');
      $('[data-type="dimension_code"]')
        .eq(0)
        .removeClass('hide');
      $('[data-type="code_tips"]')
        .eq(0)
        .removeClass('hide');
      self.show_printer_id &&
        $('#selectPrinter')
          .val(self.show_printer_id)
          .selectpicker('refresh')
          .trigger('change');
    } else {
      var print_list_json = {},
        print_list_arr = [],
        template = juicer(config.template.component.print_list);
      $('[data-type="seletionItemList"]')
        .eq(0)
        .html('');
      $.each(printerList, function(index, ele) {
        var print_list_object = {};
        print_list_object['id'] = ele.id;
        print_list_object['address'] = ele.address;
        print_list_arr[index] = print_list_object;
      });
      print_list_json['data'] = print_list_arr;
      $noSelectPrinterDiv.html(template.render(print_list_json));
      $noSelectPrinterDiv.parent().removeClass('hide');
      $('[data-type="seletionItemList"]')
        .eq(0)
        .parent()
        .addClass('hide');
      $('#selectPrinter')
        .parents('.form-group')
        .addClass('hide');
      $('#open_print')
        .parents('.form-group')
        .removeClass('hide');
      $('[data-type="selection_tip"]')
        .eq(0)
        .addClass('hide');
      $('[data-type="noSelectPrinter"]')
        .find('[data-type="no_selection_printer_div"]')
        .attr('disabled', 'disabled');
      var no_selection_list_len = no_selection_list.length;
      if (no_selection_list_len > 0) {
        var if_open_printer =
            no_selection_list[no_selection_list_len - 1]['isOpenPrinter'],
          selected_printer_list =
            no_selection_list[no_selection_list_len - 1]['printerId'],
          print_number =
            no_selection_list[no_selection_list_len - 1]['continuousPrintNum'],
          mobile_print =
            no_selection_list[no_selection_list_len - 1]['isPrintMobile'],
          qrcode_print =
            no_selection_list[no_selection_list_len - 1]['qrcodePrint'];
        if (if_open_printer == 1) {
          $('#open_print').prop('checked', 'checked');
          $('[data-type="noSelectPrinter"]')
            .find('[data-type="no_selection_printer_div"]')
            .removeAttr('disabled');
        } else {
          $('#close_print').prop('checked', 'checked');
        }
        $('[data-type="noSelectPrinter"]')
          .find('[data-type="no_selection_printer_div"]')
          .removeAttr('checked');
        if (typeof selected_printer_list !== 'undefined') {
          for (var j = 0; j < selected_printer_list.length; j++) {
            $('[data-type="noSelectPrinter"]')
              .find('[data-id="' + selected_printer_list[j] + '"]')
              .eq(0)
              .prop('checked', 'checked');
          }
        }
        if (typeof print_number !== 'undefined') {
          $('#printNumber')
            .val(print_number)
            .selectpicker('refresh');
        }
        if (qrcode_print == 1) {
          $('#print_all').prop('checked', 'checked');
        } else if (qrcode_print == 2) {
          $('#print_divide').prop('checked', 'checked');
        } else if (qrcode_print == 3) {
          $('#print_non_qrcode').prop('checked', 'checked');
        } else {
          $('#print_all').prop('checked', 'checked');
        }
        if (mobile_print == 0) {
          $('#print_non_tel').prop('checked', 'checked');
        } else {
          $('#print_tel').prop('checked', 'checked');
        }
      } else {
        $('[data-type="noSelectPrinter"]')
          .find('[data-type="no_selection_printer_div"]')
          .attr('disabled', 'disabled');
        $('#close_print').prop('checked', 'checked');
        $('#printNumber')
          .val(1)
          .selectpicker('refresh');
        $('#print_all').prop('checked', 'checked');
      }
    }
  },
  closeSetPrintModal: function(e) {
    var self = this;
    $('[data-type="exception_tip"]')
      .eq(0)
      .text('');
    var has_selection_list = selection_list,
      has_not_selection_list = no_selection_list,
      has_not_selection_list_len = has_not_selection_list.length;
    if (has_not_selection_list_len > 0) {
      overall_if_open_printer =
        has_not_selection_list[has_not_selection_list_len - 1]['isOpenPrinter'];
    } else if (has_selection_list.length > 0) {
      overall_if_open_printer = true;
    } else {
      overall_if_open_printer = false;
    }
  },
  surePrint: function(e) {
    var self = this,
      ifHasSelection = !$('[data-type="seletionItemList"]')
        .eq(0)
        .parent()
        .hasClass('hide');
    var transfer = myTool.deepCopy(printer_list);
    origin_printer_list = transfer;
    if (ifHasSelection) {
      var if_has_ercode = $('#print_divide').prop('checked'),
        print_number = $('#printNumber').val();
      if (if_has_ercode && print_number < 2) {
        alert('请先把“打印联数”设置为大于1，再设置隔联打印功能。');
        return false;
      }
      var get_printer_list = printer_list,
        selectionList = [],
        selectionLen = $('[data-type="seletionItemList"]')
          .eq(0)
          .find('input').length;
      $.each(get_printer_list, function(index, ele) {
        $.each(ele['selection'], function(subIndex, subEle) {
          var is_new_selection = false;
          for (var i = 0; i < selectionLen; i++) {
            if (typeof selectionList[i] == 'undefined') {
              is_new_selection = true;
              break;
            } else {
              if (selectionList[i]['selection_cid'] == subEle) {
                selectionList[i]['printerId'].push(ele['id']);
                selectionList[i]['continuousPrintNum'].push(
                  parseInt(ele['continuousPrintNum'][subIndex])
                );
                selectionList[i]['qrcodePrint'].push(
                  ele['qrcodePrint'][subIndex]
                );
                selectionList[i]['isPrintMobile'].push(
                  ele['isPrintMobile'][subIndex]
                );
                is_new_selection = false;
                break;
              }
            }
            is_new_selection = true;
          }
          if (is_new_selection) {
            var add_selection_obj = {},
              printer_id_arr = [],
              continuousPrint_num_arr = [],
              isPrintMobile_arr = [],
              qrcodePrint_arr = [];
            printer_id_arr.push(ele['id']);
            continuousPrint_num_arr.push(
              parseInt(ele['continuousPrintNum'][subIndex])
            );
            qrcodePrint_arr.push(ele['qrcodePrint'][subIndex]);
            isPrintMobile_arr.push(ele['isPrintMobile'][subIndex]);
            add_selection_obj['selection_cid'] = subEle;
            add_selection_obj['printerId'] = printer_id_arr;
            add_selection_obj['continuousPrintNum'] = continuousPrint_num_arr;
            add_selection_obj['qrcodePrint'] = qrcodePrint_arr;
            add_selection_obj['isPrintMobile'] = isPrintMobile_arr;
            selectionList.push(add_selection_obj);
          }
        });
      });
      selection_list = selectionList;
      $('#sizeBox > tr').each(function(index, ele) {
        var curCid = $(ele).attr('id'),
          singleSizesJson = {},
          curModel = self.sizes.get(curCid);
        var sub_wrap_selection = [];
        for (var i = 0; i < selection_list.length; i++) {
          if (selection_list[i]['selection_cid'] == curCid) {
            sub_wrap_selection.push(selection_list[i]);
          }
        }
        var wrap_selection = [];
        if (sub_wrap_selection.length != 0) {
          for (var i = 0; i < sub_wrap_selection[0]['printerId'].length; i++) {
            var wrap_object = {};
            wrap_object['printerId'] = sub_wrap_selection[0]['printerId'][i];
            wrap_object['continuousPrintNum'] =
              sub_wrap_selection[0]['continuousPrintNum'][i];
            wrap_object['qrcodePrint'] =
              sub_wrap_selection[0]['qrcodePrint'][i];
            wrap_object['isPrintMobile'] =
              sub_wrap_selection[0]['isPrintMobile'][i];
            wrap_object['printerId'] != '' &&
              (if_set_printer = true) &&
              (self.show_printer_id = wrap_object['printerId']);
            self.show_printer_type = 1;
            wrap_selection.push(wrap_object);
          }
        }
        !if_set_printer && (self.show_printer_id = 0);
        curModel.set('printer', wrap_selection);
      });
      no_selection_list = [];
    } else {
      var if_open_printer = Number($('#open_print').prop('checked')),
        qrcode_print,
        mobile_print,
        selected_printer_list = [],
        print_number = '';
      qrcode_print = parseInt($('[name="print_method"]:checked').val());
      mobile_print = parseInt($('[name="print_tel_method"]:checked').val());
      $.each(
        $('[data-type="noSelectPrinter"]').find(
          '[data-type="no_selection_printer_div"]'
        ),
        function(index, ele) {
          $(ele).prop('checked') &&
            selected_printer_list.push(parseInt($(ele).attr('data-id')));
        }
      );
      if (if_open_printer && selected_printer_list.length == 0) {
        Toast('开启打印机后，请至少选择一台打印机！', 2);
        return false;
      }
      print_number = $('#printNumber').val();
      if (qrcode_print == 2 && print_number < 2) {
        alert('请先把“打印联数”设置为大于1，再设置隔联打印功能。');
        return false;
      }
      var temporary_obj = {};
      temporary_obj['isOpenPrinter'] = if_open_printer;
      temporary_obj['printerId'] = selected_printer_list;
      temporary_obj['continuousPrintNum'] = print_number;
      temporary_obj['qrcodePrint'] = qrcode_print;
      temporary_obj['isPrintMobile'] = mobile_print;
      temporary_obj['printerId'] != '' &&
        if_open_printer &&
        (if_set_printer = true) &&
        (self.show_printer_id = temporary_obj['printerId']);
      self.show_printer_type = 0;
      no_selection_list.push(temporary_obj);
      selection_list = [];
    }
    !if_set_printer && (self.show_printer_id = 0);
    if_set_printer
      ? self.change_printer_text('已设置')
      : self.change_printer_text('设置');
    $('#setPrintModal').modal('hide');
  },
  print_switch: function(e) {
    var self = this,
      if_open = $('#open_print').prop('checked');
    if (if_open) {
      $('[data-type="noSelectPrinter"]')
        .find('[data-type="no_selection_printer_div"]')
        .removeAttr('disabled');
    } else {
      $('[data-type="noSelectPrinter"]')
        .find('[data-type="no_selection_printer_div"]')
        .attr('disabled', 'disabled');
    }
  },
  selection_checkbox: function(e) {
    var self = msgListView,
      $tar = $(e.target),
      curPrinterId = $('#selectPrinter').val(),
      selectionObject = {},
      selectionArr = [],
      selectionPrintNumArr = [],
      selectionCodeArr = [],
      selectionMobileArr = [];
    var selectionSort = $tar.attr('data-sort'),
      selectionPrintNum = $('#printNumber').val(),
      selectionCode = '',
      selectionMobile = '';
    selectionCode = parseInt($('[name="print_method"]:checked').val());
    selectionMobile = parseInt($('[name="print_tel_method"]:checked').val());
    var if_checked = $tar.prop('checked');
    $.each(printer_list, function(index, ele) {
      if (ele['id'] == curPrinterId) {
        if (
          typeof ele['selection'] != 'undefined' &&
          ele['selection'].length != 0
        ) {
          var is_new_selection = false;
          $.each(ele['selection'], function(subIndex, subEle) {
            if (if_checked) {
              if (subEle == selectionSort) {
                ele['continuousPrintNum'][subIndex] = selectionPrintNum;
                ele['qrcodePrint'][subIndex] = selectionCode;
                ele['isPrintMobile'][subIndex] = selectionMobile;
                is_new_selection = false;
                return false;
              } else {
                is_new_selection = true;
              }
            } else {
              if (subEle == selectionSort) {
                ele['continuousPrintNum'].splice(subIndex, 1);
                ele['qrcodePrint'].splice(subIndex, 1);
                ele['isPrintMobile'].splice(subIndex, 1);
                ele['selection'].splice(subIndex, 1);
                return false;
              }
            }
          });
          if (is_new_selection) {
            ele['selection'].push(selectionSort);
            ele['continuousPrintNum'].push(selectionPrintNum);
            ele['qrcodePrint'].push(selectionCode);
            ele['isPrintMobile'].push(selectionMobile);
          }
        } else {
          selectionArr.push(selectionSort);
          selectionPrintNumArr.push(selectionPrintNum);
          selectionCodeArr.push(selectionCode);
          selectionMobileArr.push(selectionMobile);
          ele['selection'] = selectionArr;
          ele['continuousPrintNum'] = selectionPrintNumArr;
          ele['qrcodePrint'] = selectionCodeArr;
          ele['isPrintMobile'] = selectionMobileArr;
        }
      }
    });
  },
  submit: function(e, save_to_template, save_to_draft) {
    var self = this;
    if (
      ifFirstSave &&
      $('[data-type="set_print"]')
        .eq(0)
        .text() === '设置' &&
      !save_to_template &&
      !save_to_draft
    ) {
      var printerList = '';
      $.ajax({
        type: 'get',
        url: '/zzhadmin/getPrinterList/',
        async: false,
        success: function(res) {
          printerList = res.data;
        },
        error: function(res) {
          Toast('网络出错，获取打印机列表失败', 0);
        },
      });
      if (printerList.length != 0) {
        $('#notSetPrinterModal').modal('show');
        return;
      }
    }
    var $container = $('[data-role="submit-container"]');
    if (!!$container.length) {
      $container.appendTo('body').fadeIn();
    } else {
      $container = $(juicer(config.template.component.savingModal).render({}));
      $container.appendTo('body').fadeIn();
    }
    if (if_submiting_pic && navigator.onLine) {
      Toast('正在上传中，请稍候');
      return false;
    }
    if (!self.startVerify()) {
      $container.fadeOut();
      return false;
    }
    if (!navigator.onLine) {
      Toast('您的网络连接失败，请检查后重试', 0);
      $container.fadeOut();
      return false;
    }
    Toast('正在上传数据中，请稍等!');
    if_submiting_pic = true;
    new StoreImage(
      [window.contentData.detail, window.contentData.payDetail || ''],
      function(handledContent) {
        var add_param_contents = [];
        $.each(handledContent, function(index, item) {
          add_param_contents[index] = purifyATarget(item);
        });
        window.contentData.detail = add_param_contents[0];
        window.contentData.payDetail = add_param_contents[1];
        if_submiting_pic = false;
        if (save_to_template) {
          self.saveOtherSiteAllImagesSuccess_template();
        } else {
          if (save_to_draft) {
            self.saveOtherSiteAllImagesSuccess(1);
          } else {
            self.saveOtherSiteAllImagesSuccess();
          }
        }
      }
    );
  },
  showSetPrinterModal: function() {
    $('#notSetPrinterModal').modal('hide');
    $('#setPrintModal').modal('show');
  },
  skipSetPrinterAndSave: function() {
    var $modal = $('#notSetPrinterModal'),
      $submit = $('#submit');
    $modal.modal('hide');
    $submit.click();
  },
  hideNotSetPrinterModal: function(e) {
    ifFirstSave = false;
  },
  set_template: function() {
    var self = this;
    var $container = $('[data-role="my_modal"]');
    if (!!$container.length) {
      $container.fadeIn();
      return !1;
    }
    $container = $(
      juicer(config.template.component.templateSetting).render({})
    );
    $container.appendTo('body').fadeIn();
  },
  save_draft: function(e) {
    var self = this;
    self.submit(e, 0, 1);
  },
  confirm_template: function(e) {
    var self = this,
      $tar = $(e.target);
    self.new_template_name = $('[data-type="template_name"]').val();
    $tar.parents('[data-role="my_modal"]').fadeOut();
    self.submit(e, 1, 0);
  },
  cancel_template: function(e) {
    var self = this,
      $tar = $(e.target);
    $tar.parents('[data-role="my_modal"]').fadeOut();
  },
  cancel: function() {
    $.confirm({
      title: false,
      content: '你确定离开吗?（未保存的修改将不生效）',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            has_tip = true;
            window.location = document.referrer;
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  closeAddCalendarModal: function() {
    var self = this;
    self.getUnprintedOrder();
  },
  onClickClosePromotion: function(e) {
    var self = this,
      $tar = $(e.target);
    $.confirm({
      title: false,
      content: '关闭保存佛事后可继续保存',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            $tar.parents('[data-role="submit-container"]').fadeOut();
          },
        },
      },
    });
  },
  sureCalendar: function(e) {
    var $tar = $(e.target),
      self = this,
      cid = $tar.attr('data-cid'),
      startDate = $('#beginDate').val(),
      endDate = $('#endDate').val(),
      startTime = moment(startDate),
      endTime = moment(endDate),
      diffTime = endTime.diff(startTime);
    var calendar_check_if_hide = $('#ifAddCalendar')
        .parents('.input-group')
        .hasClass('hide'),
      calendar_check = $('#ifAddCalendar').prop('checked');
    var set_calendar = 0;
    if (!calendar_check_if_hide && calendar_check) set_calendar = 1;
    if (diffTime < 0) {
      Toast('请保证结束时间大于开始时间！', 2);
    } else {
      var opt = {};
      opt['commodityId'] = cid;
      opt['startTime'] = startDate;
      opt['endTime'] = endDate;
      opt['calendar'] = set_calendar;
      opt['imagetext'] = set_imagetext;
      doRequest(
        '/zzhadmin/addWebSite/',
        opt,
        function(msg) {
          Toast('提交成功!');
          self.getUnprintedOrder();
        },
        function(msg) {
          alert('提交失败，请联系自在家平台。');
        }
      );
    }
  },
  initTelPsVerifyMsg: function(isSubPs, isVerify) {
    var self = this;
    self.getMsgNum(function(msgNum) {
      var $msgNumTip, $msgNum, $inputRequiredFormGroup, $inputRequired;
      if (isSubPs) {
        $msgNumTip = $('#size-msg-num-tip');
        $msgNum = $('#size-msg-num');
        $inputRequiredFormGroup = $('#size-input-required-form-group');
        $inputRequired = $('#sizesInputRequired');
      } else {
        $msgNumTip = $('#msg-num-tip');
        $msgNum = $('#msg-num');
        $inputRequiredFormGroup = $('#input-required-form-group');
        $inputRequired = $('#inputRequired');
      }
      if (isVerify) {
        $msgNum.text(msgNum);
        $msgNumTip.show();
        $inputRequired.prop('checked', true);
        $inputRequiredFormGroup.hide();
      } else {
        $msgNumTip.hide();
        $inputRequiredFormGroup.show();
      }
    });
  },
  getMsgNum: function(callBack) {
    $.ajax({
      type: 'get',
      url: '/zzhadmin/volunteer_getSmsCount/',
      async: false,
      success: function(res) {
        callBack(res.data.msgCnt);
      },
      error: function(res) {
        Toast('网络出错，获取打印机列表失败', 0);
      },
    });
  },
  addRedBorder: function($ele) {
    $ele.addClass('border--red');
    setTimeout(function() {
      $ele.removeClass('border--red');
    }, 5000);
  },
  change_url: function() {
    window.location.href = '/zzhadmin/managerCeremonyIndex/';
  },
  getUnprintedOrder: function(e) {
    var self = this,
      get_print_opt = {};
    if (foshiId == null) {
      self.change_url();
      return false;
    }
    get_print_opt['commodityId'] = parseInt(foshiId);
    $.ajax({
      type: 'get',
      url: '/zzhadmin/getNeedPrintOrderNum/',
      async: false,
      data: get_print_opt,
      success: function(res) {
        var unprinted_order_number = res.orderNum;
        if (unprinted_order_number > 0) {
          $.confirm({
            title: false,
            content:
              '检测到有' + unprinted_order_number + '个订单未打印，是否打印?',
            animation: 'left',
            closeAnimation: 'rotateYR',
            buttons: {
              ok: {
                text: '打印',
                action: function() {
                  $.ajax({
                    url: '/zzhadmin/printOrder/',
                    type: 'post',
                    data: get_print_opt,
                    success: function(res) {
                      Toast('开始打印！');
                      self.change_url();
                    },
                    error: function(res) {
                      self.change_url();
                    },
                  });
                },
              },
              cancel: {
                text: '稍后再说',
                action: function() {
                  self.change_url();
                },
              },
            },
          });
        } else {
          self.change_url();
        }
      },
      error: function(res) {
        alert('获取未打印的订单数量失败！');
        self.change_url();
      },
    });
  },
  read_current_content: function() {
    var self = this,
      current_content = {};
    if (editType == 1) {
      current_content = ceremonyMap;
    } else {
      current_content = template_content;
    }
    current_content['title'] = $('#proName').val();
    current_content['ceremonyTypeId'] = $('#classification').val();
    if (!(editType == 3 && ifTemplate == 1)) {
      current_content['allow_showVistNum'] = Number(
        $('#show-join-num').bootstrapSwitch('state')
      );
      current_content['custom_introduce'] = $('#summary').val();
    }
    var productionImg = [];
    $('.myupload img').each(function(index, Dom) {
      productionImg.push($(Dom).attr('src'));
    });
    current_content['pics'] = productionImg;
    var detailsEdi = UE.getEditor('myEditor', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      }),
      pay_succ_detailsEdi = UE.getEditor('myEditor2', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      });
    detailsEdi.ready(function() {
      current_content['details'] = detailsEdi.getContent();
    });
    pay_succ_detailsEdi.ready(function() {
      current_content['pay_succ_details'] = pay_succ_detailsEdi.getContent();
    });
    current_content['price'] = $('#suixiInput')
      .parents('.form-group')
      .hasClass('hide')
      ? 0
      : $('#suixiInput').val();
    current_content['stock'] = $('#proStore').val();
    current_content['isAutoFinish'] = $('#suixiInput')
      .next()
      .next()
      .hasClass('hide')
      ? 0
      : Number($('#autoFinishSwitch').bootstrapSwitch('state'));
    current_content['subdivideStr'] = JSON.stringify(self.sizes);
    current_content['postScript'] = JSON.stringify(self.additionItems);
    current_content['showClient'] = $(
      'input[name=participateList]:checked'
    ).val();
    current_content['showEndTime'] = $(
      'input[name=remainingTime]:checked'
    ).val();
    current_content['opName'] = $('#operation').val();
    current_content['feedback_type'] =
      $('.selected_feedback_item').attr('data-index') || '';
    current_content['startTime'] = $('#timeStart').val();
    current_content['endTime'] = $('#timeLimit').val();
    var $targetAmount = $('#target-amount');
    var is_show_cnt = parseInt($('input[name=summaryArea]:checked').val(), 10);
    var targetAmount = parseFloat($targetAmount.val());
    if (is_show_cnt === 1) {
      is_show_cnt = parseInt(
        $('[data-ele="summary-area-type"].active').attr('data-type'),
        10
      );
      if (is_show_cnt === 2) {
        if (
          isNaN(targetAmount) ||
          targetAmount <= 0 ||
          String(targetAmount).indexOf('.') !== -1
        ) {
          targetAmount = '';
        }
      } else {
        targetAmount = '';
      }
    } else {
      targetAmount = '';
    }
    current_content['showStatictics'] = is_show_cnt;
    current_content['targetAmount'] = targetAmount;
    if (no_selection_list.length > 0) {
      var no_selection_list_len = no_selection_list.length;
      current_content['printerId'] =
        no_selection_list[no_selection_list_len - 1]['printerId'];
      current_content['isOpenPrinter'] =
        no_selection_list[no_selection_list_len - 1]['isOpenPrinter'];
      current_content['continuousPrintNum'] =
        no_selection_list[no_selection_list_len - 1]['continuousPrintNum'];
      current_content['qrcodePrint'] =
        no_selection_list[no_selection_list_len - 1]['qrcodePrint'];
      current_content['isPrintMobile'] =
        no_selection_list[no_selection_list_len - 1]['isPrintMobile'];
    }
    return current_content;
  },
  save_content_to_local: function() {
    var self = this,
      current_content = {};
    current_content = self.read_current_content();
    localStorage.removeItem('foshi_content');
    localStorage.setItem('foshi_content', JSON.stringify(current_content));
    Toast("您当前的佛事内容已缓存至本地(●'◡'●)");
  },
  clear_local_content: function() {
    localStorage.removeItem('foshi_content');
  },
  render_local_content: function() {
    var self = this,
      current_content = {};
    current_content = localStorage.getItem('foshi_content');
    if (!localStorage.hasOwnProperty('foshi_content')) return false;
    has_local_storage = true;
    $.confirm({
      title: false,
      content: '您有未保存的本地佛事内容，是否读取(会覆盖当前内容)？',
      buttons: {
        ok: {
          text: '读取',
          action: function() {
            current_content = JSON.parse(current_content);
            $('#proName').val(current_content.title);
            $('#show-join-num').bootstrapSwitch(
              'state',
              !!current_content.allow_showVistNum
            );
            self.showimgs(current_content);
            $('#summary').val(current_content.custom_introduce);
            $('#summary').trigger('keyup');
            self.showDetail(current_content, 1);
            self.showSizes(current_content, 1);
            self.showAddition(current_content, 1);
            self.showPrimeSize(current_content);
            self.showOthers(current_content);
            var add_wrap_obj = {};
            add_wrap_obj['isOpenPrinter'] = current_content.isOpenPrinter;
            add_wrap_obj['printerId'] = current_content.printerId;
            add_wrap_obj['continuousPrintNum'] =
              current_content.continuousPrintNum;
            add_wrap_obj['qrcodePrint'] = current_content.qrcodePrint;
            add_wrap_obj['isPrintMobile'] = current_content.isPrintMobile;
            no_selection_list.push(add_wrap_obj);
            overall_if_open_printer = current_content.isOpenPrinter;
            self.setPrinterStatus(current_content, 1);
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  startVerify: function() {
    var self = this,
      detailsEdi = UE.getEditor('myEditor', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      }),
      pay_succ_detailsEdi = UE.getEditor('myEditor2', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      }),
      details = null,
      pay_succ_details = '',
      feedback_type = '',
      suixiMoney = null,
      inventory = null,
      isAutoFinish = null;
    if ($('button[data-id=classification]').length == 0) {
      Toast('请添加分类', 2);
      $('html, body').scrollTop($('#classifiSelect').offset().top);
      return false;
    }
    var foshiName = $('#proName').val(),
      is_show_participant = $('input[name=participateList]:checked').val(),
      is_show_time = $('input[name=remainingTime]:checked').val(),
      typeName = $('button[data-id=classification]')[0].getAttribute('title'),
      typeIndexFind = 0,
      typeIndex = 0,
      subdivideStr = [],
      typeListString = $('#classification > option')
        .map(function() {
          return $(this).text();
        })
        .get()
        .join(','),
      typeIndexListString = $('#classification > option')
        .map(function() {
          return $(this).attr('data-id');
        })
        .get()
        .join(','),
      typeList = typeListString.split(','),
      typeIndexList = typeIndexListString.split(','),
      inputLength = $('#additionBox > tr').length,
      inputType = [],
      inputString = [],
      additionID = [],
      isMust = [],
      inputName = [],
      prompt_text = [],
      describtion = [],
      selectInput = [],
      font_length = [],
      isVerify = [],
      dataType = [],
      picNum = [],
      postScript = [],
      buy_btn_name = $('#operation').val(),
      start_time = $('#timeStart').val(),
      end_time = $('#timeLimit').val(),
      productionImg = [],
      no_need_pay = false;
    $(typeList).each(function(index, ele) {
      if (ele == typeName) {
        typeIndexFind = index;
      }
    });
    var $targetAmount = $('#target-amount');
    var is_show_cnt = parseInt($('input[name=summaryArea]:checked').val(), 10);
    var targetAmount = parseFloat($targetAmount.val());
    if (is_show_cnt === 1) {
      is_show_cnt = parseInt(
        $('[data-ele="summary-area-type"].active').attr('data-type'),
        10
      );
      if (is_show_cnt === 2) {
        if (
          isNaN(targetAmount) ||
          targetAmount <= 0 ||
          String(targetAmount).indexOf('.') !== -1
        ) {
          if (isNaN(targetAmount)) {
            Toast('请填写正确的目标金额！', 2);
          }
          if (targetAmount <= 0) {
            Toast('目标金额不能小于0！', 2);
          }
          if (String(targetAmount).indexOf('.') !== -1) {
            Toast('目标金额须为整数！', 2);
          }
          $targetAmount.parents('.form-group').addClass('has-error');
          $('html, body').scrollTop($targetAmount.offset().top);
          return false;
        } else {
          $targetAmount.parents('.form-group').removeClass('has-error');
        }
      } else {
        targetAmount = 0;
        $targetAmount.parents('.form-group').removeClass('has-error');
      }
    } else {
      targetAmount = 0;
      $targetAmount.parents('.form-group').removeClass('has-error');
    }
    var startMs = new Date(start_time.replace(/-/g, '/')).getTime(),
      endMs = new Date(end_time.replace(/-/g, '/')).getTime();
    if (foshiName == '') {
      Toast('请填写标题！', 2);
      $('#proName')
        .parents('.form-group')
        .addClass('has-error');
      $('html, body').scrollTop($('#proName').offset().top);
      return false;
    } else {
      $('#proName')
        .parents('.form-group')
        .removeClass('has-error');
    }
    if (
      $('#classification').val() === '-1' ||
      $('#classification').val() === null
    ) {
      Toast('请添加佛事分类！', 2);
      $('html, body').scrollTop($('#classification').offset().top);
      return false;
    }
    if (startMs > endMs) {
      $('html, body').scrollTop($('#timeStart').offset().top);
      Toast('结束时间必须比开始时间早', 2);
      return false;
    }
    var titleLen = $('#proName').val().length;
    if (titleLen > 30) {
      $('html, body').scrollTop($('#proName').offset().top);
      $('#proName')
        .nextAll('.nullError_msg')
        .removeClass('hide');
      Toast('请输入不超过30个文字！', 2);
      return false;
    } else {
      $('#proName')
        .nextAll('.nullError_msg')
        .addClass('hide');
    }
    if (
      $('#sizeBox')
        .parents('.form-group')
        .hasClass('hide')
    ) {
      if (
        $('#suixiInput')
          .parents('.form-group')
          .hasClass('hide')
      ) {
        suixiMoney = 0;
        isAutoFinish = 0;
        no_need_pay = true;
      } else {
        var suixiOrigin = $('#suixiInput').val();
        if (suixiOrigin == '') {
          $('html, body').scrollTop($('#suixiInput').offset().top - 100);
          $('#suixiInput')
            .parents('.form-group')
            .addClass('has-error');
          Toast('请输入支付金额！', 2);
          return false;
        } else if (parseFloat(suixiOrigin) == 0) {
          $('html, body').scrollTop($('#suixiInput').offset().top - 100);
          $('#suixiInput')
            .parents('.form-group')
            .addClass('has-error');
          Toast('支付金额不能为0！', 2);
          return false;
        } else {
          var suixi_match = suixiOrigin
            .toString()
            .match(myRegExp.suixi_price_right);
          if (suixi_match) {
            suixiOrigin = suixi_match[0];
            suixiOrigin = suixiOrigin.replace(/\，/g, ',');
            var suixiArr = suixiOrigin.split(',');
            if (suixiArr.length > 1) {
              suixiArr[suixiArr.length - 1] == '' &&
                (suixiOrigin = suixiOrigin.substr(0, suixiOrigin.length - 1));
              suixiMoney = '[' + suixiOrigin + ']';
              isAutoFinish = Number(
                $('#autoFinishSwitch').bootstrapSwitch('state')
              );
            } else {
              suixiMoney = suixiOrigin;
              isAutoFinish = 0;
            }
          } else {
            Toast('支付金额格式出错，请以逗号分隔数字且无其它无关字符出现', 2);
            $('html, body').scrollTop($('#suixiInput').offset().top - 50);
            self.addRedBorder($('#suixiInput'));
            return false;
          }
        }
      }
      inventory = $('#proStore').val();
      inventory == '' && (inventory = -1);
    } else {
      var sizebox_error = false;
      $('#sizeBox > tr').each(function(index, ele) {
        var curCid = ele.id,
          curModel = self.sizes.get(curCid),
          subType = curModel.get('subdivide_type'),
          curPostscript = curModel.get('postScript'),
          postscriptArr = [];
        if (curPostscript != undefined) {
          var curPostscriptLen = curPostscript.length,
            curPostscriptArr = $.parseJSON(JSON.stringify(curPostscript));
          for (var i = 0; i < curPostscriptLen; i++) {
            var postscriptWrap = {};
            if (editType == 1 || editType == 0) {
              if (typeof curPostscriptArr[i].id == 'number') {
                postscriptWrap['id'] = curPostscriptArr[i].id;
              }
            }
            postscriptWrap['inputType'] = curPostscriptArr[i].inputType;
            postscriptWrap['prompt_text'] = [];
            if (postscriptWrap['inputType'] == 3) {
              var selectArr = curPostscriptArr[i].selectInput;
              if (selectArr == undefined || selectArr == []) {
              } else {
                for (var j = 0; j < selectArr.length; j++) {
                  postscriptWrap['prompt_text'][j] =
                    postscriptWrap['prompt_text'][j] || [];
                  postscriptWrap['prompt_text'][j] = selectArr[j];
                }
              }
            } else {
              postscriptWrap['prompt_text'] = curPostscriptArr[i].prompt_text;
            }
            postscriptWrap['name'] = curPostscriptArr[i].name;
            postscriptWrap['is_must'] = curPostscriptArr[i].is_must;
            postscriptWrap['dataType'] = curPostscriptArr[i].dataType;
            postscriptWrap['pic_num'] = curPostscriptArr[i].pic_num;
            postscriptWrap['describe'] = curPostscriptArr[i].describe;
            postscriptWrap['isVerify'] = curPostscriptArr[i].isVerify;
            if (
              postscriptWrap['inputType'] == 15 ||
              (subType == 3 && postscriptWrap['inputType'] == 12) ||
              (subType == 2 &&
                (postscriptWrap['inputType'] == 10 ||
                  postscriptWrap['inputType'] == 11))
            ) {
              postscriptWrap['font_length'] = curPostscriptArr[i].font_length;
            } else {
              postscriptWrap['font_length'] = 0;
            }
            postscriptArr.push(postscriptWrap);
          }
        } else {
          postscriptArr = [];
        }
        if (editType == 1) {
          var specifiId = curModel.get('id');
        }
        var specifiName = curModel.get('name'),
          specifiPic = curModel.get('pic'),
          currentPrice = curModel.get('price'),
          currentPrinter = curModel.get('printer');
        if (typeof currentPrice == 'string') {
          var typePrice =
            currentPrice.indexOf(',') + currentPrice.indexOf('，');
        } else if (typeof currentPrice == 'number') {
          var typePrice = -1;
        }
        if (currentPrice == '') {
          var specifiPrice = 0;
        } else {
          var select_suixi_match = currentPrice
            .toString()
            .match(myRegExp.suixi_price_right);
          if (select_suixi_match) {
            currentPrice = select_suixi_match[0];
            if (typePrice < 0) {
              var specifiPrice = currentPrice;
            } else {
              currentPrice = currentPrice.replace(/\，/g, ',');
              currentPrice[currentPrice.length - 1] == ',' &&
                (currentPrice = currentPrice.substr(
                  0,
                  currentPrice.length - 1
                ));
              var currentArr = currentPrice.split(',');
              for (var i = 0; i < currentArr.length; i++) {}
              var specifiPrice = '[' + currentPrice + ']';
            }
          } else {
            sizebox_error = true;
            Toast(
              '选择项支付金额格式出错，请以逗号分隔数字且无其它无关字符出现',
              2
            );
            $('html, body').scrollTop($(ele).offset().top - 50);
            self.addRedBorder($(ele).find('.proPrice'));
            return false;
          }
        }
        var specifiStock = curModel.get('stock'),
          subdivide = {};
        subdivide['postScript'] = postscriptArr;
        subdivide['name'] = specifiName;
        subdivide['printer'] = currentPrinter;
        subdivide['pic'] = specifiPic;
        subdivide['explain'] = curModel.get('explain');
        subdivide['isAutoFinish'] = curModel.get('isAutoFinish');
        subdivide['subdivide_type'] = curModel.get('subdivide_type');
        subdivide['endTime'] = curModel.get('endTime');
        subdivide['durationDay'] = parseInt(curModel.get('durationDay')) || 0;
        subdivide['enroll_num'] = curModel.get('enroll_num');
        selection_list.length > 0 &&
          (subdivide['printer'] = curModel.get('printer'));
        subdivide['sort'] = index;
        editType == 1 && specifiId != '' && (subdivide['id'] = specifiId);
        subdivide['price'] = specifiPrice;
        if (specifiStock === '') {
          subdivide['stock'] = -1;
        } else {
          subdivide['stock'] = specifiStock;
        }
        subdivideStr.push(subdivide);
      });
      if (sizebox_error) return false;
    }
    typeIndex = typeIndexList[typeIndexFind];
    if (
      $('#additionBox')
        .parents('.form-group')
        .hasClass('hide')
    ) {
      if (no_need_pay) {
        Toast('请添加附言项', 2);
        $('html, body').scrollTop($('#addAddition').offset().top - 50);
        return false;
      }
    } else {
      $('#additionBox > tr').each(function(index, ele) {
        inputString[index] = $.trim(
          $(ele)
            .eq(0)
            .find('button')
            .eq(0)
            .text()
        );
        if (editType == 1) {
          var addID = $(ele)
            .eq(0)
            .find('img')[0].attributes[1].value;
          additionID[index] = addID;
        }
        var cid = $(ele).attr('id'),
          modelAll = self.additionItems.get(cid);
        isMust[index] = modelAll.get('is_must');
        dataType[index] = modelAll.get('dataType');
        picNum[index] = modelAll.get('pic_num');
        describtion[index] = modelAll.get('describe');
        selectInput[index] = modelAll.get('selectInput');
        font_length[index] = modelAll.get('font_length');
        isVerify[index] = modelAll.get('isVerify');
        inputName[index] = $(ele)
          .eq(0)
          .find('input.additionName')
          .eq(0)
          .val();
        inputType[index] = inputType[index] || [];
        switch (inputString[index]) {
          case '自定义-单行文本框':
            inputType[index] = 1;
            break;
          case '自定义-日期选择':
            inputType[index] = 2;
            break;
          case '自定义-下拉列表':
            inputType[index] = 3;
            break;
          case '联系人':
            inputType[index] = 4;
            break;
          case '手机号码':
            inputType[index] = 5;
            break;
          case '地址':
            inputType[index] = 6;
            break;
          case '自定义-多行文本框':
            inputType[index] = 7;
            break;
          case '性别':
            inputType[index] = 8;
            break;
          case '出生日期':
            inputType[index] = 9;
            break;
          case '阳上人':
            inputType[index] = 10;
            break;
          case '往生者':
            inputType[index] = 11;
            break;
          case '功德芳名':
            inputType[index] = 12;
            break;
          case '自定义-提示框':
            inputType[index] = 13;
            break;
          case '自定义-图片上传':
            inputType[index] = 14;
            break;
          case '心愿':
            inputType[index] = 15;
            break;
          default:
            console.log('未匹配到附言类型');
            break;
        }
        if (inputType[index] !== 3) {
          prompt_text[index] = modelAll.get('prompt_text');
          prompt_text[index] == null && (prompt_text[index] = '');
        } else {
          prompt_text[index] = [];
          if (typeof selectInput[index] != 'undefined') {
            for (var i = 0; i < selectInput[index].length; i++) {
              prompt_text[index].push(selectInput[index][i]);
            }
          }
        }
      });
      for (var i = 0; i < inputLength; i++) {
        var postScriptInner = {};
        editType == 1 &&
          (additionID[i] != null && additionID[i] != 0) &&
          (postScriptInner['id'] = additionID[i]);
        postScriptInner['inputType'] = inputType[i];
        postScriptInner['prompt_text'] = prompt_text[i];
        postScriptInner['describe'] = describtion[i];
        postScriptInner['name'] = inputName[i];
        postScriptInner['is_must'] = isMust[i];
        postScriptInner['dataType'] = dataType[i];
        postScriptInner['pic_num'] = picNum[i];
        postScriptInner['isVerify'] = isVerify[i];
        if (inputType[i] == 15) {
          postScriptInner['font_length'] = font_length[i];
        } else {
          postScriptInner['font_length'] = 0;
        }
        postScript.push(postScriptInner);
      }
    }
    $('.myupload img').each(function(index, Dom) {
      productionImg.push($(Dom).attr('src'));
    });
    if (!$('.picture').val() && !$('.upload_wrap img').length) {
      $('#pictureBox')
        .parents('.form-group')
        .addClass('has-error');
      Toast('请上传封面图片！', 2);
      $('html, body').scrollTop(0);
      return false;
    } else {
      var pictureDiv = $('.picture').parents('.form-group');
      pictureDiv.removeClass('has-error');
      pictureDiv.find('.nullError_msg').hide();
    }
    for (var i = 0; i < subdivideStr.length; i++) {
      if (subdivideStr[i]['price'] == '') {
        subdivideStr[i]['price'] = 0;
      }
    }
    for (var i = 0; i < subdivideStr.length; i++) {
      if (subdivideStr[i]['name'] == '' && subdivideStr[i]['inputType'] != 13) {
        $('html, body').scrollTop($('#sizeBox').offset().top);
        Toast('请填写选择项名称！', 2);
        return false;
      }
    }
    for (var i = 0; i < postScript.length; i++) {
      if (postScript[i]['name'] == '' && postScript[i]['inputType'] != 13) {
        $('html, body').scrollTop($('#additionBox').offset().top);
        Toast('请填写附言名称！', 2);
        return false;
      }
    }
    if (
      !$('#proStyle')
        .parents('.form-group')
        .hasClass('hide')
    ) {
      if (
        !$('#sizesAddAdditionItem')
          .parents('.form-group')
          .hasClass('hide')
      ) {
        var getSizes = self.sizes.models;
        for (var i = 0; i < getSizes.length; i++) {
          var getSizePost = getSizes[i].get('postScript');
          if (typeof getSizePost == 'undefined') {
            continue;
          }
          var getSizePostModel = getSizePost.models;
          if (typeof getSizePostModel != 'undefined') {
            for (var j = 0; j < getSizePostModel.length; j++) {
              var postName = getSizePostModel[j].get('name'),
                postInputType = getSizePostModel[j].get('inputType');
              if (postName == '' && postInputType != 13) {
                $('html, body').scrollTop($('#sizeBox').offset().top);
                Toast('请填写添加项中的附言名称！', 2);
                return false;
              }
            }
          } else {
            getSizePost.forEach(function(ele) {
              var postName = ele['name'],
                postInputType = ele['inputType'];
              if (postName == '' && postInputType != 13) {
                $('html, body').scrollTop($('#sizeBox').offset().top);
                Toast('请填写添加项中的附言名称！', 2);
                return false;
              }
            });
          }
        }
      }
    }
    detailsEdi.ready(function() {
      details = detailsEdi.getContent();
    });
    pay_succ_detailsEdi.ready(function() {
      pay_succ_details = pay_succ_detailsEdi.getContent();
    });
    if (details.length < 3) {
      $('html, body').scrollTop(400);
      Toast('请填写详情!', 2);
      return false;
    }
    if ($('#open_feedback').prop('checked') && pay_succ_details.length < 3) {
      Toast('请填写下单提示!', 2);
      return false;
    }
    const ifShowFeedbackImg = parseInt(
      $('[name="showFeedbackImg"]:checked').val(),
      10
    );
    if (ifShowFeedbackImg) {
      feedback_type = $('[data-ele="feedback-type"].active').attr('data-type');
    } else {
      feedback_type = 0;
    }
    if (typeof feedback_type == 'undefined') {
      Toast('请选择功德证书!', 2);
      return false;
    }
    var opt = {};
    if (
      $('#sizeBox')
        .parents('.form-group')
        .hasClass('hide')
    ) {
      opt['price'] = suixiMoney;
      opt['stock'] = inventory;
      opt['isAutoFinish'] = isAutoFinish;
    } else {
      opt['isAutoFinish'] = 0;
      opt['subdivideStr'] = subdivideStr;
    }
    opt['title'] = foshiName;
    opt['ceremonyTypeId'] = typeIndex;
    opt['pics'] = productionImg;
    opt['detail'] = details;
    opt['opName'] = buy_btn_name;
    opt['postScript'] = postScript;
    opt['showClient'] = is_show_participant;
    opt['showStatictics'] = is_show_cnt;
    opt['targetAmount'] = targetAmount;
    opt['startTime'] = start_time;
    opt['endTime'] = end_time;
    opt['showEndTime'] = is_show_time;
    opt['payDetail'] = pay_succ_details;
    opt['explain'] = '';
    opt['feedbackType'] = parseInt(feedback_type);
    if (no_selection_list.length > 0) {
      var no_selection_list_len = no_selection_list.length;
      opt['printerId'] =
        no_selection_list[no_selection_list_len - 1]['printerId'];
      opt['isOpenPrinter'] =
        no_selection_list[no_selection_list_len - 1]['isOpenPrinter'];
      opt['continuousPrintNum'] =
        no_selection_list[no_selection_list_len - 1]['continuousPrintNum'];
      opt['qrcodePrint'] =
        no_selection_list[no_selection_list_len - 1]['qrcodePrint'];
      opt['isPrintMobile'] =
        no_selection_list[no_selection_list_len - 1]['isPrintMobile'];
    }
    if (!(editType == 3 && ifTemplate == 1)) {
      opt['allow_showVistNum'] = Number(
        $('#show-join-num').bootstrapSwitch('state')
      );
      opt['custom_introduce'] = $('#summary').val();
    }
    opt.pay_succ_details_flag =
      parseInt($('input[name="if_feedback"]:checked').attr('value')) || 0;
    window.contentData = opt;
    console.log(window.contentData);
    return true;
  },
  saveOtherSiteAllImagesSuccess: function(save_to_draft) {
    var self = this,
      params = {},
      submit_url = '',
      start_time = $('#timeStart').val(),
      end_time = $('#timeLimit').val();
    if (editType == 1) {
      params = window.contentData;
      params['id'] = foshiId;
      submit_url = '/zzhadmin/managerEditCeremony/';
      if (verifyId == 2) {
        params['op_status'] = 2;
      }
    } else if (editType == 3 && ifTemplate) {
      window.contentData['startTime'] = '';
      window.contentData['endTime'] = '';
      submit_url = '/zzhadmin/saveCeremonyTemplate/';
      params = {};
      params['templateId'] = templateId;
      params['content'] = window.contentData;
    } else {
      params = window.contentData;
      submit_url = '/zzhadmin/createCeremony/';
    }
    if (save_to_draft) {
      params['op_status'] = 2;
    } else {
      if (verifyId == 1) {
        params['op_status'] = 0;
      } else {
        params['op_status'] = 1;
      }
    }
    $.ajax({
      url: submit_url,
      type: 'post',
      dataType: 'JSON',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(params),
      timeout: 60000,
      success: function(res) {
        has_tip = true;
        self.clear_local_content();
        $('[data-role="submit-container"]').fadeOut();
        Toast('上传成功!');
        if (editType == 3 && ifTemplate) {
          setTimeout(function() {
            window.location.href = '/zzhadmin/selectCeremonyTemplate/';
          }, 300);
          return;
        }
        if (start_time == '' && end_time == '') {
          start_time = moment(new Date());
        }
        if (save_to_draft) {
          self.change_url();
        } else {
          if (editType != 1 && !(editType == 3 && ifTemplate == 1))
            window.sessionStorage.setItem('buddhistVerify', 1);
          if (res.createCalendar !== 1) {
            self.getUnprintedOrder();
          } else {
            if (start_time == '') {
              var startTime = moment(end_time)
                  .subtract(2, 'day')
                  .format('YYYY-MM-DD'),
                endTime = moment(end_time).format('YYYY-MM-DD');
            } else if (end_time == '') {
              var startTime = moment(start_time).format('YYYY-MM-DD'),
                endTime = moment(start_time)
                  .add(2, 'day')
                  .format('YYYY-MM-DD');
            } else {
              var endTime = moment(end_time),
                startTime = moment(start_time),
                diffTime = endTime.diff(startTime, 'days');
              if (diffTime > 6) {
                var endTime = moment(end_time).format('YYYY-MM-DD'),
                  startTime = moment(end_time)
                    .subtract(2, 'day')
                    .format('YYYY-MM-DD');
              } else {
                var endTime = moment(end_time).format('YYYY-MM-DD'),
                  startTime = moment(start_time).format('YYYY-MM-DD');
              }
            }
            $('#ifAddCalendar')
              .parents('.input-group')
              .removeClass('hide');
            $('#datepicker').removeClass('hide');
            $('#beginDate').val(startTime);
            $('#beginDate').datetimepicker('update');
            $('#endDate').val(endTime);
            $('#endDate').datetimepicker('update');
            set_imagetext = res.createImageText;
            $('#addCalendarModal').modal('show');
            $('#sureCalendar').attr('data-cid', res.commodityId);
          }
        }
      },
      error: function(res) {
        Toast('网络连接出错，请重试!', 0);
        $('[data-role="submit-container"]').fadeOut();
      },
      complete: function(XMLHttpRequest, status) {
        if (status == 'timeout') {
          $('[data-role="submit-container"]').fadeOut();
          Toast('提交超时，请重新保存', 0);
        }
      },
    });
  },
  saveOtherSiteAllImagesSuccess_template: function() {
    var self = this,
      params = {},
      submit_url = '';
    window.contentData['startTime'] = '';
    window.contentData['endTime'] = '';
    submit_url = '/zzhadmin/saveCeremonyTemplate/';
    params = {};
    params['name'] = self.new_template_name;
    params['content'] = window.contentData;
    $.ajax({
      url: submit_url,
      type: 'post',
      dataType: 'JSON',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(params),
      timeout: 60000,
      success: function(res) {
        has_tip = true;
        self.clear_local_content();
        $('[data-role="submit-container"]').fadeOut();
        Toast('保存成功!');
        setTimeout(function() {
          window.location.href = '/zzhadmin/selectCeremonyTemplate/';
        }, 300);
      },
      error: function(res) {
        Toast('网络连接出错，请重试!', 0);
        $('[data-role="submit-container"]').fadeOut();
      },
      complete: function(XMLHttpRequest, status) {
        if (status == 'timeout') {
          $('[data-role="submit-container"]').fadeOut();
          Toast('提交超时，请重新保存', 0);
        }
      },
    });
  },
  UrlSearch: function() {
    var name,
      value,
      str = location.href,
      num = str.indexOf('?');
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
  render_feedback_item: function(feedback_modal) {
    var ue2 = UE.getEditor('myEditor2', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      }),
      feedback_html = '';
    feedback_modal != '' && (feedback_html = feedback_modal.render({}));
    ue2.setContent(feedback_html, false);
  },
  initialize: function() {
    var self = this,
      UrlSearch = new self.UrlSearch();
    editType = UrlSearch.edit;
    foshiId = UrlSearch.id;
    ifTemplate = UrlSearch.ifTemplate;
    verifyId = UrlSearch.verifyId;
    if (editType == 1) {
      document.title = '编辑佛事';
      $('[data-id="titleName"]').text('编辑佛事');
      if (verifyId != 2) {
        $('#submit').text('修改佛事');
        $('#save-draft').addClass('hide');
      }
    } else if (editType == 0) {
      document.title = '复制佛事';
      $('[data-id="titleName"]').text('复制佛事');
    }
    self.render_buddhist_type_list();
    if (editType == 2 || editType == 3) {
      templateId = UrlSearch.templateId;
      self.get_buddhist_template();
      if (editType == 3) {
        $('#set_template').addClass('hide');
        if (ifTemplate) {
          document.title = '编辑模板';
          $('[data-id="titleName"]').text('编辑模板');
          $('#submit').text('保存');
          $('#save-draft').addClass('hide');
        }
      }
    }
    self.initDateTimepicker();
    self.initFeedbackType();
    self.initSortable();
    $('[data-type="tip"]').tooltip();
    var $showJoinNumCtnr = $('#show-join-num-ctnr'),
      $switch = $('#show-join-num'),
      $summaryCtnr = $('#summary-ctnr');
    if (editType == 3 && ifTemplate == 1) {
      $showJoinNumCtnr.hide();
      $summaryCtnr.hide();
    } else {
      $switch.bootstrapSwitch({
        size: 'mini',
        onText: '开',
        offText: '关',
        onColor: 'primary',
        offColor: 'info',
        state: true,
        onSwitchChange: function(e, state) {},
      });
      $showJoinNumCtnr.show();
      $summaryCtnr.show();
    }
    window.addEventListener('beforeunload', function(e) {
      if (!has_tip) {
        var confirmationMessage = '你确定离开吗?（未保存的修改将不生效）';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    });
    if (!editType) {
      setInterval(function() {
        self.save_content_to_local();
      }, 60000);
      setTimeout(function() {
        self.render_local_content();
      }, 3000);
    }
  },
  initDateTimepicker: function() {
    if (verifyId != 1) {
      $('#timeStart').datetimepicker({
        keyboardNavigation: false,
        language: 'zh-CN',
        todayHighlight: true,
        forceParse: false,
        autoclose: true,
        clearBtn: false,
        format: 'yyyy-mm-dd hh:ii:ss',
        startDate: new Date(),
      });
      $('#timeLimit').datetimepicker({
        keyboardNavigation: false,
        language: 'zh-CN',
        todayHighlight: true,
        forceParse: false,
        autoclose: true,
        clearBtn: false,
        format: 'yyyy-mm-dd hh:ii:ss',
        startDate: new Date(),
      });
    }
    $('#beginDate')
      .datetimepicker({
        keyboardNavigation: false,
        language: 'zh-CN',
        todayHighlight: true,
        forceParse: false,
        autoclose: true,
        clearBtn: false,
        startDate: '1999-1-1',
        format: 'yyyy-mm-dd',
        minView: 2,
      })
      .on('hide', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
    $('#endDate')
      .datetimepicker({
        keyboardNavigation: false,
        language: 'zh-CN',
        todayHighlight: true,
        forceParse: false,
        autoclose: true,
        clearBtn: false,
        startDate: '1999-1-1',
        format: 'yyyy-mm-dd',
        minView: 2,
      })
      .on('hide', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
    $('#sub-end-time').datetimepicker({
      keyboardNavigation: false,
      language: 'zh-CN',
      todayHighlight: true,
      forceParse: false,
      autoclose: true,
      clearBtn: false,
      format: 'yyyy-mm-dd hh:ii:ss',
      startDate: new Date(),
    });
  },
  initSortable: function() {
    $('#pictureBox').sortable({
      connectWith: '.connectedSortable',
    });
    $('#pictureTrashCan').sortable({
      connectWith: '.connectedSortable',
      update: function(event, ui) {
        $(this).html('');
      },
    });
  },
  initFeedbackType: function() {
    const $container = $('#feedback-type-list');
    const data = Const.feedbackImgArr;
    const tpl = config.template.component.feedbackType;
    let htmlStr = '';
    data.forEach(item => {
      htmlStr += juicer(tpl).render(item);
    });
    $container.append(htmlStr);
    $('#show-feedback-img').prop('checked', !0);
    $('[data-ele="feedback-type"][data-type="1"]').click();
  },
  get_buddhist_template: function() {
    var self = this,
      get_url = '',
      params = {};
    params['templateId'] = templateId;
    if (editType == 2) {
      get_url = '/zzhadmin/ceremony_template/';
    } else {
      get_url = '/zzhadmin/getCeremonyTemplate/';
    }
    $.ajax({
      type: 'GET',
      url: get_url,
      data: params,
      success: function(res) {
        template_content = res['data'];
        self.render_buddhist_template(template_content);
      },
      error: function(res) {
        alert('获取模板信息失败！');
      },
    });
  },
  render_buddhist_template: function(getContent) {
    var self = this;
    $('#proName').val(getContent.title);
    if (typeof getContent.allow_showVistNum !== 'undefined') {
      $('#show-join-num').bootstrapSwitch(
        'state',
        !!getContent.allow_showVistNum
      );
    }
    $('#classification').selectpicker('val', getContent.ceremonyTypeId);
    self.showimgs(getContent);
    if (typeof getContent.custom_introduce !== 'undefined') {
      $('#summary').val(getContent.custom_introduce);
      $('#summary').trigger('keyup');
    }
    self.showDetail(getContent);
    self.showSizes(getContent);
    self.showAddition(getContent);
    self.showPrimeSize(getContent);
    self.showOthers(getContent);
    if (typeof getContent.pay_succ_details_flag === 'undefined') {
      getContent.pay_succ_details_flag = 0;
    }
    self.setIfOpenFeedback(getContent);
    if (editType == 3) {
      self.setPrinterStatus(getContent);
    }
  },
  render_ueditor: function() {
    var self = this,
      ue = UE.getEditor('myEditor', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      }),
      ue2 = UE.getEditor('myEditor2', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      });
    function editorSlideTop() {
      pay_succ_details = config.template.component.pay_succ_details;
      ue2.setContent(pay_succ_details, false);
      setTimeout(function() {
        $('body,html').scrollTop(0);
      }, 300);
    }
    function detailEditor() {
      ue.setContent(details, false);
    }
    function detailNullEditor() {
      ue.setContent('', false);
    }
    ue.ready(function() {
      details = ue.getContent();
      typeof details == 'string' && details.length > 0
        ? detailEditor()
        : detailNullEditor();
      self.hide_loading();
    });
    ue2.ready(function() {
      pay_succ_details = ue2.getContent();
      typeof pay_succ_details == 'string' && pay_succ_details.length > 0
        ? null
        : editorSlideTop();
      self.hide_loading();
    });
  },
  hide_loading: function() {
    var self = this;
    self.ready_editor++;
    if (self.ready_editor == 2) {
      $('#loading-toast').addClass('hideEle');
    }
  },
  bind_model_sort: function() {
    var self = this;
    $('#additionBox').sortable({
      handle: '.sortable-handle',
      update: function(event, ui) {
        var sortedIDs = $(this).sortable('toArray');
        var additionCollection = self.additionItems;
        _.each(sortedIDs, function(item, index) {
          var additionModel = additionCollection.get(item);
          additionModel.set('sort', index);
        });
        additionCollection.sort();
      },
    });
    $('#sizeBox').sortable({
      handle: '.sortable-handle',
      update: function(event, ui) {
        var sortedIDs = $(this).sortable('toArray');
        var additionCollection = self.sizes;
        _.each(sortedIDs, function(item, index) {
          for (var i = 0; i < additionCollection.length; i++) {
            var additionModel = additionCollection.get(item);
            additionModel.set('sort', index);
          }
        });
        additionCollection.sort();
      },
    });
    $('#sizesAdditionBox').sortable({
      handle: '.sortable-handle',
      update: function(event, ui) {
        var sortedIDs = $(this).sortable('toArray');
        var additionCollection = self.sizesAddition;
        _.each(sortedIDs, function(item, index) {
          for (var i = 0; i < additionCollection.length; i++) {
            var additionModel = additionCollection.get(item);
            additionModel.set('sort', index);
          }
        });
        additionCollection.sort();
      },
    });
  },
  render_buddhist_type_list: function() {
    var self = this;
    $.ajax({
      type: 'get',
      url: config.urls.buddhist.typeList,
      async: false,
      success: function(data) {
        var res = data.data;
        if (data['result'] == 0 || res) {
          self.render_ueditor();
          if (typeof res == 'object' && res.length > 0) {
            var opHtml = '';
            _.each(res, function(item, index) {
              opHtml +=
                '<option value=' +
                item.ceremonyTypeId +
                ' data-id=' +
                item.ceremonyTypeId +
                '>' +
                item.name +
                '</option>';
              if (!is_test_environment) {
                if (ceremonyMap.ceremonyTypeId == item.ceremonyTypeId) {
                  foshiName = item.name;
                }
              }
            });
            $('#classification').html(opHtml);
            $('.selectpicker').selectpicker({});
            self.res = res;
          }
          if (foshiId) {
            $('#classification').selectpicker(
              'val',
              ceremonyMap.ceremonyTypeId
            );
          }
          self.additionItems = new AdditionCollection([new AdditionModel({})]);
          self.additionView = new AdditionsView({
            el: '#additionBox',
            model: self.additionItems,
          });
          self.sizes = new SizeCollection([new SizeModel({})]);
          self.sizesView = new SizesView({
            el: '#sizeBox',
            model: self.sizes,
          });
          self.sizesAddition = new sizesAdditionCollection([
            new sizesAdditionModel({}),
          ]);
          self.sizesAdditionView = new SizesAdditionsView({
            el: '#sizesAdditionBox',
            model: self.sizesAddition,
          });
          self.bind_model_sort();
          var html = self.html;
          if (res != undefined) {
            var imgSrc = res.productionImg;
            if (typeof imgSrc == 'object' && imgSrc.length > 0) {
              imgSrc = _.pluck(imgSrc, 'pic');
              _.each(imgSrc, function(imgsrc) {
                var img = document.createElement('img');
                img.src = imgsrc;
                var top =
                  $('.upload_wrap')
                    .find('.upload_box')
                    .last()
                    .position().top + 5;
                $(img).css({
                  width: '100px',
                  height: '100px',
                  position: 'absolute',
                  top: top,
                });
                $('.upload_wrap .upload_box:last-child')
                  .addClass('upload_wrap_change ui-state-default')
                  .append(img);
                $('.upload_wrap').append(html);
              });
            }
          }
        } else {
          alert('获取佛事分类列表失败！');
        }
      },
      error: function(msg) {
        alert(msg['message']);
      },
    });
  },
  showimgs: function(getContent) {
    var self = this,
      imgs = getContent.pics;
    $('.myupload.upload_wrap_change').remove();
    if (imgs == undefined || imgs.length == 0) return false;
    for (var i = 0; i < imgs.length; i++) {
      var $aContent = $(document.createElement('a'));
      $aContent.addClass(
        'myupload upload_box ui-sortable-handle upload_wrap_change ui-state-default posRel'
      );
      $aContent.attr('href', 'javascript:;');
      var $inputContent = $(document.createElement('input'));
      $inputContent.addClass('btn btn-sm btn-primary dpblock');
      $inputContent.attr({
        name: 'file',
        type: '',
      });
      $inputContent.css({
        width: '100px',
        height: '100px',
        opacity: '0',
        padding: '0',
      });
      var $imgContent = $(document.createElement('img'));
      $imgContent.attr('src', imgs[i]);
      $imgContent.css({
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '0px',
      });
      var $PicsSpan = $(document.createElement('span'));
      $PicsSpan.attr('class', 'glyphicon glyphicon-remove-circle delPic');
      $PicsSpan.attr(
        'style',
        'position:absolute;right:3px;top:0px;color:rgb(212, 106, 64);'
      );
      $inputContent.appendTo($aContent);
      $imgContent.appendTo($aContent);
      $PicsSpan.appendTo($aContent);
      $('#pictureBox').append($aContent);
    }
    if ($('#pictureBox').find('img').length >= 5) {
      $('#pictureBox')[0].firstElementChild.setAttribute(
        'class',
        'myupload upload_box ui-sortable-handle hideEle'
      );
    } else {
      $('#pictureBox')[0].firstElementChild.setAttribute(
        'class',
        'myupload upload_box ui-sortable-handle'
      );
    }
  },
  showDetail: function(getContent, ifLocalStorage) {
    var self = this,
      ue = UE.getEditor('myEditor', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      }),
      ue2 = UE.getEditor('myEditor2', {
        initialFrameWidth: 700,
        initialFrameHeight: 400,
      }),
      ue_content = '',
      ue2_content = '';
    if (editType == 2 || ifLocalStorage) {
      ue_content = getContent.details;
      ue2_content = getContent.pay_succ_details;
    } else {
      ue_content = getContent.detail;
      ue2_content = getContent.payDetail;
    }
    ue.ready(function(editor) {
      ue.setContent(ue_content, false);
    });
    ue2.ready(function(editor) {
      ue2.setContent(ue2_content, false);
    });
  },
  showSizes: function(getContent, ifLocalStorage) {
    var self = this,
      inputSizesOrigin = [];
    if (!ifLocalStorage) {
      inputSizesOrigin = getContent.subdivideStr || [];
    } else {
      inputSizesOrigin = JSON.parse(getContent.subdivideStr) || [];
      if (
        inputSizesOrigin.length == 0 ||
        ((inputSizesOrigin.length == 1 && inputSizesOrigin[0]['cid'] == '') ||
          inputSizesOrigin[0]['name'] == '')
      ) {
        self.sizes = new SizeCollection({});
        self.sizesView = new SizesView({
          el: '#sizeBox',
          model: self.sizes,
        });
        self.sizesView.render();
        $('#proStyle')
          .parents('.form-group')
          .addClass('hide');
        $('#proStyleBtn')
          .parents('div')
          .prev()[0].innerHTML = '选择项：&nbsp;';
        $('#needPay')
          .parents('.form-group')
          .show();
        $('#proStore')
          .parents('.form-group')
          .show();
        return false;
      }
    }
    for (var i = 0; i < inputSizesOrigin.length; i++) {
      if (editType == 1 || editType == 3 || ifLocalStorage) {
        if (inputSizesOrigin[i]['printer'].length > 0) {
          overall_if_open_printer = true;
        }
      } else {
        inputSizesOrigin[i]['printer'] = '';
      }
    }
    var inputSizes = [];
    for (var k = 0; k < inputSizesOrigin.length; k++) {
      var kid = inputSizesOrigin[k].sort;
      inputSizes[kid] = inputSizesOrigin[k];
    }
    if (inputSizes == undefined || inputSizes.length == 0) return false;
    var inputSizesLen = inputSizesOrigin.length,
      jsonSizes = $.parseJSON(JSON.stringify(inputSizes));
    for (var i = 0; i < inputSizesLen; i++) {
      if (jsonSizes[i].postScript != undefined) {
        var jsonSizesAdd = $.parseJSON(JSON.stringify(jsonSizes[i].postScript));
        for (var j = 0; j < jsonSizesAdd.length; j++) {
          var inputPrompt = jsonSizesAdd[j].prompt_text;
          if (Object.prototype.toString.call(inputPrompt) == '[object Array]') {
            if (typeof inputPrompt[0]['name'] != 'undefined') {
              var temp_arr = [];
              for (var k = 0; k < inputPrompt.length; k++) {
                temp_arr.push(inputPrompt[k]['name']);
              }
              jsonSizesAdd[j].selectInput = temp_arr;
            } else {
              jsonSizesAdd[j].selectInput = inputPrompt;
            }
            jsonSizesAdd[j].prompt_text = '';
          }
        }
        jsonSizes[i].postScript = new sizesAdditionCollection(jsonSizesAdd);
      }
    }
    for (var i = 0; i < jsonSizes.length; i++) {
      if (isNaN(Number(jsonSizes[i].price))) {
        var priceLen = jsonSizes[i].price.length - 1;
        if (typeof jsonSizes[i].price != 'string') {
          jsonSizes[i].price = jsonSizes[i].price.join(',');
        } else if (!ifLocalStorage) {
          jsonSizes[i].price = jsonSizes[i].price.substring(1, priceLen);
        }
      }
      if (
        jsonSizes[i].price.toString().indexOf(',') +
          jsonSizes[i].price.toString().indexOf('，') ===
        -2
      ) {
        jsonSizes[i].isSingleMoney = 1;
      } else {
        jsonSizes[i].isSingleMoney = 0;
      }
      jsonSizes[i].stock == -1 && (jsonSizes[i].stock = '');
      if (typeof jsonSizes[i].endTime === 'undefined') {
        jsonSizes[i].endTime = '';
      }
      if (typeof jsonSizes[i].enroll_num === 'undefined') {
        jsonSizes[i].enroll_num = 0;
      }
    }
    self.sizes.reset();
    self.sizes = new SizeCollection(jsonSizes);
    self.sizesView = new SizesView({
      el: '#sizeBox',
      model: self.sizes,
    });
    self.sizes.sort();
    self.sizesView.render();
    $('#proStyle')
      .parents('.form-group')
      .hasClass('hide') && $('#proStyleBtn').click();
    if ($('.rePos').length != 0) {
      var right = -$('.rePos')
        .eq(0)
        .position().left;
      $('.delSmallPic').css('right', right);
    }
    for (var i = 0; i < inputSizesLen; i++) {
      var subType = jsonSizes[i].subdivide_type;
      if (typeof jsonSizes[i].postScript !== 'undefined') {
        var jsonSizesAdd = $.parseJSON(JSON.stringify(jsonSizes[i].postScript));
        for (var j = 0; j < jsonSizesAdd.length; j++) {
          var inputPrompt = jsonSizesAdd[j].prompt_text;
          if (Object.prototype.toString.call(inputPrompt) == '[object Array]') {
            if (typeof inputPrompt[0]['name'] != 'undefined') {
              for (var k = 0; k < inputPrompt.length; k++) {
                jsonSizesAdd[j].selectInput = inputPrompt[k]['name'];
              }
            } else {
              jsonSizesAdd[j].selectInput = inputPrompt;
            }
            jsonSizesAdd[j].prompt_text = '';
          }
          jsonSizesAdd[j].subType = subType;
        }
        jsonSizesAdd = self.handleSpecialSubPs(subType, jsonSizesAdd);
        jsonSizes[i].postScript = new sizesAdditionCollection(jsonSizesAdd);
        self.sizesAddition = new sizesAdditionCollection(jsonSizesAdd);
        var sizeCid = self.sizes.models[i].cid;
        self.sizes.models[i].attributes.postScript = self.sizesAddition;
        self.sizePostscript[sizeCid] = self.sizesAddition;
      }
    }
  },
  handleSpecialSubPs: function(subType, psArr) {
    if (subType == 3) {
      var FMPs = [],
        XYPs = [],
        otherPs = [];
      psArr.map(function(ps) {
        if (ps.inputType == 12) {
          if (ps.font_length === 0) {
            ps.font_length = 8;
          }
          if (ps.pic_num === 0) {
            ps.pic_num = 4;
          }
          FMPs.push(ps);
        } else if (ps.inputType == 15) {
          if (ps.font_length === 0) {
            ps.font_length = 20;
          }
          ps.pic_num = 0;
          XYPs.push(ps);
        } else {
          otherPs.push(ps);
        }
      });
      if (!FMPs.length) {
        FMPs.push({
          cid: '',
          dataType: 2,
          describe: '',
          font_length: 8,
          inputId: '',
          inputType: 12,
          is_must: 1,
          name: '功德芳名',
          pic_num: 4,
          prompt_text: '请填写功德主姓名',
          selectInput: [],
          subType: subType,
        });
      }
      if (!XYPs.length) {
        XYPs.push({
          cid: '',
          dataType: 2,
          describe: '',
          font_length: 20,
          inputId: '',
          inputType: 15,
          is_must: 1,
          name: '心愿',
          pic_num: 0,
          prompt_text: '请填写您的心愿',
          selectInput: [],
          subType: subType,
        });
      }
      psArr = FMPs.concat(XYPs, otherPs);
    } else if (subType == 2) {
      var YSRPs = [],
        WSZPs = [],
        otherPs = [];
      psArr.map(function(ps) {
        if (ps.inputType == 10) {
          if (ps.font_length === 0) {
            ps.font_length = 8;
          }
          ps.pic_num = 0;
          YSRPs.push(ps);
        } else if (ps.inputType == 11) {
          if (ps.font_length === 0) {
            ps.font_length = 8;
          }
          if (ps.pic_num === 0) {
            ps.pic_num = 4;
          }
          WSZPs.push(ps);
        } else {
          otherPs.push(ps);
        }
      });
      if (!YSRPs.length) {
        YSRPs.push({
          cid: '',
          dataType: 2,
          describe: '',
          font_length: 8,
          inputId: '',
          inputType: 10,
          is_must: 1,
          name: '阳上人',
          pic_num: 0,
          prompt_text: '请填写功德主姓名（在世）',
          selectInput: [],
          subType: subType,
        });
      }
      if (!WSZPs.length) {
        WSZPs.push({
          cid: '',
          dataType: 2,
          describe: '',
          font_length: 8,
          inputId: '',
          inputType: 11,
          is_must: 1,
          name: '往生者',
          pic_num: 4,
          prompt_text: '请填写已故者姓名（已去世）',
          selectInput: [],
          subType: subType,
        });
      }
      psArr = YSRPs.concat(WSZPs, otherPs);
    } else {
    }
    return psArr;
  },
  showAddition: function(getContent, ifLocalStorage) {
    var self = this,
      inputResPos = [];
    if (!ifLocalStorage) {
      inputResPos = getContent.postScript;
    } else {
      inputResPos = JSON.parse(getContent.postScript);
      if (
        inputResPos.length == 0 ||
        ((inputResPos.length == 1 && inputResPos[0]['cid'] == '') ||
          inputResPos[0]['name'] == '')
      ) {
        self.additionItems = new AdditionCollection({});
        self.additionView = new AdditionsView({
          el: '#additionBox',
          model: self.additionItems,
        });
        self.additionView.render();
        $('#additionTable')
          .parents('.form-group')
          .addClass('hide');
        $('#addAdditionItem')
          .parents('.form-group')
          .addClass('hide');
        $('#addAddition')
          .parents('.form-group')
          .removeClass('hide');
        return false;
      }
    }
    if (inputResPos == undefined || inputResPos.length == 0) return false;
    var inputResPosLen = inputResPos.length,
      jsonAdditionAdd = $.parseJSON(JSON.stringify(inputResPos));
    for (var j = 0; j < jsonAdditionAdd.length; j++) {
      var inputPrompt = jsonAdditionAdd[j].prompt_text;
      if (
        Object.prototype.toString.call(inputPrompt) == '[object Array]' &&
        inputPrompt.length
      ) {
        if (typeof inputPrompt[0]['name'] != 'undefined') {
          var temp_arr = [];
          for (var k = 0; k < inputPrompt.length; k++) {
            temp_arr.push(inputPrompt[k]['name']);
          }
          jsonAdditionAdd[j].selectInput = temp_arr;
        } else {
          jsonAdditionAdd[j].selectInput = inputPrompt;
        }
        jsonAdditionAdd[j].prompt_text = '';
      }
    }
    self.additionItems = new AdditionCollection(jsonAdditionAdd);
    self.additionView = new AdditionsView({
      el: '#additionBox',
      model: self.additionItems,
    });
    self.additionView.render();
    $('#additionTable')
      .parents('.form-group')
      .hasClass('hide') && $('#addAddition').click();
  },
  showPrimeSize: function(getContent) {
    var primePrice = getContent.price,
      primeStock = getContent.stock,
      primeIsAutoFinish = getContent.isAutoFinish;
    $('#autoFinishSwitch').bootstrapSwitch({
      size: 'mini',
      onText: '开',
      offText: '关',
      onColor: 'primary',
      offColor: 'info',
      state: !!primeIsAutoFinish,
      onSwitchChange: function() {},
    });
    if (primePrice != null && primePrice != 0) {
      if (primePrice.toString().charAt(0) == '[') {
        primePrice = primePrice.substring(1);
        var priceLen = primePrice.length - 1;
        primePrice = primePrice.substring(0, priceLen);
        $('#suixiInput').val(primePrice);
      } else {
        $('#suixiInput').val(primePrice);
      }
      if (
        primePrice.toString().indexOf(',') !== -1 ||
        primePrice.toString().indexOf('，') !== -1
      ) {
        $('#generateRandom').addClass('hide');
        $('#generateRandom')
          .next()
          .removeClass('hide');
      } else {
        $('#generateRandom').removeClass('hide');
        $('#generateRandom')
          .next()
          .addClass('hide');
        $('#autoFinishSwitch').bootstrapSwitch('destroy');
      }
      $('#needPay').prop('checked', 'checked');
      $('#suixiInput')
        .parents('.form-group')
        .removeClass('hide');
    } else {
      $('#noNeedPay').attr('checked', 'checked');
      $('#suixiInput')
        .parents('.form-group')
        .addClass('hide');
      $('#generateRandom').addClass('hide');
    }
    if (primeStock != null && primeStock != -1) {
      $('#proStore').val(primeStock);
    }
  },
  showOthers: function(getContent) {
    $('#operation').val(getContent.opName);
    var $timeStart = $('#timeStart'),
      $timeLimit = $('#timeLimit');
    if (editType != 0) {
      $timeStart.val(getContent.startTime);
      $timeLimit.val(getContent.endTime);
      if (verifyId != 1) {
        $timeStart.datetimepicker('update');
        $timeLimit.datetimepicker('update');
      } else {
        $timeStart.addClass('c999');
        $timeStart.prop('disabled', true);
        $timeLimit.addClass('c999');
        $timeLimit.prop('disabled', true);
      }
    }
    if (getContent.showClient == 1) {
      $('#showParticipateList').attr('checked', true);
      $('#hideParticipateList').attr('checked', false);
      $('#showParticipateList').click();
    } else {
      $('#showParticipateList').attr('checked', false);
      $('#hideParticipateList').attr('checked', true);
      $('#hideParticipateList').click();
    }
    var $showSummary = $('#showSummary'),
      $hideSummary = $('#hideSummary');
    var $summaryAreaTypeContainer = $(
        '[data-ele="summary-area-type-container"]'
      ),
      $summaryAreaType = $('[data-ele="summary-area-type"]'),
      $summaryAreaSet = $('[data-ele="summary-area-set"]'),
      $summaryAreaSet2 = $('[data-ele="summary-area-set"][data-type="2"]'),
      $targetAmount = $('#target-amount');
    if (getContent.showStatictics != 0) {
      $showSummary.attr('checked', true);
      $hideSummary.attr('checked', false);
      $('[data-ele="summary-area-type"]').removeClass('active');
      $(
        '[data-ele="summary-area-type"][data-type="' +
          getContent.showStatictics +
          '"]'
      ).addClass('active');
      $summaryAreaTypeContainer.show();
      if (getContent.showStatictics == 2) {
        $targetAmount.val(getContent.targetAmount);
        $summaryAreaSet2.show();
      } else {
        $summaryAreaSet2.hide();
      }
    } else {
      $showSummary.attr('checked', false);
      $hideSummary.attr('checked', true);
      $summaryAreaTypeContainer.hide();
    }
    if (getContent.showEndTime == 1) {
      $('#showRemainingTime').attr('checked', true);
      $('#hideRemainingTime').attr('checked', false);
      $('#showRemainingTime').click();
    } else {
      $('#showRemainingTime').attr('checked', false);
      $('#hideRemainingTime').attr('checked', true);
      $('#hideRemainingTime').click();
    }
    const { feedbackType } = getContent;
    const $feedbackImgContainer = $('#feedback-img-container');
    if (feedbackType === 0) {
      $('#hide-feedback-img').prop('checked', !0);
      $feedbackImgContainer.hide();
    } else {
      $('#show-feedback-img').prop('checked', !0);
      $(`[data-ele="feedback-type"][data-type="${feedbackType}"]`).click();
      $feedbackImgContainer.show();
    }
  },
  setIfOpenFeedback: function(getContent) {
    $(
      'input[name="if_feedback"][value="' +
        getContent.pay_succ_details_flag +
        '"]'
    ).prop({
      checked: !0,
    });
    getContent.pay_succ_details_flag && $('#myEditor2').removeClass('hide');
  },
  setPrinterStatus: function(getContent, ifLocalStorage) {
    var self = this,
      get_external_printers = getContent['printerId'],
      if_open_printer = getContent['isOpenPrinter'],
      get_internal_printer = '';
    if (!get_external_printers) {
      var get_subdivideStr = [];
      if (!ifLocalStorage) {
        get_subdivideStr = getContent['subdivideStr'];
      } else {
        get_subdivideStr = JSON.parse(getContent['subdivideStr']);
      }
      var hasSelectPrinterList = [];
      get_subdivideStr.map(function(value, index, arr) {
        if (value.printer !== '') {
          value.printer.map(function(valueB, indexB, arrB) {
            if (hasSelectPrinterList.indexOf(valueB.printerId) === -1) {
              hasSelectPrinterList.push(valueB.printerId);
            }
          });
        }
      });
      hasSelectPrinterList.sort(function(a, b) {
        return a - b;
      });
      hasSelectPrinterList[0] &&
        (self.show_printer_id = hasSelectPrinterList[0]);
      self.show_printer_type = 1;
    } else {
      if (if_open_printer) {
        get_external_printers &&
          get_external_printers != '[]' &&
          (self.show_printer_id = get_external_printers);
        self.show_printer_type = 0;
        var add_wrap_obj = {};
        add_wrap_obj['isOpenPrinter'] = getContent.isOpenPrinter;
        add_wrap_obj['printerId'] = getContent.printerId;
        add_wrap_obj['continuousPrintNum'] = getContent.continuousPrintNum;
        add_wrap_obj['qrcodePrint'] = getContent.qrcodePrint;
        add_wrap_obj['isPrintMobile'] = getContent.isPrintMobile;
        no_selection_list.push(add_wrap_obj);
        overall_if_open_printer = getContent.isOpenPrinter;
      }
    }
    self.show_printer_id && self.change_printer_text('已设置');
  },
  change_printer_text: function(set_text) {
    $('[data-type="set_print"]').text(set_text);
  },
  selection_change_printer_text: function(selectionStatus) {
    var self = this;
    self.show_printer_type == null
      ? self.change_printer_text('设置')
      : selectionStatus
      ? !self.show_printer_type
        ? self.change_printer_text('设置')
        : self.change_printer_text('已设置')
      : !self.show_printer_type && overall_if_open_printer
      ? self.change_printer_text('已设置')
      : self.change_printer_text('设置');
  },
});
var sizesAdditionModel = Backbone.Model.extend({
  defaults: {
    subType: '',
    inputId: '',
    cid: '',
    inputType: 1,
    name: '',
    is_must: 1,
    prompt_text: '',
    describe: '',
    dataType: 2,
    selectInput: [],
    pic_num: 0,
    font_length: 0,
    isVerify: 0,
  },
});
var sizesAdditionCollection = Backbone.Collection.extend({
  model: sizesAdditionModel,
  comparator: 'sort',
});
var SizesAdditionView = Backbone.View.extend({
  tagName: 'tr',
  className: 'ui-state-default',
  render: function() {
    var self = this,
      template = juicer(config.template.component.sizesAdditionItem_tmp),
      my_json = self.model.toJSON();
    modelDispose.method.add_default_title_prompt_text(my_json, self.model);
    var html = template.render(my_json),
      selectpicker = self.$el.html(html).find('.selectpicker');
    self.$el.attr('id', this.model.cid);
    selectpicker.selectpicker({
      noneSelectedText: '未选择',
    });
    my_json.inputType == 3 &&
      my_json.dataType == 2 &&
      ((my_json.dataType = 0), self.model.set('dataType', 0));
    $(selectpicker.get(0)).selectpicker('val', self.model.get('inputType'));
    $(selectpicker.get(0)).selectpicker('refresh');
    $(selectpicker.get(0)).on('changed.bs.select', function(e) {
      var psType = $(e.currentTarget).val();
      self.model.set('inputType', psType);
      if (psType == 15) {
        self.model.set('font_length', 200);
      } else {
        self.model.set('font_length', 0);
      }
      modelDispose.method.change_prompt_text(e.target.value, self.model);
    });
    if (self.model.get('inputType') == 2 || self.model.get('inputType') == 9) {
      this.$el.find('.datePreview').datetimepicker({
        keyboardNavigation: false,
        language: 'zh-CN',
        todayHighlight: true,
        forceParse: false,
        autoclose: true,
        clearBtn: false,
      });
    }
    return this;
  },
});
var SizesAdditionsView = Backbone.View.extend({
  initialize: function() {
    this.model.on(
      'change:inputType change:is_must change:dataType change:name change:prompt_text change:selectInput',
      this.render,
      this
    );
  },
  render: function() {
    var self = this;
    var fragment = document.createDocumentFragment();
    this.model.each(function(sizeModal, index, models) {
      sizeModal.set('cid', sizeModal.cid);
      sizeModal.set('sort', index);
      var sizesAdditionView = new SizesAdditionView({
        model: sizeModal,
      });
      fragment.appendChild(sizesAdditionView.render().el);
    });
    self.$el.html(fragment);
    var $specialSubPsBox = $('#special-sub-ps-box');
    $specialSubPsBox.html('');
    $('#sizesAdditionBox')
      .find('tr')
      .each(function(index, ele) {
        var $ele = $(ele),
          psId = $ele.attr('id'),
          subType = self.model.get(psId).get('subType'),
          inputType = self.model.get(psId).get('inputType');
        if (
          (subType === 2 && (inputType === 10 || inputType === 11)) ||
          (subType === 3 && (inputType === 12 || inputType === 15)) ||
          (subType === 4 &&
            (inputType === 4 || inputType === 5 || inputType === 6))
        ) {
          $specialSubPsBox.append($ele.prop('outerHTML'));
          $ele.remove();
        }
      });
  },
});
var SizeModel = Backbone.Model.extend({
  idAttribute: 'p_id',
  defaults: {
    cid: '',
    name: '普通佛事',
    price: '',
    stock: '',
    endTime: '',
    durationDay: 0,
    enroll_num: 0,
    pic: '',
    id: '',
    printer: [],
    explain: '',
    isSingleMoney: 1,
    isAutoFinish: 0,
    subdivide_type: 1,
  },
  initialize: function(options) {
    this.set('postScript', options.postScript);
  },
});
var SizeCollection = Backbone.Collection.extend({
  model: SizeModel,
  comparator: 'sort',
});
var SizeView = Backbone.View.extend({
  tagName: 'tr',
  className: 'ui-state-default',
  render: function() {
    var self = this,
      template = juicer(config.template.component.size_tmp),
      my_json = self.model.toJSON();
    var html = template.render(my_json),
      sizehtml = html.replace(/sizePic0/, 'sizePic' + sizeIteration++),
      selectpicker = self.$el.html(sizehtml).find('.selectpicker');
    this.$el.attr('id', this.model.cid);
    selectpicker.selectpicker({
      noneSelectedText: '未选择',
    });
    $(selectpicker.get(0)).selectpicker(
      'val',
      self.model.get('subdivide_type')
    );
    $(selectpicker.get(0)).selectpicker('refresh');
    $(selectpicker.get(0)).on('changed.bs.select', function(e) {
      var subType = parseInt(e.currentTarget.value),
        pic = self.model.get('pic'),
        wangshengSrc =
          'https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png',
        qifuSrc =
          'https://pic.zizaihome.com/7d424d78-0d6f-11e8-8feb-00163e0c001e.png';
      var psModelArr = self.model.get('postScript');
      if (!psModelArr) {
        if (subType === 2) {
          psModelArr = new sizesAdditionCollection([
            new sizesAdditionModel({
              dataType: 2,
              describe: '',
              font_length: 8,
              inputId: '',
              inputType: 10,
              is_must: 1,
              name: '阳上人',
              pic_num: 0,
              prompt_text: '请填写功德主姓名（在世）',
              selectInput: [],
              durationDay: 0,
              subType: 2,
            }),
            new sizesAdditionModel({
              dataType: 2,
              describe: '',
              font_length: 8,
              inputId: '',
              inputType: 11,
              is_must: 1,
              name: '往生者',
              pic_num: 4,
              prompt_text: '请填写已故者姓名（已去世）',
              selectInput: [],
              durationDay: 0,
              subType: 2,
            }),
          ]);
        } else if (subType === 3) {
          psModelArr = new sizesAdditionCollection([
            new sizesAdditionModel({
              dataType: 2,
              describe: '',
              font_length: 8,
              inputId: '',
              inputType: 12,
              is_must: 1,
              name: '功德芳名',
              pic_num: 4,
              prompt_text: '请填写功德主姓名',
              selectInput: [],
              durationDay: 0,
              subType: 3,
            }),
            new sizesAdditionModel({
              dataType: 2,
              describe: '',
              font_length: 20,
              inputId: '',
              inputType: 15,
              is_must: 1,
              name: '心愿',
              pic_num: 0,
              prompt_text: '请填写您的心愿',
              selectInput: [],
              durationDay: 0,
              subType: 3,
            }),
          ]);
        } else if (subType === 4) {
          psModelArr = new sizesAdditionCollection([
            new sizesAdditionModel({
              dataType: 2,
              describe: '',
              font_length: 8,
              inputId: '',
              inputType: 4,
              is_must: 1,
              name: '联系人',
              pic_num: 0,
              prompt_text: '请填写联系人姓名（方便寺院与您联系）',
              selectInput: [],
              durationDay: 0,
              subType: 4,
            }),
            new sizesAdditionModel({
              dataType: 2,
              describe: '',
              font_length: 20,
              inputId: '',
              inputType: 5,
              is_must: 1,
              name: '手机号码',
              pic_num: 0,
              prompt_text: '请填写联系人电话（方便寺院与您联系）',
              selectInput: [],
              durationDay: 0,
              subType: 4,
            }),
            new sizesAdditionModel({
              dataType: 2,
              describe: '',
              font_length: 20,
              inputId: '',
              inputType: 6,
              is_must: 1,
              name: '地址',
              pic_num: 0,
              prompt_text: '请填写您常用的居住地址',
              selectInput: [],
              durationDay: 0,
              subType: 4,
            }),
          ]);
        }
      } else {
        psModelArr.models.map(function(ps) {
          ps.set('subType', parseInt(e.target.value));
        });
        if (subType === 3) {
          var FMPs = [],
            XYPs = [],
            otherPs = [];
          psModelArr.models.map(function(ps) {
            if (ps.get('inputType') === 12) {
              if (ps.get('font_length') === 0) {
                ps.set('font_length', 8);
              }
              if (ps.get('pic_num') === 0) {
                ps.set('pic_num', 4);
              }
              FMPs.push(ps);
            } else if (ps.get('inputType') === 15) {
              if (ps.get('font_length') === 0) {
                ps.set('font_length', 20);
              }
              ps.set('pic_num', 0);
              XYPs.push(ps);
            } else {
              otherPs.push(ps);
            }
          });
          if (!FMPs.length) {
            FMPs.push(
              new sizesAdditionModel({
                dataType: 2,
                describe: '',
                font_length: 8,
                inputId: '',
                inputType: 12,
                is_must: 1,
                name: '功德芳名',
                pic_num: 4,
                prompt_text: '请填写功德主姓名',
                selectInput: [],
                durationDay: 0,
                subType: 3,
              })
            );
          }
          if (!XYPs.length) {
            XYPs.push(
              new sizesAdditionModel({
                dataType: 2,
                describe: '',
                font_length: 20,
                inputId: '',
                inputType: 15,
                is_must: 1,
                name: '心愿',
                pic_num: 0,
                prompt_text: '请填写您的心愿',
                selectInput: [],
                durationDay: 0,
                subType: 3,
              })
            );
          }
          psModelArr.models = FMPs.concat(XYPs, otherPs);
        } else if (subType === 2) {
          var YSRPs = [],
            WSZPs = [],
            otherPs = [];
          psModelArr.models.map(function(ps) {
            if (ps.get('inputType') === 10) {
              if (ps.get('font_length') === 0) {
                ps.set('font_length', 8);
              }
              ps.set('pic_num', 0);
              YSRPs.push(ps);
            } else if (ps.get('inputType') === 11) {
              if (ps.get('font_length') === 0) {
                ps.set('font_length', 8);
              }
              if (ps.get('pic_num') === 0) {
                ps.set('pic_num', 4);
              }
              WSZPs.push(ps);
            } else {
              otherPs.push(ps);
            }
          });
          if (!YSRPs.length) {
            YSRPs.push(
              new sizesAdditionModel({
                dataType: 2,
                describe: '',
                font_length: 8,
                inputId: '',
                inputType: 10,
                is_must: 1,
                name: '阳上人',
                pic_num: 0,
                prompt_text: '请填写功德主姓名（在世）',
                selectInput: [],
                durationDay: 0,
                subType: 2,
              })
            );
          }
          if (!WSZPs.length) {
            WSZPs.push(
              new sizesAdditionModel({
                dataType: 2,
                describe: '',
                font_length: 8,
                inputId: '',
                inputType: 11,
                is_must: 1,
                name: '往生者',
                pic_num: 4,
                prompt_text: '请填写已故者姓名（已去世）',
                selectInput: [],
                durationDay: 0,
                subType: 2,
              })
            );
          }
          psModelArr.models = YSRPs.concat(WSZPs, otherPs);
        } else if (subType === 4) {
          var ps4 = [],
            ps5 = [],
            ps6 = [],
            psOther = [];
          psModelArr.models.map(function(ps) {
            if (ps.get('inputType') === 4) {
              ps4.push(ps);
            } else if (ps.get('inputType') === 5) {
              ps5.push(ps);
            } else if (ps.get('inpputType') === 6) {
              ps6.push(ps);
            } else {
              psOther.push(ps);
            }
          });
          if (!ps4.length) {
            ps4.push(
              new sizesAdditionModel({
                dataType: 2,
                describe: '',
                font_length: 8,
                inputId: '',
                inputType: 4,
                is_must: 1,
                name: '联系人',
                pic_num: 0,
                prompt_text: '请填写联系人姓名（方便寺院与您联系）',
                selectInput: [],
                durationDay: 0,
                subType: 4,
              })
            );
          }
          if (!ps5.length) {
            ps5.push(
              new sizesAdditionModel({
                dataType: 2,
                describe: '',
                font_length: 20,
                inputId: '',
                inputType: 5,
                is_must: 1,
                name: '手机号码',
                pic_num: 0,
                prompt_text: '请填写联系人电话（方便寺院与您联系）',
                selectInput: [],
                durationDay: 0,
                subType: 4,
              })
            );
          }
          if (!ps6.length) {
            ps6.push(
              new sizesAdditionModel({
                dataType: 2,
                describe: '',
                font_length: 20,
                inputId: '',
                inputType: 6,
                is_must: 1,
                name: '地址',
                pic_num: 0,
                prompt_text: '请填写您常用的居住地址',
                selectInput: [],
                durationDay: 0,
                subType: 4,
              })
            );
          }
          psModelArr.models = ps4.concat(ps5, ps6, psOther);
        }
      }
      self.model.set('postScript', psModelArr);
      self.model.set('subdivide_type', subType);
      if (subType === 1) {
        if (pic === wangshengSrc || pic === qifuSrc) {
          self.model.set('pic', '');
        }
      } else if (subType === 2) {
        if (pic === '' || pic === qifuSrc) {
          self.model.set('pic', wangshengSrc);
        }
      } else if (subType === 3) {
        if (pic === '' || pic === wangshengSrc) {
          self.model.set('pic', qifuSrc);
        }
      } else if (subType === 4) {
        if (pic === wangshengSrc || pic === qifuSrc) {
          self.model.set('pic', '');
        }
      }
    });
    if (this.model.get('pic').length > 0) {
      var img = document.createElement('img');
      img.src = this.model.get('pic');
      var top = 0;
      var left = 0;
      $(img).addClass('rePos');
      $(img).css({
        width: '50px',
        height: '50px',
        'z-index': '-1',
        position: 'absolute',
        top: top,
        left: left,
      });
      this.$el
        .find('.upload_box')
        .addClass('upload_wrap_change')
        .append(img);
      var sizeSpan = document.createElement('span');
      sizeSpan.setAttribute(
        'class',
        'glyphicon glyphicon-remove-circle delSmallPic'
      );
      sizeSpan.setAttribute(
        'style',
        'position:absolute;right:0px;top:0px;color:rgb(212, 106, 64);'
      );
      this.$el.find('.upload_box').append(sizeSpan);
    }
    var isAutoFinish = !!this.model.get('isAutoFinish');
    this.$('.autoFinishSwitch').bootstrapSwitch({
      size: 'mini',
      onText: '开',
      offText: '关',
      onColor: 'primary',
      offColor: 'info',
      state: isAutoFinish,
      onSwitchChange: function() {
        var num = Number(!self.model.get('isAutoFinish'));
        self.model.set('isAutoFinish', num);
      },
    });
    self.$el.find('[data-ele="tooltip"]').tooltip();
    return this;
  },
});
var sizesViewRendering = !1;
var SizesView = Backbone.View.extend({
  initialize: function() {
    this.model.on(
      'change:cid change:name change:stock change:pic change:id change:subdivide_type change:selectInput change:isSingleMoney',
      this.render,
      this
    );
  },
  render: function() {
    if (sizesViewRendering) return;
    sizesViewRendering = !0;
    sizeIteration = 0;
    var self = this;
    var fragment = document.createDocumentFragment();
    this.model.each(function(sizeModal, index, models) {
      sizeModal.set('cid', sizeModal.cid);
      sizeModal.set('sort', index);
      var sizeView = new SizeView({
        model: sizeModal,
      });
      fragment.appendChild(sizeView.render().el);
    });
    self.$el.html(fragment);
    sizesViewRendering = !1;
  },
});
var AdditionModel = Backbone.Model.extend({
  defaults: {
    inputId: '',
    cid: '',
    inputType: 1,
    name: '',
    is_must: 1,
    prompt_text: '',
    describe: '',
    dataType: 2,
    selectInput: [],
    pic_num: 1,
    font_length: 200,
    isVerify: 0,
  },
});
var AdditionCollection = Backbone.Collection.extend({
  model: AdditionModel,
  comparator: 'sort',
});
var AdditionView = Backbone.View.extend({
  tagName: 'tr',
  className: 'ui-state-default',
  render: function() {
    var self = this,
      template = juicer(config.template.component.additionItem_tmp),
      my_json = self.model.toJSON();
    modelDispose.method.add_default_title_prompt_text(my_json, self.model);
    var html = template.render(my_json),
      selectpicker = self.$el.html(html).find('.selectpicker');
    self.$el.attr('id', this.model.cid);
    selectpicker.selectpicker({
      noneSelectedText: '未选择',
    });
    my_json.inputType == 3 &&
      my_json.dataType == 2 &&
      ((my_json.dataType = 0), self.model.set('dataType', 0));
    $(selectpicker.get(0)).selectpicker('val', self.model.get('inputType'));
    $(selectpicker.get(0)).selectpicker('refresh');
    $(selectpicker.get(0)).on('changed.bs.select', function(e) {
      var psType = $(e.currentTarget).val();
      if (psType == 2 || psType == 9) {
        $(e.target)
          .parents('td')
          .next()
          .next()
          .find('input')
          .eq(0)
          .attr('placeholder', '');
      }
      self.model.set('inputType', psType);
      if (psType == 15) {
        self.model.set('font_length', 200);
      } else {
        self.model.set('font_length', 0);
      }
      modelDispose.method.change_prompt_text(e.target.value, self.model);
    });
    if (self.model.get('inputType') == 2 || self.model.get('inputType') == 9) {
      this.$el.find('.datePreview').datetimepicker({
        keyboardNavigation: false,
        language: 'zh-CN',
        todayHighlight: true,
        forceParse: false,
        autoclose: true,
        clearBtn: false,
      });
    }
    return this;
  },
});
var AdditionsView = Backbone.View.extend({
  initialize: function() {
    this.model.on(
      'change:name change:inputType change:is_must change:dataType change:prompt_text change:selectInput',
      this.render,
      this
    );
  },
  render: function() {
    var self = this;
    var fragment = document.createDocumentFragment();
    this.model.each(function(sizeModal, index, models) {
      sizeModal.set('cid', sizeModal.cid);
      sizeModal.set('sort', index);
      var sizeView = new AdditionView({
        model: sizeModal,
      });
      fragment.appendChild(sizeView.render().el);
    });
    self.$el.html(fragment);
  },
});
var msgListView = new View();
$(function() {
  $('[data-toggle="tooltip"]').tooltip();
  if (!is_test_environment) {
    var inputFoshiTypeId = ceremonyMap.ceremonyTypeId;
    if (typeof inputFoshiTypeId === 'undefined') return false;
    console.log(ceremonyMap);
    $('#proName').val(ceremonyMap.title);
    $('#show-join-num').bootstrapSwitch(
      'state',
      !!ceremonyMap.allow_showVistNum
    );
    msgListView.showimgs(ceremonyMap);
    $('#summary').val(ceremonyMap.custom_introduce);
    $('#summary').trigger('keyup');
    msgListView.showDetail(ceremonyMap);
    if (
      typeof ceremonyMap.isOpenPrinter != 'undefined' &&
      ceremonyMap.isOpenPrinter != null &&
      editType != 0
    ) {
      var add_wrap_obj = {};
      add_wrap_obj['isOpenPrinter'] = ceremonyMap.isOpenPrinter;
      add_wrap_obj['printerId'] = ceremonyMap.printerId;
      add_wrap_obj['continuousPrintNum'] = ceremonyMap.continuousPrintNum;
      add_wrap_obj['qrcodePrint'] = ceremonyMap.qrcodePrint;
      add_wrap_obj['isPrintMobile'] = ceremonyMap.isPrintMobile;
      no_selection_list.push(add_wrap_obj);
      overall_if_open_printer = ceremonyMap.isOpenPrinter;
    }
    if (typeof ceremonyMap.subdivideStr !== 'undefined') {
      msgListView.showSizes(ceremonyMap);
    } else {
      msgListView.showPrimeSize(ceremonyMap);
    }
    msgListView.showAddition(ceremonyMap);
    msgListView.showOthers(ceremonyMap);
    msgListView.setPrinterStatus(ceremonyMap);
    msgListView.setIfOpenFeedback(ceremonyMap);
  }
  if ($('#pictureBox').find('img').length >= 5) {
    $('#pictureBox')[0].firstElementChild.setAttribute(
      'class',
      'myupload upload_box ui-sortable-handle hideEle'
    );
  } else {
    $('#pictureBox')[0].firstElementChild.setAttribute(
      'class',
      'myupload upload_box ui-sortable-handle'
    );
  }
});
