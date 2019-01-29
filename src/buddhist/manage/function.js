/**
 * Created by kang on 2017/9/18.
 */

//新的佛事管理页 等待测试

define([
  'jquery',
  'common/function',
  './data',
  './tpl',
  '@zzh/pagination',
  'common/variables',
  './api',
  './ajax',
  'bootstrap-select',
], function($, commonFunc, Data, tpl, Pagination, commonVars, api) {
  var func = {};

  func.init = function() {
    $('#loading-toast').hide();
    $('[data-ele="select-picker"]').selectpicker('refresh');
    func.getBuddhistType({}, function(res) {
      func.renderBuddhistTypeSelect(res);
    });
    func.renderBuddhistStatus();
    func.refreshList();
  };
  // 通用逻辑 数据请求 -> 回调执行 数据处理 渲染 ...

  // 请求所有佛事分类
  func.getBuddhistType = function(params, callback) {
    $.seeAjax.get('getBuddhistType', params, function(res) {
      if (res.success) {
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 渲染佛事分类选项
  func.renderBuddhistTypeSelect = function(res) {
    var $select = $('#buddhist-type-select'),
      htmlStr = '<option value="-1">全部</option>';
    res.data.map(function(item) {
      htmlStr += tpl.buddhistTypeOption.render(item);
    });
    $select.html(htmlStr);
    $select.selectpicker('refresh');
  };
  // 渲染佛事状态选项
  func.renderBuddhistStatus = function() {
    var $select = $('#buddhist-status-select'),
      htmlStr = '<option value="0">全部</option>';
    htmlStr += tpl.buddhistStatusOption.render({});
    $select.html(htmlStr);
    $select.selectpicker('refresh');
  };
  // 请求列表,渲染列表需抽离出去，因为单独修改列表行时，需要获取最新的列表数据然后修改当前行
  func.getList = function(params, callback) {
    // callback将在分页器渲染时调用
    $.seeAjax.get('getList', params, function(res) {
      if (res.success) {
        Data.getListRes = res;
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 处理请求列表的打印机列tooltip需要的数据
  func.handleGetListPrinterData = function(item) {
    var prtText = '',
      ifHasAddPrt = false, // 是否添加了打印机
      ifHasSub = false, // 是否具有规格
      ifHasSubNameList = false, // 规格列表是否存在值，fasle表示空
      ifHasNotBoundSubNameList = false, // 无规格列表是否存在值，fasle表示空
      prtLen = item.printerList.length,
      result = {};
    item.printerList.sort(function(a, b) {
      // 排序保证内外层小票打印机显示顺序一致
      return a.printerId - b.printerId;
    });
    if (prtLen > 0) {
      item.printerList.map(function(value) {
        if (
          value.subNameList.length === 0 &&
          value.notBoundSubNameList.length === 0
        ) {
          // 无规格
          prtText += '<dl>';
          prtText += '<dt style="font-weight: bold">' + value.address + '</dt>';
          prtText += '</dl>';
        } else if (value.subNameList.length !== 0) {
          // 有规格且有选中规格
          ifHasSubNameList = true; // 存在配置了打印机的规格项
          prtText += '<dl>';
          prtText += '<dt style="font-weight: bold">' + value.address + '</dt>';
          value.subNameList.map(function(valueA) {
            prtText +=
              '<dd class="clearfix"><i class="icon-container green-select-icon"></i>' +
              valueA +
              '</dd>';
          });
          value.notBoundSubNameList.map(function(valueB) {
            ifHasNotBoundSubNameList = true; // 存在未配置规格
            prtText +=
              '<dd class="clearfix"><i class="icon-container yellow-selected-icon"></i>' +
              valueB +
              '</dd>';
          });
          prtText += '</dl>';
        } else {
          // 有规格无选中规格
          ifHasNotBoundSubNameList = true; // 存在未配置规格
        }
      });
      if (!ifHasSubNameList && !ifHasNotBoundSubNameList) {
        // 无规格情况
        ifHasAddPrt = true;
      } else if (ifHasSubNameList) {
        // 有规格，存在绑定规格
        ifHasAddPrt = true;
      } else if (!ifHasSubNameList && ifHasNotBoundSubNameList) {
        // 有规格，不存在绑定规格
        ifHasAddPrt = false;
      }
      ifHasSub = ifHasSubNameList || ifHasNotBoundSubNameList;
    } else {
      // 列表数据为空则未添加打印机
      ifHasAddPrt = false;
    }
    result.ifHasAddPrt = ifHasAddPrt;
    result.ifHasSub = ifHasSub;
    result.prtText = prtText;
    return result;
  };
  // 处理请求列表的状态列需要的数据
  func.handleGetListStatusData = function(item) {
    var remainTimeText = '',
      endTimeArr = [], // 转化服务器传来的截止日期为年月日三位存入数组
      remainTimeArr = [], // endTimeArr与此刻时间相减得到的剩余时间的年月日数组
      result = {};
    if (!item.isEnd) {
      item.endTime
        .toString()
        .split('-')
        .map(function(value, index, arr) {
          endTimeArr.push(parseInt(value)); // 保存了年月日的字符串
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
          // 大于等于1年
          remainTimeText =
            '距离结束还剩' +
            remainTimeArr[0] +
            '年' +
            remainTimeArr[1] +
            '月' +
            remainTimeArr[2] +
            '天';
        } else if (remainTimeArr[1] > 0) {
          // 大于等于1个月
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
  // 渲染列表
  func.renderList = function(res) {
    var $ctnr = $('#table-body'),
      htmlString = '',
      ifHasPrt = res.ifHasPrinter; // 是否有打印机
    // 处理并渲染数据
    res.data.map(function(item) {
      // 将服务器数据处理为模板所需数据格式
      var printerDataResult = func.handleGetListPrinterData(item), // 处理打印机列tooltip需要的数据
        statusDataResult = func.handleGetListStatusData(item); // 处理状态列需要的数据
      // 添加模板需要的字段
      item.ifHasPrt = ifHasPrt;
      item.ifHasAddPrt = printerDataResult.ifHasAddPrt;
      item.ifHasSub = printerDataResult.ifHasSub;
      item.prtText = printerDataResult.prtText;
      item.remainTimeText = statusDataResult.remainTimeText;
      // 存储处理后的参数 按照id:item的键值对存储
      Data.handleListData[item.id] = item;
      htmlString += tpl.tableCell.render(item);
    });
    !htmlString && (htmlString = tpl.cellCtnrEmpty.render({}));
    $ctnr.html(htmlString);
    $('[data-toggle="tooltip"]').tooltip(); // 初始化tooltip
    $('[data-ele="more-opt"]').selectpicker('refresh'); // 初始化每行的更多选项
    //生成分页器
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
  // 刷新列表
  func.refreshList = function() {
    var $ctnr = $('#table-body'),
      $pagination = $('#pagination-container');
    // $ctnr.html(tpl.cellCtnrLoading.render({}));
    $pagination.html('');
    func.getList(Data.getListParams, function(res) {
      func.renderList(res);
    });
  };
  // 表头的排序功能
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
  // 调用分页器
  func.createPagination = function(
    totalCount,
    pageSize,
    currentPage,
    callback
  ) {
    // 总数传0时会生成空的分页器容器代替之前的分页器
    var totalPages = Math.ceil(totalCount / pageSize),
      pagination = new Pagination($('#pagination-container'), {
        onChange: function(pageToChange) {
          // 回调中调用currentPage获取的是点击前的页数
          callback(pageToChange - 1);
        }, // 切换页码回调函数，页面以 1 开始索引
        showDesc: !0, // 是否显示左边（共多少条，每页多少条的信息）
        showGoTo: !0, // 是否显示右边跳转到某一页
        currentPage: currentPage + 1, // 初始化当前页
        totalPages: totalPages, // 总页数
        totalCount: totalCount, // 总条数
        perPage: pageSize, // 每页条数
      });
    pagination.render();
  };
  // 删除项
  func.deleteItem = function(params, callback) {
    $.seeAjax.post('deleteItem', params, function(res) {
      if (res.success) {
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 结束项
  func.endItem = function(params, callback) {
    $.seeAjax.post(
      'endItem',
      params,
      function(res) {
        if (res.success) {
          callback && callback(res);
        } else {
          res.message && commonFunc.alert(res.message);
        }
      },
      true
    );
  };
  // 初始化打印机modal 需要打印机列表数据 信息选择项列表数据
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
    // 每次打开小票打印模态框的公用样式重置
    $exceptionTip.text('').hide(); // 初始隐藏打印机状态提示文本
    $prtNumSelect.val(1).selectpicker('refresh'); // 初始化打印联数
    $prtTel.prop('checked', 'checked'); // 初始化电话
    $prtAllQrcode.prop('checked', 'checked'); // 初始化二维码打印
    if (ifHasSub) {
      // 有选择项的样式修改
      // 样式初始化
      $noSubPrtSwitchFormGroup.hide();
      $subPrtFormGroup.show();
      $noSubPrtFormGroup.hide();
      $subTip.show();
      $subListFormGroup.show();
      // 配置打印机列表并初始化
      var $subPrtSelect = $('#sub-prt-select'),
        $subListCtnr = $('#sub-list-ctnr');
      $subPrtSelect.html(tpl.subPrtOption.render(prtListData));
      $subPrtSelect.selectpicker('refresh');
      // 配置并初始化选择项
      $subListCtnr.html(tpl.subList.render(subListData));
      $subListCtnr.find('input').attr('disabled', 'disabled');
    } else {
      // 无选择项的样式修改
      // 样式初始化
      $noSubPrtSwitchFormGroup.show();
      $subPrtFormGroup.hide();
      $noSubPrtFormGroup.show();
      $subTip.hide();
      $subListFormGroup.hide();
      // 配置打印机列表并初始化
      var $noSubPrtCtnr = $('#no-sub-prt-ctnr');
      $noSubPrtCtnr.html(tpl.noSubPrtList.render(prtListData));
      $noSubPrtCtnr
        .find('[data-ele="no-sub-prt-checkbox"]')
        .attr('disabled', 'disabled');
    }
  };
  // 生成本地所需格式的打印机数据
  func.createLocalPrtCfg = function(ifHasSub, prtListData, BuddhistPrtData) {
    var cfg = {};
    if (ifHasSub) {
      // 有选择项的打印机数据
      // 输出 打印机id对应配置的键值对 生成数据后对象会自动按照printerId有小到大排列
      // 转化后的理想打印机数据 {printerId: {printerId:x,subList:[],continuousPrintNum:x,qrcodePrint:x,isPrintMobile:x}}
      // 生成数据默认数据
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
          cfg[curPrt.printerId].subList.push(subPrt.subdivideId); // 不会重复
        });
      });
    } else {
      cfg.isOpenPrinter = BuddhistPrtData.isOpenPrinter;
      if (BuddhistPrtData.isOpenPrinter) {
        cfg.printerId = JSON.parse(BuddhistPrtData.printerId); // 设置了打印机的从服务器获取的数据格式为 '[2]'
        cfg.continuousPrintNum = BuddhistPrtData.continuousPrintNum;
        cfg.qrcodePrint = BuddhistPrtData.qrcodePrint;
        cfg.isPrintMobile = BuddhistPrtData.isPrintMobile;
      } else {
        cfg.printerId = []; // 未设置从服务器获取的数据为 '0'
        cfg.continuousPrintNum = 1;
        cfg.qrcodePrint = 1;
        cfg.isPrintMobile = 1;
      }
    }
    // console.log(cfg);
    return cfg;
  };
  // 渲染打印机配置
  func.renderSetPrtModal = function(ifHasSub, cfg, prtId) {
    // 有选择项时可传入prtId 会选中当前打印机的配置并渲染
    var continuousPrintNum, qrcodePrint, isPrintMobile;
    var curPrtId;
    if (ifHasSub) {
      if (typeof prtId !== 'undefined') {
        curPrtId = prtId;
      } else {
        // 判断是否存在设置了选择项的打印机 对象的索引默认按数字有小到大排列 因此获取即为最小的打印机
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
        // 选中当前打印机
        $subPrtSelect.val(curPrtId).selectpicker('refresh');
        // 获取当前打印机状态
        $.seeAjax.post(
          'printerStatus',
          { printerId: curPrtId },
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
          },
          true
        );
        // 选中当前选择项
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
      // 配置打印机开关状态,以及对应能否选中打印机
      if (cfg.isOpenPrinter === 0) {
        $('#close-prt').prop('checked', 'checked');
        $('[data-ele="no-sub-prt-checkbox"]').attr('disabled', 'disabled');
      } else {
        $('#open-prt').prop('checked', 'checked');
        $('[data-ele="no-sub-prt-checkbox"]').removeAttr('disabled');
      }
      // 配置选中的打印机,由于存储的是字符串，先要解析
      cfg.printerId.map(function(value) {
        $('[data-ele="no-sub-prt-checkbox"][data-id="' + value + '"]').prop(
          'checked',
          'checked'
        );
      });
    }
    // 渲染通用的三个设置项
    // 配置打印联数状态 1-5
    $('#prt-num-select')
      .val(continuousPrintNum)
      .selectpicker('refresh');
    // 配置二维码打印状态 1-3
    $('[name="prt-qrcode"][value=' + qrcodePrint + ']').prop(
      'checked',
      'checked'
    );
    // 配置电话号码选中状态
    $('[name="prt-tel"][value="' + isPrintMobile + '"]').prop(
      'checked',
      'checked'
    );
  };
  // 获取并渲染打印机配置
  func.getAndRenderPrtCfg = function(buddhistId) {
    $.seeAjax.post(
      'CommodityPrinter',
      { commodityId: buddhistId },
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
      },
      true
    );
  };
  // 处理本地打印机数据为上传数据
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
        // 这里的priId会变为string
        localPrtCfg[prtId].subList.map(function(subId) {
          params.subdividePrinter.map(function(subPrt) {
            if (subPrt.subdivideId === subId) {
              subPrt.printer.push({
                // 不会重复推
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
    // console.log(params);
    return params;
  };
  // 重绘一行，本地修改数据后调用模板重绘
  func.renderTr = function(id) {
    var $curTr = $('tr[data-id="' + id + '"]'),
      htmlStr = '';
    htmlStr = tpl.tableCell.render(Data.handleListData[id]);
    $curTr.replaceWith(htmlStr);
    $curTr = $('tr[data-id="' + id + '"]');
    $curTr.find('[data-toggle="tooltip"]').tooltip();
    $curTr.find('[data-ele="more-opt"]').selectpicker('refresh');
  };

  // 佛事进展相关
  func.initScheduleModal = function(index) {
    // 初始化schedule modal
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
    // 渲染新建进展modal body
    var $modalBody = $('#create-schedule-modal-body');
    // 内容
    var $scheduleContent = $('#schedule-content');
    $scheduleContent.val('');
    $scheduleContent.trigger('keyup');
    // 图片
    var $scheduleImgCell = $modalBody
      .find('[data-ele="schedule-img"]')
      .parents('[data-ele="img-cell"]');
    $scheduleImgCell.remove();
    // 推送
    $('[name="if-push"][value="1"]').click();
  };
  func.initScheduleListModalBody = function() {
    // 渲染进展列表modal body
    var $modalBody = $('#schedule-list-modal-body'),
      htmlStr = '',
      params = {
        buddhistId: Data.curBuddhistId,
        // page: 0,  暂时不做分页
        // pageSize: 20
      };
    api.getBuddhistSchedule(params, function(res) {
      if (!res.data.length) {
        htmlStr = tpl.scheduleListEmpty.render({});
      } else {
        res.data.map(function(item) {
          htmlStr += tpl.scheduleItem.render(item);
        });
      }
      $modalBody.html(htmlStr);
    });
  };

  return func;
});
