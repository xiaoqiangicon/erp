import $ from 'jquery';
import seeAjax from 'see-ajax';
import commonFunc from 'common/function';
import Data from './data';
import tpl from './tpl';
import Pagination from '../../../../old-com/pagination/src';
import commonVars from 'common/variables';
import api from './api';
import zzhUpload from '../../../../old-com/upload/src';
import toastr from 'toastr';
import './upload_config.js';
import './ajax';
import 'bootstrap-select';

toastr.options.closeHtml = '<button><i class="toastr-icon-off"></i></button>';

var func = {};
func.init = function() {
  $('#loading-toast').hide();
  $('[data-ele="select-picker"]').selectpicker('refresh');
  func.initBuddhistVerifyModal();
  func.getBuddhistType({}, function(res) {
    func.renderBuddhistTypeSelect(res);
  });
  func.renderBuddhistStatus();
  func.refreshList();
  func.initVideoUpload($('[data-ele="add-video"]'));
};
func.initBuddhistVerifyModal = function() {
  const buddhistVerify = window.sessionStorage.getItem('buddhistVerify');
  if (parseInt(buddhistVerify)) {
    toastr.success(
      '工作人员已收到通知，请耐心等待处理 <br> 周一至周五：10:00-19:30 <br> 周末节假日：12:00 （审核一次）',
      '提交成功，审核中',
      {
        // timeOut: 20000,
        timeOut: 0,
        extendedTimeOut: 0,

        closeButton: !0,
        positionClass: 'toast-center-center',
        // escapeHtml: !1,
      }
    );
    window.sessionStorage.setItem('buddhistVerify', !1);
  }
};
func.renderVideoPlayer = function(src) {
  const srcData = {
    src,
    type: 'video/mp4',
  };
  if (!Data.videoPlayer) {
    const $videoPlayer = $('#video-player');
    const videoPlayer = window.videojs(
      $videoPlayer.get(0),
      {
        controls: !0,
        preload: 'auto',
        autoplay: !1,
        fluid: !1,
        language: 'zh-cN',
        muted: !1,
        sources: [srcData],
      },
      () => {
        console.log('videoJs初始化成功');
      }
    );
    Data.videoPlayer = videoPlayer;
  } else {
    console.log('重置videoJs');
    Data.videoPlayer.pause();
    Data.videoPlayer.src(srcData);
    Data.videoPlayer.load(srcData);
  }
};
func.initVideoUpload = function($btn) {
  zzhUpload(
    $btn,
    function(url) {
      console.log('上传成功');
      $('[data-ele="video-upload-loading"]').remove();
      $btn
        .parent()
        .prev()
        .append(
          tpl.scheduleVideoCell.render({
            src: url,
          })
        );
      $btn.show();
    },
    function(e, data) {
      const $progress = $('[data-ele="progress"]');
      const $progressText = $('[data-ele="progress-text"]');
      let progress = parseInt((data.loaded / data.total) * 100, 10);
      if (progress > 95) {
        progress = 95;
      }
      $progress.css({
        width: `${progress}%`,
      });
      $progressText.text(`${progress}%`);
      console.log(progress);
    },
    {
      type: 'file',
      componentOption: {
        add: function(e, data) {
          const { size, type } = data.originalFiles[0];
          const limitSize = 50 * 1024 * 1024;
          let uploadError = [];
          const acceptFileTypes = /^video\/(mp4|wmv|mov)$/i;
          console.log(size, type);
          if (!acceptFileTypes.test(type)) {
            uploadError.push('请上传mp4、wmv或mov格式的文件');
          }
          if (size > limitSize) {
            uploadError.push('请上传不超过50M的文件');
          }
          if (uploadError.length) {
            commonFunc.alert(uploadError.join('\n'));
          } else {
            Data.curUploadJqXHR = data.submit();
            $btn
              .parent()
              .prev()
              .append(tpl.scheduleVideoUploadLoading.render({}));
            $btn.hide();
          }
        },
      },
    }
  );
};
func.getBuddhistType = function(params, callback) {
  seeAjax('getBuddhistType', params, function(res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.renderBuddhistTypeSelect = function(res) {
  var $select = $('#buddhist-type-select'),
    htmlStr = '<option value="-1">全部</option>';
  res.data.map(function(item) {
    htmlStr += tpl.buddhistTypeOption.render(item);
  });
  $select.html(htmlStr);
  $select.selectpicker('refresh');
};
func.renderBuddhistStatus = function() {
  var $select = $('#buddhist-status-select'),
    htmlStr = '<option value="0">全部</option>';
  htmlStr += tpl.buddhistStatusOption.render({});
  $select.html(htmlStr);
  $select.selectpicker('refresh');
};
func.getList = function(params, callback) {
  seeAjax('getList', params, function(res) {
    if (res.success) {
      Data.getListRes = res;
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.handleGetListPrinterData = function(item) {
  var prtText = '',
    ifHasAddPrt = false,
    ifHasSub = false,
    ifHasSubNameList = false,
    ifHasNotBoundSubNameList = false,
    prtLen = item.printerList.length,
    result = {};
  item.printerList.sort(function(a, b) {
    return a.printerId - b.printerId;
  });
  if (prtLen > 0) {
    item.printerList.map(function(value) {
      if (
        value.subNameList.length === 0 &&
        value.notBoundSubNameList.length === 0
      ) {
        prtText += '<dl>';
        prtText += '<dt style="font-weight: bold">' + value.address + '</dt>';
        prtText += '</dl>';
      } else if (value.subNameList.length !== 0) {
        ifHasSubNameList = true;
        prtText += '<dl>';
        prtText += '<dt style="font-weight: bold">' + value.address + '</dt>';
        value.subNameList.map(function(valueA) {
          prtText +=
            '<dd class="clearfix"><i class="icon-container green-select-icon"></i>' +
            valueA +
            '</dd>';
        });
        value.notBoundSubNameList.map(function(valueB) {
          ifHasNotBoundSubNameList = true;
          prtText +=
            '<dd class="clearfix"><i class="icon-container yellow-selected-icon"></i>' +
            valueB +
            '</dd>';
        });
        prtText += '</dl>';
      } else {
        ifHasNotBoundSubNameList = true;
      }
    });
    if (!ifHasSubNameList && !ifHasNotBoundSubNameList) {
      ifHasAddPrt = true;
    } else if (ifHasSubNameList) {
      ifHasAddPrt = true;
    } else if (!ifHasSubNameList && ifHasNotBoundSubNameList) {
      ifHasAddPrt = false;
    }
    ifHasSub = ifHasSubNameList || ifHasNotBoundSubNameList;
  } else {
    ifHasAddPrt = false;
  }
  result.ifHasAddPrt = ifHasAddPrt;
  result.ifHasSub = ifHasSub;
  result.prtText = prtText;
  return result;
};
func.handleGetListStatusData = function(item) {
  var remainTimeText = '',
    endTimeArr = [],
    remainTimeArr = [],
    result = {};
  if (!item.isEnd) {
    item.endTime
      .toString()
      .split('-')
      .map(function(value, index, arr) {
        endTimeArr.push(parseInt(value));
      });
    if (endTimeArr[0] === 2099) {
      remainTimeText = '长期佛事活动。';
    } else {
      remainTimeArr = [
        endTimeArr[0] - commonVars.today.year,
        endTimeArr[1] - commonVars.today.month,
        endTimeArr[2] - commonVars.today.day,
      ];
      if (remainTimeArr[0] > 0) {
        remainTimeText =
          '距离结束还剩' +
          remainTimeArr[0] +
          '年' +
          remainTimeArr[1] +
          '月' +
          remainTimeArr[2] +
          '天';
      } else if (remainTimeArr[1] > 0) {
        remainTimeText =
          '距离结束还剩' + remainTimeArr[1] + '月' + remainTimeArr[2] + '天';
      } else {
        remainTimeText = '距离结束还剩' + remainTimeArr[2] + '天';
      }
    }
  }
  result.remainTimeText = remainTimeText;
  return result;
};
func.renderList = function(res) {
  var $ctnr = $('#table-body'),
    htmlString = '',
    ifHasPrt = res.ifHasPrinter;
  res.data.map(function(item) {
    var printerDataResult = func.handleGetListPrinterData(item),
      statusDataResult = func.handleGetListStatusData(item);
    item.ifHasPrt = ifHasPrt;
    item.ifHasAddPrt = printerDataResult.ifHasAddPrt;
    item.ifHasSub = printerDataResult.ifHasSub;
    item.prtText = printerDataResult.prtText;
    item.remainTimeText = statusDataResult.remainTimeText;
    Data.handleListData[item.id] = item;
    htmlString += tpl.tableCell.render(item);
  });
  !htmlString && (htmlString = tpl.cellCtnrEmpty.render({}));
  $ctnr.html(htmlString);
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-ele="more-opt"]').selectpicker('refresh');
  if (res.total > Data.getListParams.pageSize) {
    func.createPagination(
      res.total,
      Data.getListParams.pageSize,
      Data.getListParams.page,
      function(page) {
        Data.getListParams.page = page;
        func.refreshList();
      }
    );
  } else {
    $('#pagination-container').html('');
  }
};
func.refreshList = function() {
  var $ctnr = $('#table-body'),
    $pagination = $('#pagination-container');
  $pagination.html('');
  func.getList(Data.getListParams, function(res) {
    func.renderList(res);
  });
};
func.sortAndRenderList = function($ele, params) {
  var $icon = $ele.find('i');
  Data.getListParams.page = 0;
  if ($icon.hasClass('unsort')) {
    Data.getListParams[params] = 1;
    func.getList(Data.getListParams, function(res) {
      func.renderList(res);
      $icon.removeClass('unsort');
      $icon.addClass('desc');
    });
  } else if ($icon.hasClass('desc')) {
    Data.getListParams[params] = 0;
    func.getList(Data.getListParams, function(res) {
      func.renderList(res);
      $icon.removeClass('desc');
      $icon.addClass('asc');
    });
  } else {
    Data.getListParams[params] = '';
    func.getList(Data.getListParams, function(res) {
      func.renderList(res);
      $icon.removeClass('asc');
      $icon.addClass('unsort');
    });
  }
};
func.createPagination = function(totalCount, pageSize, currentPage, callback) {
  var totalPages = Math.ceil(totalCount / pageSize),
    pagination = new Pagination($('#pagination-container'), {
      onChange: function(pageToChange) {
        callback(pageToChange - 1);
      },
      showDesc: !0,
      showGoTo: !0,
      currentPage: currentPage + 1,
      totalPages: totalPages,
      totalCount: totalCount,
      perPage: pageSize,
    });
  pagination.render();
};
func.deleteItem = function(params, callback) {
  seeAjax('deleteItem', params, function(res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.endItem = function(params, callback) {
  seeAjax('endItem', params, function(res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.initSetPrtModal = function(ifHasSub, prtListData, subListData) {
  var $noSubPrtSwitchFormGroup = $('#no-sub-prt-switch-form-group'),
    $subPrtFormGroup = $('#sub-prt-form-group'),
    $noSubPrtFormGroup = $('#no-sub-prt-form-group'),
    $subTip = $('#sub-tip'),
    $subListFormGroup = $('#sub-list-form-group'),
    $exceptionTip = $('#exception-tip'),
    $prtNumSelect = $('#prt-num-select'),
    $prtTel = $('#prt-tel'),
    $prtAllQrcode = $('#prt-all-qrcode');
  $exceptionTip.text('').hide();
  $prtNumSelect.val(1).selectpicker('refresh');
  $prtTel.prop('checked', 'checked');
  $prtAllQrcode.prop('checked', 'checked');
  if (ifHasSub) {
    $noSubPrtSwitchFormGroup.hide();
    $subPrtFormGroup.show();
    $noSubPrtFormGroup.hide();
    $subTip.show();
    $subListFormGroup.show();
    var $subPrtSelect = $('#sub-prt-select'),
      $subListCtnr = $('#sub-list-ctnr');
    $subPrtSelect.html(tpl.subPrtOption.render(prtListData));
    $subPrtSelect.selectpicker('refresh');
    $subListCtnr.html(tpl.subList.render(subListData));
    $subListCtnr.find('input').attr('disabled', 'disabled');
  } else {
    $noSubPrtSwitchFormGroup.show();
    $subPrtFormGroup.hide();
    $noSubPrtFormGroup.show();
    $subTip.hide();
    $subListFormGroup.hide();
    var $noSubPrtCtnr = $('#no-sub-prt-ctnr');
    $noSubPrtCtnr.html(tpl.noSubPrtList.render(prtListData));
    $noSubPrtCtnr
      .find('[data-ele="no-sub-prt-checkbox"]')
      .attr('disabled', 'disabled');
  }
};
func.createLocalPrtCfg = function(ifHasSub, prtListData, BuddhistPrtData) {
  var cfg = {};
  if (ifHasSub) {
    prtListData.map(function(prt) {
      cfg[prt.id] = {
        printerId: prt.id,
        subList: [],
        continuousPrintNum: 1,
        qrcodePrint: 1,
        isPrintMobile: 1,
      };
    });
    BuddhistPrtData.subdividePrinter.map(function(subPrt) {
      subPrt.printer.map(function(curPrt) {
        cfg[curPrt.printerId].printerId = curPrt.printerId;
        cfg[curPrt.printerId].continuousPrintNum = curPrt.continuousPrintNum;
        cfg[curPrt.printerId].qrcodePrint = curPrt.qrcodePrint;
        cfg[curPrt.printerId].isPrintMobile = curPrt.isPrintMobile;
        if (typeof cfg[curPrt.printerId].subList === 'undefined') {
          cfg[curPrt.printerId].subList = [];
        }
        cfg[curPrt.printerId].subList.push(subPrt.subdivideId);
      });
    });
  } else {
    cfg.isOpenPrinter = BuddhistPrtData.isOpenPrinter;
    if (BuddhistPrtData.isOpenPrinter) {
      cfg.printerId = JSON.parse(BuddhistPrtData.printerId);
      cfg.continuousPrintNum = BuddhistPrtData.continuousPrintNum;
      cfg.qrcodePrint = BuddhistPrtData.qrcodePrint;
      cfg.isPrintMobile = BuddhistPrtData.isPrintMobile;
    } else {
      cfg.printerId = [];
      cfg.continuousPrintNum = 1;
      cfg.qrcodePrint = 1;
      cfg.isPrintMobile = 1;
    }
  }
  return cfg;
};
func.renderSetPrtModal = function(ifHasSub, cfg, prtId) {
  var continuousPrintNum, qrcodePrint, isPrintMobile;
  var curPrtId;
  if (ifHasSub) {
    if (typeof prtId !== 'undefined') {
      curPrtId = prtId;
    } else {
      Object.keys(cfg).map(function(prtId) {
        if (cfg[prtId].subList.length && typeof curPrtId === 'undefined') {
          curPrtId = prtId;
        }
      });
    }
    if (typeof curPrtId !== 'undefined') {
      var $subPrtSelect = $('#sub-prt-select'),
        $subCheckbox = $('[data-ele="sub-checkbox"]'),
        $exceptionTip = $('#exception-tip');
      continuousPrintNum = cfg[curPrtId].continuousPrintNum;
      qrcodePrint = cfg[curPrtId].qrcodePrint;
      isPrintMobile = cfg[curPrtId].isPrintMobile;
      $subPrtSelect.val(curPrtId).selectpicker('refresh');
      seeAjax(
        'printerStatus',
        {
          printerId: curPrtId,
        },
        function(res) {
          if (res.success) {
            $exceptionTip.text(res.msg).show();
            if (res.msg !== '在线，工作状态正常。') {
              $subCheckbox.attr('disabled', 'disabled');
            } else {
              $subCheckbox.removeAttr('disabled');
            }
          } else {
            res.message && commonFunc.alert(res.message);
          }
        }
      );
      cfg[curPrtId].subList.map(function(subId) {
        $('[data-ele="sub-checkbox"][data-id="' + subId + '"]').prop(
          'checked',
          'checked'
        );
      });
    } else {
      return;
    }
  } else {
    continuousPrintNum = cfg.continuousPrintNum;
    qrcodePrint = cfg.qrcodePrint;
    isPrintMobile = cfg.isPrintMobile;
    if (cfg.isOpenPrinter === 0) {
      $('#close-prt').prop('checked', 'checked');
      $('[data-ele="no-sub-prt-checkbox"]').attr('disabled', 'disabled');
    } else {
      $('#open-prt').prop('checked', 'checked');
      $('[data-ele="no-sub-prt-checkbox"]').removeAttr('disabled');
    }
    cfg.printerId.map(function(value) {
      $('[data-ele="no-sub-prt-checkbox"][data-id="' + value + '"]').prop(
        'checked',
        'checked'
      );
    });
  }
  $('#prt-num-select')
    .val(continuousPrintNum)
    .selectpicker('refresh');
  $('[name="prt-qrcode"][value=' + qrcodePrint + ']').prop(
    'checked',
    'checked'
  );
  $('[name="prt-tel"][value="' + isPrintMobile + '"]').prop(
    'checked',
    'checked'
  );
};
func.getAndRenderPrtCfg = function(buddhistId) {
  seeAjax(
    'CommodityPrinter',
    {
      commodityId: buddhistId,
    },
    function(res) {
      if (res.success) {
        Data.localPrtCfg = func.createLocalPrtCfg(
          Data.ifHasSub,
          Data.getPrinterListRes.data,
          res.data
        );
        func.renderSetPrtModal(Data.ifHasSub, Data.localPrtCfg);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    }
  );
};
func.createUpdatePrtParams = function(
  ifHasSub,
  buddhistId,
  localPrtCfg,
  subListData
) {
  var params = {};
  params.commodityId = buddhistId;
  if (ifHasSub) {
    params.isOpenPrinter = '';
    params.printerId = '';
    params.continuousPrintNum = '';
    params.qrcodePrint = '';
    params.isPrintMobile = '';
    params.subdividePrinter = [];
    subListData.map(function(sub) {
      params.subdividePrinter.push({
        subdivideId: sub.id,
        printer: [],
      });
    });
    Object.keys(localPrtCfg).map(function(prtId) {
      localPrtCfg[prtId].subList.map(function(subId) {
        params.subdividePrinter.map(function(subPrt) {
          if (subPrt.subdivideId === subId) {
            subPrt.printer.push({
              printerId: parseInt(prtId),
              continuousPrintNum: localPrtCfg[prtId].continuousPrintNum,
              qrcodePrint: localPrtCfg[prtId].qrcodePrint,
              isPrintMobile: localPrtCfg[prtId].isPrintMobile,
            });
          }
        });
      });
    });
  } else {
    params.isOpenPrinter = localPrtCfg.isOpenPrinter;
    params.printerId = '[' + localPrtCfg.printerId.toString() + ']';
    params.continuousPrintNum = localPrtCfg.continuousPrintNum;
    params.qrcodePrint = localPrtCfg.qrcodePrint;
    params.isPrintMobile = localPrtCfg.isPrintMobile;
    params.subdividePrinter = [];
  }
  return params;
};
func.renderTr = function(id) {
  var $curTr = $('tr[data-id="' + id + '"]'),
    htmlStr = '';
  htmlStr = tpl.tableCell.render(Data.handleListData[id]);
  $curTr.replaceWith(htmlStr);
  $curTr = $('tr[data-id="' + id + '"]');
  $curTr.find('[data-toggle="tooltip"]').tooltip();
  $curTr.find('[data-ele="more-opt"]').selectpicker('refresh');
};
func.initScheduleModal = function(index) {
  var $modalHeadNav = $('[data-ele="modal-head-nav"]'),
    $scheduleModalBody = $('[data-ele="schedule-modal-body"]');
  $modalHeadNav.removeClass('active');
  $('[data-ele="modal-head-nav"][data-index="' + index + '"]').addClass(
    'active'
  );
  $scheduleModalBody.hide();
  $('[data-ele="schedule-modal-body"][data-index="' + index + '"]').show();
  if (index === 0) {
    func.initCreateScheduleModalBody();
  } else if (index === 1) {
    func.initScheduleListModalBody();
  }
};
func.initCreateScheduleModalBody = function() {
  var $modalBody = $('#create-schedule-modal-body');
  var $scheduleContent = $('#schedule-content');
  $scheduleContent.val('');
  $scheduleContent.trigger('keyup');
  var $scheduleImgCell = $modalBody
    .find('[data-ele="schedule-img"]')
    .parents('[data-ele="img-cell"]');
  $scheduleImgCell.remove();
  var $scheduleVideoCell = $modalBody
    .find('[data-ele="schedule-video"]')
    .parents('[data-ele="video-cell"]');
  $scheduleVideoCell.remove();
  seeAjax('getPushTimes', {}, res => {
    let todayNum = 0;
    if (res.success) {
      todayNum = res.todayNum;
      $('[name="if-push]').prop('disabled', false);
      $('[name="if-push"][value="1"]').click();
    } else {
      $('[name="if-push"][value="1"]').prop('disabled', true);
      $('[name="if-push"][value="0"]').prop('disabled', false);
      $('[name="if-push"][value="0"]').click();
    }
    $('#push-times').html(todayNum);
  });
};
func.initScheduleListModalBody = function() {
  var $modalBody = $('#schedule-list-modal-body'),
    htmlStr = '',
    params = {
      buddhistId: Data.curBuddhistId,
    };
  seeAjax('getPushTimes', {}, res => {
    let todayNum = 0;
    if (res.success) todayNum = res.todayNum;
    api.getBuddhistSchedule(params, function(res) {
      if (!res.data.length) {
        htmlStr = tpl.scheduleListEmpty.render({});
      } else {
        res.data.map(function(item) {
          item.todayNum = todayNum;
          htmlStr += tpl.scheduleItem.render(item);
        });
      }
      $modalBody.html(htmlStr);
      const $addVideos = $modalBody.find('[data-ele="add-video"]');
      $addVideos.each(function(index, ele) {
        func.initVideoUpload($(ele));
      });
    });
  });
};
export default func;
