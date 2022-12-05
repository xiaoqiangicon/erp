import $ from 'jquery';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import Toast from 'old/toast';
import Data from './data';
import tpl from './tpl';
import func from './function';
import Clipboard from 'clipboard';
import Promotion from '../../../com-deprecated/promotion';
import ChooseImage from '../../../com-deprecated/choose-image';
import api from './api';
import '../../../../../pro-com/src/libs-es5/jquery-qrcode';
import * as handling from '../../../../../pro-com/src/handling';
import 'jquery-confirm';
import toastr from 'toastr';
import './ajax';
import seeAjax from 'see-ajax';
import seeView from 'see-view';

toastr.options.closeHtml = '<button><i class="toastr-icon-off"></i></button>';
seeView({
  events: {
    'keyup [data-ele="s-textarea"]': 'onKeyupSTextarea',
    'changed.bs.select #buddhist-type-select': 'onChangeBuddhistTypeSelect',
    'changed.bs.select #buddhist-status-select': 'onChangeBuddhistStatusSelect',
    'click #search': 'onClickSearch',
    'click #table-title-total-join': 'sortByJoinNum',
    'click #table-title-total-collect': 'sortByMoney',
    'click [data-content]': 'onClickContent',
    'click [data-opt="edit"]': 'onClickOptEdit',
    'click [data-opt="promotion"]': 'onClickOptPromotion',
    'click [data-opt="del"]': 'onClickOptDel',
    'click [data-opt="copy"]': 'onClickOptCopy',
    'click [data-opt="set-tmpl"]': 'onClickOptSetTmpl',
    'click [data-opt="end"]': 'onClickOptEnd',
    'click [data-opt="schedule"]': 'onClickOptSchedule',
    'change [data-ele="more-opt"]': 'onClickMoreOpt',
    'hidden.bs.select [data-ele="more-opt"]': 'hiddenMoreOpt',
    'click #confirm-set-tmpl': 'onClickConfirmSetTmpl',
    'click #cancel-set-tmpl': 'onClickCancelSetTmpl',
    'show.bs.modal #set-prt-modal': 'onShowSetPrtModal',
    'changed.bs.select #sub-prt-select': 'onChangeSubPrtSelect',
    'click [data-ele="sub-checkbox"]': 'onClickSubCheckbox',
    'changed.bs.select #prt-num-select': 'onChangePrtNumSelect',
    'click [name="prt-qrcode"]': 'onClickPrtQrcode',
    'click [name="prt-tel"]': 'onClickPrtTel',
    'click [name="no-sub-prt-switch"]': 'onClickNoSubPrtSwitch',
    'click [data-ele="no-sub-prt-checkbox"]': 'onClickNoSubPrtCheckbox',
    'click #save-prt-set': 'onClickSavePrtSet',
    'click [data-ele="modal-head-nav"]': 'onClickModalHeadNav',
    'click [data-ele="add-img"]': 'onClickAddImg',
    'click [data-ele="del-video-upload"]': 'onClickDelUploadVideo',
    'click [data-ele="del-img"]': 'onClickDelImg',
    'click [data-ele="del-video"]': 'onClickDelVideo',
    'click [data-ele="play-video"]': 'onClickPlayVideo',
    'click #video-player-mask': 'onClickVideoPlayerMask',
    'input #edit-link-input': 'inputLink',
    'click #save-schedule': 'onClickSaveSchedule',
    'click [data-link-radio]': 'onClickLinkRadio',
    'click [data-ele="edit-schedule-item"]': 'onClickEditScheduleItem',
    'click [data-ele="save-schedule-item"]': 'onClickSaveScheduleItem',
    'click [data-ele="cancel-schedule-item"]': 'onClickCancelScheduleItem',
    'click [data-ele="prt-pw-qrcode-btn"]': 'onClickPrtPwQrcodeBtn',
    'click [data-ele="prt-pw-seal-btn"]': 'onClickPrtSealBtn',
  },
  onKeyupSTextarea: function(e) {
    var $curTar = $(e.currentTarget),
      $numTip = $curTar.next(),
      textLen = $curTar.val().length,
      maxLen = $curTar.prop('maxlength');
    $numTip.html(textLen + '/' + maxLen);
  },
  onChangeBuddhistTypeSelect: function(e) {
    $('#search').click();
  },
  onChangeBuddhistStatusSelect: function(e) {
    $('#search').click();
  },
  onClickSearch: function(e) {
    var buddhistTypeId = parseInt($('#buddhist-type-select').val()),
      buddhistStatus = parseInt($('#buddhist-status-select').val()),
      searchText = $('#search-input').val();
    Data.getListParams.page = 0;
    Data.getListParams.typeId = buddhistTypeId;
    Data.getListParams.filterType = buddhistStatus;
    Data.getListParams.searchText = searchText;
    func.refreshList();
  },
  sortByJoinNum: function(e) {
    func.sortAndRenderList($('#table-title-total-join'), 'orderByJoinNum');
  },
  sortByMoney: function(e) {
    func.sortAndRenderList(
      $('#table-title-total-collect'),
      'orderByCollectMoney'
    );
  },
  onClickContent: function(e) {
    var $curTar = $(e.currentTarget);
    var content = $curTar.attr('data-content');
    console.log(content);

    toastr.info(content, '不通过原因', {
      timeOut: 10000 + (content.length > 60 ? (content.length - 60) / 8 : 0),
      // extendedTimeOut: 0,

      closeButton: !0,
      positionClass: 'toast-center-center',
      escapeHtml: !1,
    });
  },
  onClickOptEdit: function(e) {
    var $curTar = $(e.currentTarget),
      $curTr = $curTar.parents('tr'),
      id = parseInt($curTr.attr('data-id')),
      verify = parseInt($curTar.attr('data-verify'));
    if (verify === 1) {
      window.location.href =
        '/zzhadmin/createCeremonyIndex/?id=' + id + '&edit=1&verifyId=1';
    } else if (verify === 2) {
      window.location.href =
        '/zzhadmin/createCeremonyIndex/?id=' + id + '&edit=1&verifyId=2';
    } else {
      window.location.href =
        '/zzhadmin/createCeremonyIndex/?id=' + id + '&edit=1&verifyId=0';
    }
  },
  onClickOptPromotion: function(e) {
    var $tar = $(e.target),
      $loadingToastTitle = $('#loading-toast-title'),
      $loadingToast = $('#loading-toast'),
      id = parseInt($tar.attr('data-id')),
      name = Data.handleListData[id].name,
      status = parseInt($tar.attr('data-status')),
      title = status === 0 ? '推广' : '预览 (此链接为临时链接，仅供预览)',
      url = $tar.attr('data-url');
    Promotion.show({
      title: title,
      typeText: '项目',
      link: url,
      showPost: !0,
      postTitle: name,
      maxPostTitle: 30,
      loadPost: function(callback, title) {
        $loadingToastTitle.html('生成海报中，请耐心等待...');
        $loadingToast.show();
        var titleList = [];
        var titleStr = '';
        title.split('\n').map(function(value, index) {
          if (value.length > 20) {
            titleList.push(value.substr(0, 10));
            titleList.push(value.substr(10, 10));
            titleList.push(value.substr(20));
          } else if (value.length > 10) {
            titleList.push(value.substr(0, 10));
            titleList.push(value.substr(10));
          } else {
            titleList.push(value);
          }
        });
        titleStr = titleList.join('|$|');
        seeAjax(
          'getBuddhistPoster',
          {
            commodityId: id,
            title: titleStr,
          },
          function(res) {
            if (res.success) {
              $loadingToastTitle.html('');
              $loadingToast.hide();
              var postImageUrl = res.pic;
              callback(postImageUrl, postImageUrl);
            } else {
              res.message && commonFunc.alert(res.message);
            }
          }
        );
      },
    });
  },
  onClickOptDel: function(e) {
    var $curTar = $(e.currentTarget),
      $curTr = $curTar.parents('tr'),
      id = parseInt($curTar.attr('data-id'));
    $.confirm({
      title: false,
      content: '你确定删除吗?',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            func.deleteItem(
              {
                id: id,
              },
              function(res) {
                $curTr.remove();
              }
            );
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  onClickOptCopy: function(e) {
    var $curTar = $(e.currentTarget),
      $curTr = $curTar.parents('tr'),
      id = parseInt($curTr.attr('data-id'));
    $.confirm({
      title: false,
      content: '你确定复制该项目吗?',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            window.location.href =
              '/zzhadmin/createCeremonyIndex/?id=' + id + '&edit=0';
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  onClickOptSetTmpl: function(e) {
    var $curTar = $(e.currentTarget),
      $curTr = $curTar.parents('tr'),
      $myModal = $('#set-tmpl-modal'),
      id = parseInt($curTr.attr('data-id'));
    $myModal.attr('data-id', id);
    $myModal.show();
  },
  onClickOptEnd: function(e) {
    var $curTar = $(e.currentTarget),
      $curTr = $curTar.parents('tr'),
      id = parseInt($curTr.attr('data-id'));
    $.confirm({
      title: false,
      content: '你确定要结束正在进行中的项目吗',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            func.endItem(
              {
                commodityId: id,
              },
              function(res) {
                Data.handleListData[id].isEnd = 1;
                func.renderTr(id);
              }
            );
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  onClickOptSchedule: function(e) {
    var $curTar = $(e.currentTarget),
      $curTr = $curTar.parents('tr'),
      id = parseInt($curTr.attr('data-id'), 10),
      $scheduleModal = $('#schedule-modal');
    Data.curBuddhistId = id;
    func.initScheduleModal(0);
    $scheduleModal.modal('show');
  },
  onClickMoreOpt: function(e) {
    var self = this,
      $tar = $(e.target),
      getValue = parseInt($tar.val());
    switch (getValue) {
      case 0:
        self.onClickOptDel(e);
        break;
      case 1:
        self.onClickOptCopy(e);
        break;
      case 2:
        self.onClickOptSetTmpl(e);
        break;
      case 3:
        self.onClickOptPromotion(e);
        break;
      case 4:
        self.onClickOptEnd(e);
        break;
      case 5:
        self.onClickOptSchedule(e);
      default:
        break;
    }
  },
  hiddenMoreOpt: function(e) {
    var $tar = $(e.target);
    $tar.val(-1).selectpicker('refresh');
  },
  onClickConfirmSetTmpl: function(e) {
    var $myModal = $('#set-tmpl-modal'),
      id = parseInt($myModal.attr('data-id')),
      name = $('#tmpl-name').val(),
      params = {};
    params.commodityId = id;
    params.name = name;
    seeAjax('addTemplate', params, function(res) {
      if (res.success) {
        window.location.href = '/zzhadmin/selectCeremonyTemplate/';
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  },
  onClickCancelSetTmpl: function(e) {
    var $myModal = $('#set-tmpl-modal'),
      $tmplName = $('#tmpl-name');
    $myModal.attr('data-id', '');
    $tmplName.val('');
    $myModal.fadeOut();
  },
  onShowSetPrtModal: function(e) {
    var $modal = $('#set-prt-modal'),
      $relatedTar = $(e.relatedTarget),
      curId = parseInt($relatedTar.attr('data-id'));
    (Data.ifHasSub =
      $relatedTar.attr('data-ifHasSub') === 'true' ? true : false),
      $modal.attr('data-id', curId);
    seeAjax('printerList', {}, function(res) {
      if (res.success) {
        Data.getPrinterListRes = res;
        if (res.data.length === 0) {
          var $noPrtModal = $('#no-prt-modal');
          $noPrtModal.modal('show');
          return false;
        } else {
          if (Data.ifHasSub) {
            seeAjax(
              'CommoditySubdivide',
              {
                commodityId: curId,
              },
              function(res) {
                Data.getSubListRes = res;
                func.initSetPrtModal(
                  Data.ifHasSub,
                  Data.getPrinterListRes,
                  Data.getSubListRes
                );
                func.getAndRenderPrtCfg(curId);
              }
            );
          } else {
            func.initSetPrtModal(Data.ifHasSub, Data.getPrinterListRes);
            func.getAndRenderPrtCfg(curId);
          }
        }
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  },
  onChangeSubPrtSelect: function(e) {
    var $tar = $(e.target),
      $exceptionTip = $('#exception-tip'),
      $prtNumSelect = $('#prt-num-select'),
      $prtTel = $('#prt-tel'),
      $prtAllQrcode = $('#prt-all-qrcode'),
      $subCheckbox = $('[data-ele="sub-checkbox"]'),
      prtId = parseInt($tar.val());

    // 筛选出所选中的打印机列表
    let selectPrinter = {};
    Data.getPrinterListRes.data.forEach(item => {
      if (item.id === prtId) {
        selectPrinter = item;
      }
    });
    if (selectPrinter.type === 0) {
      $('[data-prt-type="0"]').removeClass('hide');
      $('[data-prt-type="1"]').addClass('hide');
    } else {
      $('[data-prt-type="1"]').removeClass('hide');
      $('[data-prt-type="0"]').addClass('hide');
    }
    console.log(e.target, 'printer', Data.localPrtCfg, prtId);
    $exceptionTip.text('状态查询中...').show();
    $prtNumSelect.val(1).selectpicker('refresh');
    $prtTel.prop('checked', 'checked');
    $prtAllQrcode.prop('checked', 'checked');
    $subCheckbox.attr('checked', false);
    $subCheckbox.prop('checked', false);
    $subCheckbox.removeAttr('disabled');
    var data;
    if (Data.ifHasSub) {
      data = Data.localPrtCfg[prtId];
    } else {
      data = Data.localPrtCfg;
    }
    data.printerType = selectPrinter.type;
    func.renderSetPrtModal(Data.ifHasSub, Data.localPrtCfg, prtId);
  },
  onClickSubCheckbox: function(e) {
    var $modal = $('#set-prt-modal'),
      $target = $(e.target),
      curId = parseInt($modal.attr('data-id')),
      prtId = parseInt($('#sub-prt-select').val()),
      subId = parseInt($target.attr('data-id')),
      subCont = $target.next().html();
    if ($target.is(':checked')) {
      Data.localPrtCfg[prtId].subList.push(subId);
      Data.handleListData[curId].printerList.map(function(value) {
        if (value.printerId === prtId) {
          value.subNameList.push(subCont);
          value.notBoundSubNameList.splice(
            value.notBoundSubNameList.indexOf(subCont),
            1
          );
        }
      });
    } else {
      Data.localPrtCfg[prtId].subList.splice(
        Data.localPrtCfg[prtId].subList.indexOf(subId),
        1
      );
      Data.handleListData[curId].printerList.map(function(value) {
        if (value.printerId === prtId) {
          value.notBoundSubNameList.push(subCont);
          value.subNameList.splice(value.subNameList.indexOf(subCont), 1);
        }
      });
    }
  },
  onChangePrtNumSelect: function(e) {
    var $curTar = $(e.currentTarget),
      continuousPrintNum = parseInt($curTar.val()),
      qrcodePrint,
      data;
    if (Data.ifHasSub) {
      var prtId = parseInt($('#sub-prt-select').val());
      data = Data.localPrtCfg[prtId];
    } else {
      data = Data.localPrtCfg;
    }
    qrcodePrint = data.qrcodePrint;
    if (continuousPrintNum === 1 && qrcodePrint === 2) {
      alert('请先把“打印联数”设置为大于1，再设置隔联打印功能。');
      $curTar.val(data.continuousPrintNum).selectpicker('refresh');
    } else {
      data.continuousPrintNum = continuousPrintNum;
    }
  },
  onClickPrtQrcode: function(e) {
    var $curTar = $(e.currentTarget),
      qrcodePrint = parseInt($curTar.val()),
      continuousPrintNum,
      data;
    if (Data.ifHasSub) {
      var $subPrtSelect = $('#sub-prt-select'),
        prtId = parseInt($subPrtSelect.val());
      data = Data.localPrtCfg[prtId];
    } else {
      data = Data.localPrtCfg;
    }
    continuousPrintNum = data.continuousPrintNum;
    if (continuousPrintNum === 1 && qrcodePrint === 2) {
      alert('请先把“打印联数”设置为大于1，再设置隔联打印功能。');
      $('[name="prt-qrcode"][value="' + data.qrcodePrint + '"]').prop(
        'checked',
        'checked'
      );
    } else {
      data.qrcodePrint = qrcodePrint;
    }
  },
  onClickPrtTel: function(e) {
    var $curTar = $(e.currentTarget),
      isPrintMobile = parseInt($curTar.val()),
      data;
    if (Data.ifHasSub) {
      var $subPrtSelect = $('#sub-prt-select'),
        prtId = parseInt($subPrtSelect.val());
      data = Data.localPrtCfg[prtId];
    } else {
      data = Data.localPrtCfg;
    }
    data.isPrintMobile = isPrintMobile;
  },
  onClickNoSubPrtSwitch: function(e) {
    var $curTar = $(e.currentTarget),
      isOpenPrinter = parseInt($curTar.val()),
      data = Data.localPrtCfg,
      $modal = $('#set-prt-modal'),
      curId = parseInt($modal.attr('data-id')),
      $noSubPrtCheckBox = $('[data-ele="no-sub-prt-checkbox"]');
    if (isOpenPrinter) {
      $noSubPrtCheckBox.removeAttr('disabled');
      var printerListArr = [];
      $noSubPrtCheckBox.each(function(index, ele) {
        if ($(ele).is(':checked')) {
          var printerId = parseInt($(ele).attr('data-id')),
            printerName = $(ele)
              .next()
              .html();
          printerListArr.push({
            printerId: printerId,
            notBoundSubNameList: [],
            subNameList: [],
            address: printerName,
          });
        }
      });
      Data.handleListData[curId].printerList = printerListArr;
    } else {
      $noSubPrtCheckBox.attr('disabled', 'disabled');
      Data.handleListData[curId].printerList = [];
    }
    data.isOpenPrinter = isOpenPrinter;
  },
  onClickNoSubPrtCheckbox: function(e) {
    var $curTar = $(e.currentTarget),
      prtId = parseInt($curTar.attr('data-id')),
      prtName = $curTar.next().html(),
      ifChecked = $curTar.prop('checked'),
      $modal = $('#set-prt-modal'),
      $exceptionTip = $('#exception-tip'),
      curId = parseInt($modal.attr('data-id')),
      data = Data.localPrtCfg;
    if (ifChecked) {
      seeAjax(
        'printerStatus',
        {
          printerId: prtId,
        },
        function(res) {
          if (res.success) {
            $exceptionTip.text(prtName + ' ：' + res.msg).show();
            if (res.msg !== '在线，工作状态正常。') {
              $curTar.prop('checked', false);
              return;
            } else {
              data.printerId.push(prtId);
              Data.handleListData[curId].printerList.push({
                printerId: prtId,
                notBoundSubNameList: [],
                subNameList: [],
                address: prtName,
              });
            }
          } else {
            res.message && commonFunc.alert(res.message);
          }
        }
      );
    } else {
      $exceptionTip.text('').hide();
      data.printerId.splice(data.printerId.indexOf(prtId), 1);
      var delIndex;
      Data.handleListData[curId].printerList.map(function(prtItem, index) {
        if (prtItem.printerId === prtId) {
          delIndex = index;
        }
      });
      Data.handleListData[curId].printerList.splice(delIndex, 1);
    }
  },
  onClickPrtPwQrcodeBtn: function(e) {
    var $curTar = $(e.currentTarget),
      qrcode = parseInt($curTar.attr('data-value')),
      $prtPwQrcodeBtn = $('[data-ele="prt-pw-qrcode-btn"]'),
      $subPrtSelect = $('#sub-prt-select'),
      prtId = parseInt($subPrtSelect.val()),
      data;
    if (Data.ifHasSub) {
      data = Data.localPrtCfg[prtId];
    } else {
      data = Data.localPrtCfg;
    }
    $prtPwQrcodeBtn.removeClass('active');

    $curTar.addClass('active');
    data.qrcodePrint = qrcode;
  },
  onClickPrtSealBtn: function(e) {
    var $curTar = $(e.currentTarget),
      sealType = parseInt($curTar.attr('data-value')),
      $prtPwSealBtn = $('[data-ele="prt-pw-seal-btn"]'),
      $subPrtSelect = $('#sub-prt-select'),
      prtId = parseInt($subPrtSelect.val()),
      data;
    if (Data.ifHasSub) {
      data = Data.localPrtCfg[prtId];
    } else {
      data = Data.localPrtCfg;
    }
    $prtPwSealBtn.removeClass('active');

    $curTar.addClass('active');
    data.sealType = sealType;
  },
  onClickSavePrtSet: function(e) {
    var $modal = $('#set-prt-modal'),
      curId = parseInt($modal.attr('data-id'));
    if (Data.ifHasSub) {
      var checkExist = false;
      Object.keys(Data.localPrtCfg).map(function(key) {
        Data.localPrtCfg[key].subList.length && (checkExist = true);
      });
      if (!checkExist) {
        Toast('请至少选中一个规格', 2);
        return;
      }
    } else {
      if (
        Data.localPrtCfg.isOpenPrinter &&
        !Data.localPrtCfg.printerId.length
      ) {
        Toast('请至少选择一台打印机', 2);
        return;
      }
    }
    var params = func.createUpdatePrtParams(
      Data.ifHasSub,
      curId,
      Data.localPrtCfg,
      Data.getSubListRes.data
    );
    seeAjax('addAndUpdateCommodity2Printer', params, function(res) {
      if (res.success) {
        var printerDataResult = func.handleGetListPrinterData(
          Data.handleListData[curId]
        );
        Data.handleListData[curId].ifHasAddPrt = printerDataResult.ifHasAddPrt;
        Data.handleListData[curId].ifHasSub = printerDataResult.ifHasSub;
        Data.handleListData[curId].prtText = printerDataResult.prtText;
        func.renderTr(curId);
        $('#set-prt-modal').modal('hide');
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  },
  onClickModalHeadNav: function(e) {
    var $curTar = $(e.currentTarget),
      index = parseInt($curTar.attr('data-index'), 10);
    if (!$curTar.hasClass('active')) {
      func.initScheduleModal(index);
    }
  },
  onClickAddImg: function(e) {
    var $curTar = $(e.currentTarget);
    var upload = new ChooseImage({
      type: 1,
      multiUpload: true,
      multiSelect: true,
      fieldName: 'files',
      onSubmit: function(resData) {
        var htmlStr = '';
        resData.map(function(item) {
          htmlStr += tpl.scheduleImgCell.render({
            src: item.src,
          });
        });
        $curTar
          .parent()
          .prev()
          .append(htmlStr);
      },
    });
    upload.show();
  },
  onClickDelImg: function(e) {
    var $curTar = $(e.currentTarget),
      $curImgCell = $curTar.parents('[data-ele="img-cell"]');
    $curImgCell.remove();
  },
  onClickDelUploadVideo: function(e) {
    const $curTar = $(e.currentTarget);
    const $btn = $curTar
      .parent()
      .parent()
      .next()
      .find('[data-ele="add-video"]');
    Data.curUploadJqXHR.abort();
    $('[data-ele="video-upload-loading"]').remove();
    $btn.show();
  },
  onClickDelVideo: function(e) {
    var $curTar = $(e.currentTarget),
      $curVideoCell = $curTar.parents('[data-ele="video-cell"]');
    $curVideoCell.remove();
  },
  onClickPlayVideo: function(e) {
    var $curTar = $(e.currentTarget),
      $curVideoCell = $curTar.parents('[data-ele="video-cell"]'),
      src = $curVideoCell.attr('data-src');
    var $videoPlayerMask = $('#video-player-mask');
    func.renderVideoPlayer(src);
    $videoPlayerMask.show();
  },
  onClickVideoPlayerMask: function(e) {
    let $tar = $(e.target);
    let $videoPlayerMask = $('#video-player-mask');
    if ($tar.get(0) !== $videoPlayerMask.get(0)) return;
    Data.videoPlayer.pause();
    $videoPlayerMask.hide();
  },
  onClickLinkRadio: e => {
    if ($(e.currentTarget).attr('data-link-radio') == 1) {
      $('#set-link-box').css('display', 'block');
    } else {
      $('#set-link-box').css('display', 'none');
    }
  },
  inputLink: e => {
    if (e.target.value.length < 25) {
      e.target.value = 'https://wx.lenconet.com/';
    }
  },
  onClickSaveSchedule: function(e) {
    if (Data.isSubmit) {
      return;
    }
    var $modalBody = $('#create-schedule-modal-body'),
      params = {};
    params.buddhistId = Data.curBuddhistId;
    var $scheduleContent = $('#schedule-content');
    params.content = $scheduleContent.val();
    params.scheduleId = 0;
    var $scheduleImg = $modalBody.find('[data-ele="schedule-img"]');
    params.img = [];
    $scheduleImg.each(function(index, ele) {
      var $ele = $(ele),
        src = $ele.attr('src');
      params.img.push(src);
    });
    var $videoCells = $modalBody.find('[data-ele="video-cell"]');
    params.video = [];
    $videoCells.each(function(index, ele) {
      var $ele = $(ele),
        src = $ele.attr('data-src');
      params.video.push(src);
    });
    var isSetLink = parseInt(
      $('input:radio[name="if-set-link"]:checked').val(),
      10
    );
    if (!isSetLink) {
      params.url = '';
    } else {
      params.url = $('#edit-link-input').val();
    }

    params.isShow = parseInt($('[name="if-push"]:checked').val(), 10);
    if (!params.content) {
      Toast('内容不能为空', 2);
      return;
    }
    Data.isSubmit = 1;
    // handling.show();
    api.updateBuddhistSchedule(params, function(res) {
      Toast('发布成功', 1);
      var $scheduleListNav = $('[data-ele="modal-head-nav"][data-index="1"]');
      $scheduleListNav.click();
      handling.hide();
      Data.isSubmit = 0;
    });
  },
  onClickEditScheduleItem: function(e) {
    var $curTar = $(e.currentTarget),
      $curScheduleItem = $curTar.parents('[data-ele="schedule-item"]'),
      $curScheduleContent = $curScheduleItem.find(
        '[data-ele="schedule-content"]'
      ),
      scheduleContent = $.trim($curScheduleContent.text()),
      htmlStr = tpl.scheduleContentTextarea.render({
        scheduleContent: scheduleContent,
      });
    $curScheduleContent.replaceWith(htmlStr);
    var $textarea = $curScheduleItem.find('[data-ele="s-textarea"]');
    $textarea.trigger('keyup');
    $curScheduleItem.addClass('edit');
  },
  onClickSaveScheduleItem: function(e) {
    var $curTar = $(e.currentTarget),
      $curScheduleItem = $curTar.parents('[data-ele="schedule-item"]'),
      $scheduleContent = $curScheduleItem.find('[data-schedule-content]'),
      scheduleContent = $scheduleContent.val(),
      scheduleId = parseInt($curScheduleItem.attr('data-id'), 10),
      params = {};
    params.buddhistId = Data.curBuddhistId;
    params.scheduleId = scheduleId;
    params.content = scheduleContent;
    params.img = [];
    if ($('#schedule-url').get(0)) {
      params.url = $('#schedule-url').text();
    } else {
      params.url = '';
    }
    var $scheduleImg = $curScheduleItem.find('[data-ele="schedule-img"]');
    $scheduleImg.each(function(index, ele) {
      var $ele = $(ele),
        src = $ele.attr('src');
      params.img.push(src);
    });
    params.video = [];
    var $videoCells = $curScheduleItem.find('[data-ele="video-cell"]');
    $videoCells.each(function(index, ele) {
      var $ele = $(ele),
        src = $ele.attr('data-src');
      params.video.push(src);
    });
    var $ifPush = $curScheduleItem.find(
      '[name="if-push-' + scheduleId + '"]:checked'
    );
    if ($ifPush.length) {
      var ifPush = parseInt($ifPush.val(), 10);
      params.isShow = ifPush;
    } else {
    }
    if (!scheduleContent) {
      Toast('内容不能为空', 2);
      return;
    }
    api.updateBuddhistSchedule(params, function(res) {
      var data = Data.buddhistScheduleListHandleData[scheduleId];
      data.img = params.img;
      data.video = params.video;
      data.content = params.content;
      if (typeof params.isShow !== 'undefined') {
        data.isShow = params.isShow;
      } else {
      }
      var htmlStr = tpl.scheduleItem.render(data);
      $curScheduleItem.replaceWith(htmlStr);
      Toast('修改成功', 1);
      seeAjax('getPushTimes', {}, function(res) {
        let todayNum = 0;
        if (res.success) todayNum = res.todayNum;
        $('[data-ele="push-times"]').html(todayNum);
        if (!todayNum) {
          $('[name^="if-push"][value="0"]').prop('checked', true);
          $('[name^="if-push"][value="1"]').prop('disabled', true);
        }
      });
    });
  },
  onClickCancelScheduleItem: function(e) {
    var $curTar = $(e.currentTarget),
      $curScheduleItem = $curTar.parents('[data-ele="schedule-item"]'),
      scheduleId = parseInt($curScheduleItem.attr('data-id'), 10),
      data = Data.buddhistScheduleListHandleData[scheduleId],
      htmlStr = tpl.scheduleItem.render(data);
    $curScheduleItem.replaceWith(htmlStr);
  },
});
