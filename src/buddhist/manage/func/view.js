/**
 * Created by kang on 2017/9/18.
 */

define([
  'jquery',
  'common/function',
  'common/variables',
  'old/toast',
  './data',
  './tpl',
  './function',
  'clipboard',
  '../../../../old-com/promotion/src',
  '../../../../old-com/choose-image/src',
  './api',
  '../../../../old-com/jquery-qrcode',
  'jquery-confirm',
  './ajax',
  'lib/jquery.seeView',
], function(
  $,
  commonFunc,
  commonVars,
  Toast,
  Data,
  tpl,
  func,
  Clipboard,
  Promotion,
  ChooseImage,
  api
) {
  $.seeView({
    events: {
      /*自定义事件*/
      // 自定义文本框输入
      'keyup [data-ele="s-textarea"]': 'onKeyupSTextarea',

      /*其它*/
      // 切换佛事分类
      'changed.bs.select #buddhist-type-select': 'onChangeBuddhistTypeSelect',
      // 切换佛事状态
      'changed.bs.select #buddhist-status-select':
        'onChangeBuddhistStatusSelect',
      // 点击搜索
      'click #search': 'onClickSearch',
      // 点击按照参与人数排序
      'click #table-title-total-join': 'sortByJoinNum',
      // 点击按照募集金额排序
      'click #table-title-total-collect': 'sortByMoney',
      // 点击表格的编辑操作
      'click [data-opt="edit"]': 'onClickOptEdit',
      // 点击表格的预览或推广操作
      'click [data-opt="promotion"]': 'onClickOptPromotion',
      // 点击表格的删除操作
      'click [data-opt="del"]': 'onClickOptDel',
      // 点击表格的复制操作
      'click [data-opt="copy"]': 'onClickOptCopy',
      // 点击表格的设为模板
      'click [data-opt="set-tmpl"]': 'onClickOptSetTmpl',
      // 点击表格的设为结束
      'click [data-opt="end"]': 'onClickOptEnd',
      // 点击表格的发布进展
      'click [data-opt="schedule"]': 'onClickOptSchedule',
      // 点击表格的更多,可能包括删除、复制、设为模板、设为结束
      'change [data-ele="more-opt"]': 'onClickMoreOpt',
      // 关闭更多下拉菜单时复位为更多
      'hidden.bs.select [data-ele="more-opt"]': 'hiddenMoreOpt',
      // 设为模板模态框的确认按钮
      'click #confirm-set-tmpl': 'onClickConfirmSetTmpl',
      // 设为模板模态框的取消按钮
      'click #cancle-set-tmpl': 'onClickCancelSetTmpl',

      // 小票打印机模态框打开
      'show.bs.modal #set-prt-modal': 'onShowSetPrtModal',
      // 有选择项时切换打印机
      'changed.bs.select #sub-prt-select': 'onChangeSubPrtSelect',
      // 有选择项时点击选择项
      'click [data-ele="sub-checkbox"]': 'onClickSubCheckbox',
      // 改变打印联数
      'changed.bs.select #prt-num-select': 'onChangePrtNumSelect',
      // 改变二维码打印
      'click [name="prt-qrcode"]': 'onClickPrtQrcode',
      // 有选择项时改变电话打印
      'click [name="prt-tel"]': 'onClickPrtTel',

      // 无选择项时切换是否开启打印机
      'click [name="no-sub-prt-switch"]': 'onClickNoSubPrtSwitch',
      // 无选择项时点击打印机
      'click [data-ele="no-sub-prt-checkbox"]': 'onClickNoSubPrtCheckbox',

      // 确认保存小票打印设置
      'click #save-prt-set': 'onClickSavePrtSet',

      /*佛事进展modal*/
      // 切换modal-head-nav
      'click [data-ele="modal-head-nav"]': 'onClickModalHeadNav',
      // 点击上传图片
      'click [data-ele="add-img"]': 'onClickAddImg',
      // 点击中断视频上传
      'click [data-ele="del-video-upload"]': 'onClickDelUploadVideo',
      // 点击删除图片
      'click [data-ele="del-img"]': 'onClickDelImg',
      // 点击删除视频
      'click [data-ele="del-video"]': 'onClickDelVideo',
      // 点击播放视频
      'click [data-ele="play-video"]': 'onClickPlayVideo',
      // 点击videoPlayerMask
      'click #video-player-mask': 'onClickVideoPlayerMask',

      // 点击保存并发布
      'click #save-schedule': 'onClickSaveSchedule',
      // 点击编辑佛事进展
      'click [data-ele="edit-schedule-item"]': 'onClickEditScheduleItem',
      // 点击保存当前佛事进展
      'click [data-ele="save-schedule-item"]': 'onClickSaveScheduleItem',
      // 点击取消编辑当前佛事进展
      'click [data-ele="cancel-schedule-item"]': 'onClickCancelScheduleItem',
    },
    /*自定义事件*/
    // 自定义文本框输入文本
    onKeyupSTextarea: function(e) {
      var $curTar = $(e.currentTarget),
        $numTip = $curTar.next(),
        textLen = $curTar.val().length,
        maxLen = $curTar.prop('maxlength');
      $numTip.html(textLen + '/' + maxLen);
    },
    /*其它*/
    // 切换佛事分类
    onChangeBuddhistTypeSelect: function(e) {
      // onChange事件本身会判断是否变化了选项
      $('#search').click();
    },
    // 切换佛事状态
    onChangeBuddhistStatusSelect: function(e) {
      $('#search').click();
    },
    // 点击搜索
    onClickSearch: function(e) {
      // 获取参数
      var buddhistTypeId = parseInt($('#buddhist-type-select').val()), // 获取佛事分类
        buddhistStatus = parseInt($('#buddhist-status-select').val()), // 获取佛事状态
        searchText = $('#search-input').val(); // 获取搜索文本
      // 配置参数
      Data.getListParams.page = 0;
      Data.getListParams.typeId = buddhistTypeId;
      Data.getListParams.filterType = buddhistStatus;
      Data.getListParams.searchText = searchText;
      func.refreshList();
    },
    // 点击按照参与人数排序
    sortByJoinNum: function(e) {
      func.sortAndRenderList($('#table-title-total-join'), 'orderByJoinNum');
    },
    // 点击按照募集金额排序
    sortByMoney: function(e) {
      func.sortAndRenderList(
        $('#table-title-total-collect'),
        'orderByCollectMoney'
      );
    },
    // 点击表格的编辑操作
    onClickOptEdit: function(e) {
      var $curTar = $(e.currentTarget),
        $curTr = $curTar.parents('tr'),
        id = parseInt($curTr.attr('data-id')),
        // 区分进行中和待审核
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
    // 点击表格的预览或推广操作
    onClickOptPromotion: function(e) {
      var $tar = $(e.target),
        $loadingToastTitle = $('#loading-toast-title'),
        $loadingToast = $('#loading-toast'),
        id = parseInt($tar.attr('data-id')),
        name = Data.handleListData[id].name,
        status = parseInt($tar.attr('data-status')),
        title = status === 0 ? '推广' : '预览 (此链接为临时链接，仅供预览)',
        url = $tar.attr('data-url');
      // 推广控件 展示loading 并向后台请求海报地址
      Promotion.show({
        title: title,
        typeText: '佛事',
        link: url,
        showPost: !0,
        postTitle: name,
        maxPostTitle: 30,
        loadPost: function(callback, title) {
          $loadingToastTitle.html('生成海报中，请耐心等待...');
          $loadingToast.show();
          // 处理title 以换行符为间隔切分 长度超过10个切分
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

          $.seeAjax.post(
            'getBuddhistPoster',
            { commodityId: id, title: titleStr },
            function(res) {
              if (res.success) {
                $loadingToastTitle.html('');
                $loadingToast.hide();
                var postImageUrl = res.pic; // 海报图片地址
                callback(postImageUrl, postImageUrl);
              } else {
                res.message && commonFunc.alert(res.message);
              }
            },
            true
          );
        },
      });
    },
    // 点击表格的删除操作
    onClickOptDel: function(e) {
      // 传入的事件对象是select .more-operation
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
              func.deleteItem({ id: id }, function(res) {
                $curTr.remove();
              });
            },
          },
          cancel: {
            text: '取消',
            action: function() {},
          },
        },
      });
    },
    // 点击表格的复制操作
    onClickOptCopy: function(e) {
      // 从更多下拉菜单传入的事件对象是select .more-operation
      var $curTar = $(e.currentTarget),
        $curTr = $curTar.parents('tr'),
        id = parseInt($curTr.attr('data-id'));
      $.confirm({
        title: false,
        content: '你确定复制该佛事吗?',
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
    // 点击设为模板,启用模态框
    onClickOptSetTmpl: function(e) {
      // 传入的事件对象是select .more-operation
      var $curTar = $(e.currentTarget),
        $curTr = $curTar.parents('tr'),
        $myModal = $('#set-tmpl-modal'),
        id = parseInt($curTr.attr('data-id'));
      $myModal.attr('data-id', id);
      $myModal.show();
      // 未完待续
    },
    // 设为结束
    onClickOptEnd: function(e) {
      var $curTar = $(e.currentTarget),
        $curTr = $curTar.parents('tr'),
        id = parseInt($curTr.attr('data-id'));
      $.confirm({
        title: false,
        content: '你确定要结束正在进行中的佛事吗',
        buttons: {
          ok: {
            text: '确定',
            action: function() {
              func.endItem({ commodityId: id }, function(res) {
                Data.handleListData[id].isEnd = 1;
                func.renderTr(id);
              });
            },
          },
          cancel: {
            text: '取消',
            action: function() {},
          },
        },
      });
    },
    // 点击表格的发布进展
    onClickOptSchedule: function(e) {
      var $curTar = $(e.currentTarget),
        $curTr = $curTar.parents('tr'),
        id = parseInt($curTr.attr('data-id'), 10),
        $scheduleModal = $('#schedule-modal');
      Data.curBuddhistId = id;
      func.initScheduleModal(0);
      $scheduleModal.modal('show');
    },
    // 点击更多,可能包括删除、复制、设为模板、推广、设为结束
    onClickMoreOpt: function(e) {
      var self = this,
        $tar = $(e.target),
        getValue = parseInt($tar.val()); // 此处的事件对象是select .more-operation 获取被选中的操作项的value
      switch (getValue) {
        case 0: // 删除
          self.onClickOptDel(e);
          break;
        case 1: // 复制
          self.onClickOptCopy(e);
          break;
        case 2: // 设为模板
          self.onClickOptSetTmpl(e);
          break;
        case 3: // 推广
          self.onClickOptPromotion(e);
          break;
        case 4: // 设为结束
          self.onClickOptEnd(e);
          break;
        case 5: // 佛事进展
          self.onClickOptSchedule(e);
        default:
          break;
      }
    },
    // 关闭更多下拉菜单时复位为更多
    hiddenMoreOpt: function(e) {
      var $tar = $(e.target);
      $tar.val(-1).selectpicker('refresh');
    },
    // 设为模板模态框的确认按钮
    onClickConfirmSetTmpl: function(e) {
      var $myModal = $('#set-tmpl-modal'),
        id = parseInt($myModal.attr('data-id')),
        name = $('#tmpl-name').val(),
        params = {};
      params.commodityId = id;
      params.name = name;
      $.seeAjax.post(
        'addTemplate',
        params,
        function(res) {
          if (res.success) {
            window.location.href = '/zzhadmin/selectCeremonyTemplate/';
          } else {
            res.message && commonFunc.alert(res.message);
          }
        },
        true
      );
    },
    // 设为模板模态框的取消按钮
    onClickCancelSetTmpl: function(e) {
      var $myModal = $('#set-tmpl-modal'),
        $tmplName = $('#tmpl-name');
      $myModal.attr('data-id', '');
      $tmplName.val('');
      $myModal.fadeOut();
    },
    // 小票打印机模态框打开
    onShowSetPrtModal: function(e) {
      var $modal = $('#set-prt-modal'),
        $relatedTar = $(e.relatedTarget), // 模态框显示事件需要获取按钮对象,模态框绑定到了a标签上
        curId = parseInt($relatedTar.attr('data-id'));
      (Data.ifHasSub =
        $relatedTar.attr('data-ifHasSub') === 'true' ? true : false), // 此处获取的是字符串
        $modal.attr('data-id', curId); // 将当前佛事id绑定到提交按钮上
      // 获取并渲染打印机列表 有选择项则获取选择项并初始化 获取打印机配置并调用渲染函数
      $.seeAjax.get('printerList', {}, function(res) {
        if (res.success) {
          Data.getPrinterListRes = res;
          if (res.data.length === 0) {
            var $noPrtModal = $('#no-prt-modal');
            $noPrtModal.modal('show');
            return false;
          } else {
            if (Data.ifHasSub) {
              // 获取佛事选择项
              $.seeAjax.post(
                'CommoditySubdivide',
                { commodityId: curId },
                function(res) {
                  Data.getSubListRes = res;
                  func.initSetPrtModal(
                    Data.ifHasSub,
                    Data.getPrinterListRes,
                    Data.getSubListRes
                  );
                  func.getAndRenderPrtCfg(curId);
                },
                true
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
    // 有选择项时切换打印机
    onChangeSubPrtSelect: function(e) {
      var $tar = $(e.target),
        $exceptionTip = $('#exception-tip'),
        $prtNumSelect = $('#prt-num-select'),
        $prtTel = $('#prt-tel'),
        $prtAllQrcode = $('#prt-all-qrcode'),
        $subCheckbox = $('[data-ele="sub-checkbox"]'),
        prtId = parseInt($tar.val()); //value对应着打印机的Id
      // 恢复默认样式
      // 每次打开小票打印模态框的公用样式重置
      $exceptionTip.text('状态查询中...').show(); // 初始隐藏打印机状态提示文本
      $prtNumSelect.val(1).selectpicker('refresh'); // 初始化打印联数
      $prtTel.prop('checked', 'checked'); // 初始化电话
      $prtAllQrcode.prop('checked', 'checked'); // 初始化二维码打印
      $subCheckbox.removeAttr('checked');
      $subCheckbox.removeAttr('disabled');
      func.renderSetPrtModal(Data.ifHasSub, Data.localPrtCfg, prtId);
    },
    // 有选择项时点击选择项
    onClickSubCheckbox: function(e) {
      var $modal = $('#set-prt-modal'),
        $target = $(e.target),
        curId = parseInt($modal.attr('data-id')),
        prtId = parseInt($('#sub-prt-select').val()), // 当前打印机id
        subId = parseInt($target.attr('data-id')), // 规格id
        subCont = $target.next().html(); // 规格内容

      if ($target.is(':checked')) {
        //选中则推入数据
        // 修改本地数据
        Data.localPrtCfg[prtId].subList.push(subId);
        // 修改渲染数据
        Data.handleListData[curId].printerList.map(function(value) {
          if (value.printerId === prtId) {
            value.subNameList.push(subCont);
            value.notBoundSubNameList.splice(
              value.notBoundSubNameList.indexOf(subCont),
              1
            );
          }
        });
        // console.log(Data.handleListData[curId]);
      } else {
        // 未选中则删除数据
        // 修改本地数据
        Data.localPrtCfg[prtId].subList.splice(
          Data.localPrtCfg[prtId].subList.indexOf(subId),
          1
        );
        // 修改渲染数据 由于返回的数据只有选择项名字而无id所以存在重复名选择项时 无法确定同名具体哪个选中 但是不并不影响功能 选中删除时一次只能删除一个
        Data.handleListData[curId].printerList.map(function(value) {
          if (value.printerId === prtId) {
            value.notBoundSubNameList.push(subCont);
            value.subNameList.splice(value.subNameList.indexOf(subCont), 1); // indexOf只会找到第一个
          }
        });
        // console.log(Data.handleListData[curId]);
      }
    },
    // 改变打印联数
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
      // 当为隔联打印时，不能设置为1联打印
      if (continuousPrintNum === 1 && qrcodePrint === 2) {
        alert('请先把“打印联数”设置为大于1，再设置隔联打印功能。');
        $curTar.val(data.continuousPrintNum).selectpicker('refresh');
      } else {
        data.continuousPrintNum = continuousPrintNum;
      }
    },
    // 改变二维码打印
    onClickPrtQrcode: function(e) {
      var $curTar = $(e.currentTarget),
        qrcodePrint = parseInt($curTar.val()),
        continuousPrintNum,
        data;
      // 修改打印机上传参数
      if (Data.ifHasSub) {
        var $subPrtSelect = $('#sub-prt-select'),
          prtId = parseInt($subPrtSelect.val());
        data = Data.localPrtCfg[prtId];
      } else {
        data = Data.localPrtCfg;
      }
      continuousPrintNum = data.continuousPrintNum;
      // 当为1联时，不能设置为隔联打印
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
    // 改变电话打印（有无规格通用参数）
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
    // 无选择项点击打印机开关
    onClickNoSubPrtSwitch: function(e) {
      var $curTar = $(e.currentTarget),
        isOpenPrinter = parseInt($curTar.val()),
        data = Data.localPrtCfg,
        $modal = $('#set-prt-modal'),
        curId = parseInt($modal.attr('data-id')),
        $noSubPrtCheckBox = $('[data-ele="no-sub-prt-checkbox"]');
      if (isOpenPrinter) {
        $noSubPrtCheckBox.removeAttr('disabled');
        // 修改渲染数据
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
        // 修改渲染数据
        Data.handleListData[curId].printerList = [];
      }
      data.isOpenPrinter = isOpenPrinter;
    },
    // 无选择项点击打印机
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
        // 获取当前打印机状态
        $.seeAjax.post(
          'printerStatus',
          { printerId: prtId },
          function(res) {
            if (res.success) {
              $exceptionTip.text(prtName + ' ：' + res.msg).show();
              if (res.msg !== '在线，工作状态正常。') {
                // 打印机离线
                $curTar.prop('checked', false);
                return;
              } else {
                // 打印机在线
                // 修改上传数据
                data.printerId.push(prtId);
                // 修改渲染数据
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
          },
          true
        );
      } else {
        $exceptionTip.text('').hide();
        // 修改上传数据
        data.printerId.splice(data.printerId.indexOf(prtId), 1);
        // 修改渲染数据
        var delIndex;
        Data.handleListData[curId].printerList.map(function(prtItem, index) {
          if (prtItem.printerId === prtId) {
            delIndex = index;
          }
        });
        Data.handleListData[curId].printerList.splice(delIndex, 1);
      }
    },
    // 确认保存小票打印设置
    onClickSavePrtSet: function(e) {
      var $modal = $('#set-prt-modal'),
        curId = parseInt($modal.attr('data-id'));
      // 分有无选择项进行打印机配置上传,两种情况有三个可公用参数，写在各自的按钮事件里进行修改
      if (Data.ifHasSub) {
        // 至少有一个规格配置了打印机才允许上传配置
        var checkExist = false;
        Object.keys(Data.localPrtCfg).map(function(key) {
          Data.localPrtCfg[key].subList.length && (checkExist = true);
        });
        if (!checkExist) {
          Toast('请至少选中一个规格', 2);
          return;
        }
      } else {
        // 开启打印机至少选中一个打印机才能上传
        if (
          Data.localPrtCfg.isOpenPrinter &&
          !Data.localPrtCfg.printerId.length
        ) {
          Toast('请至少选择一台打印机', 2);
          return;
        }
      }
      // 上传数据的格式处理
      var params = func.createUpdatePrtParams(
        Data.ifHasSub,
        curId,
        Data.localPrtCfg,
        Data.getSubListRes.data
      );
      $.seeAjax.post(
        'addAndUpdateCommodity2Printer',
        params,
        function(res) {
          if (res.success) {
            var printerDataResult = func.handleGetListPrinterData(
              Data.handleListData[curId]
            );
            Data.handleListData[curId].ifHasAddPrt =
              printerDataResult.ifHasAddPrt;
            Data.handleListData[curId].ifHasSub = printerDataResult.ifHasSub;
            Data.handleListData[curId].prtText = printerDataResult.prtText;
            // console.log(Data.handleListData[curId]);
            func.renderTr(curId);
            $('#set-prt-modal').modal('hide');
          } else {
            res.message && commonFunc.alert(res.message);
          }
        },
        true
      );
    },

    /*佛事进展modal*/
    // 切换modal-head-nav
    onClickModalHeadNav: function(e) {
      var $curTar = $(e.currentTarget),
        index = parseInt($curTar.attr('data-index'), 10);
      if (!$curTar.hasClass('active')) {
        func.initScheduleModal(index);
      }
    },
    // 点击上传图片 有两个地方用到 所以回调内插入html片段与结构相关
    onClickAddImg: function(e) {
      var $curTar = $(e.currentTarget);
      var upload = new ChooseImage({
        type: 1, // 1: 图片, 2: 图标
        multiUpload: true, // 是否支持多张图片上传(多张图片会以数组的形式上传)
        multiSelect: true, // 是否多选，如果 type=2, 则默认为false
        fieldName: 'files', // 字段名，默认是file(单张图片上传)， files(多张图片)
        // 点击确定的回调函数，返回一个数组
        onSubmit: function(resData) {
          // resData:[{id src type:1自己上传2系统图片}]
          var htmlStr = '';
          resData.map(function(item) {
            htmlStr += tpl.scheduleImgCell.render({ src: item.src });
          });
          $curTar
            .parent()
            .prev()
            .append(htmlStr);
        },
      });
      upload.show();
    },
    // 点击删除图片
    onClickDelImg: function(e) {
      var $curTar = $(e.currentTarget),
        $curImgCell = $curTar.parents('[data-ele="img-cell"]');
      $curImgCell.remove();
    },
    // 点击中断视频上传
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
    // 点击删除视频
    onClickDelVideo: function(e) {
      var $curTar = $(e.currentTarget),
        $curVideoCell = $curTar.parents('[data-ele="video-cell"]');
      $curVideoCell.remove();
    },
    // 点击播放视频
    onClickPlayVideo: function(e) {
      var $curTar = $(e.currentTarget),
        $curVideoCell = $curTar.parents('[data-ele="video-cell"]'),
        src = $curVideoCell.attr('data-src');
      var $videoPlayerMask = $('#video-player-mask');
      func.renderVideoPlayer(src);
      $videoPlayerMask.show();
    },
    // 点击播放器mask
    onClickVideoPlayerMask: function(e) {
      let $tar = $(e.target);
      let $videoPlayerMask = $('#video-player-mask');
      if ($tar.get(0) !== $videoPlayerMask.get(0)) return;
      Data.videoPlayer.pause();
      $videoPlayerMask.hide();
    },
    // 点击保存并发布
    onClickSaveSchedule: function(e) {
      if (Data.isSubmit) {
        return;
      }

      var $modalBody = $('#create-schedule-modal-body'),
        params = {};
      // 佛事id
      params.buddhistId = Data.curBuddhistId;
      // 内容
      var $scheduleContent = $('#schedule-content');
      params.content = $scheduleContent.val();
      params.scheduleId = 0;
      // 图片
      var $scheduleImg = $modalBody.find('[data-ele="schedule-img"]');
      params.img = [];
      $scheduleImg.each(function(index, ele) {
        var $ele = $(ele),
          src = $ele.attr('src');
        params.img.push(src);
      });
      // 视频
      var $videoCells = $modalBody.find('[data-ele="video-cell"]');
      params.video = [];
      $videoCells.each(function(index, ele) {
        var $ele = $(ele),
          src = $ele.attr('data-src');
        params.video.push(src);
      });
      // 推送
      params.isShow = parseInt($('[name="if-push"]:checked').val(), 10);
      // 验证非空
      if (!params.content) {
        Toast('内容不能为空', 2);
        return;
      }

      Data.isSubmit = 1;
      api.updateBuddhistSchedule(params, function(res) {
        Toast('发布成功', 1);
        var $scheduleListNav = $('[data-ele="modal-head-nav"][data-index="1"]');
        $scheduleListNav.click();
        Data.isSubmit = 0;
      });
    },
    // 点击编辑佛事进展
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
    // 点击保存当前佛事进展
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
      // 图片
      params.img = [];
      var $scheduleImg = $curScheduleItem.find('[data-ele="schedule-img"]');
      $scheduleImg.each(function(index, ele) {
        var $ele = $(ele),
          src = $ele.attr('src');
        params.img.push(src);
      });
      // 视频
      params.video = [];
      var $videoCells = $curScheduleItem.find('[data-ele="video-cell"]');
      $videoCells.each(function(index, ele) {
        var $ele = $(ele),
          src = $ele.attr('data-src');
        params.video.push(src);
      });
      // 推送
      var $ifPush = $curScheduleItem.find(
        '[name="if-push-' + scheduleId + '"]:checked'
      );
      if ($ifPush.length) {
        // 存在ifPush的设置dom 说明之前是不推送
        var ifPush = parseInt($ifPush.val(), 10);
        params.isShow = ifPush;
      } else {
        // 不存在ifPush的设置dom 说明之前是推送 不能向后台传这个字段
      }
      // 验证
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
          // 说明之前是不推送
          data.isShow = params.isShow;
        } else {
          // 说明之前是推送 不需要修改本地数据
        }
        var htmlStr = tpl.scheduleItem.render(data);
        $curScheduleItem.replaceWith(htmlStr);
        Toast('修改成功', 1);

        // 修改列表所有隐藏的推送按钮区域设置
        $.seeAjax.get('getPushTimes', {}, function(res) {
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
    // 点击取消编辑当前佛事进展
    onClickCancelScheduleItem: function(e) {
      var $curTar = $(e.currentTarget),
        $curScheduleItem = $curTar.parents('[data-ele="schedule-item"]'),
        scheduleId = parseInt($curScheduleItem.attr('data-id'), 10),
        data = Data.buddhistScheduleListHandleData[scheduleId],
        htmlStr = tpl.scheduleItem.render(data);
      $curScheduleItem.replaceWith(htmlStr);
    },
  });
});
