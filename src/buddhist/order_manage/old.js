/**
 * Created by Linfe on 2017/3/23.
 */
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
define([
  'jquery',
  'underscore',
  'old/toast',
  './config',
  '@zzh/choose-image',
  'old/utils',
  'video.js/dist/video',
  'juicer',
  'old/backbone',
  'bootstrap-select',
  'old/jquery.pagination',
  '@zzh/jquery-qrcode',
], function($, _, Toast, config, ChooseImage, doRequest, videojs) {
  $.ajaxSetup({
    cache: false,
  });

  var feedBackPicHash = {}; // 新上传的图片id - pic hash表
  var pageNum = 0;
  var uEditor = {}; // 存储uEditor实例化变量，有订单详情和设为已/未处理两处
  var is_test_environment = config['environment'];
  var View = Backbone.View.extend({
    arr: [],
    el: 'body',
    beginDate: $('#beginDate').val(), // 下单开始时间
    endDate: $('#endDate').val(), // 下单结束时间
    tel: $('#tel').val(), // 电话号码
    buddishService: $('#buddishService').val(), // 佛事项目id
    orderData1: null, // 未处理订单 数据 在获取分页数据时将结果存储到这三个变量中
    orderData2: null, // 全部订单数据
    orderData3: null, // 已处理订单 数据
    pushOrderList: [], // 选中的未处理订单子项集合
    pushOrderList2: [], // 选中的已处理订单子项集合
    pushOrderList3: [], // 选中的全部订单子项集合
    tabId2: null, // 记录当前是未处理还是已处理还是全部订单 1:未处理，3：已处理，2：全部
    un_complete_order_ids: [], // 未处理待打印订单的ID
    complete_order_ids: [], // 已处理待打印的ID
    all_order_ids: [], // 全部待打印的ID
    // 排序参数
    sort_money_type: {
      tab1: 0,
      tab3: 0,
    }, // 1价格由高到低2价格由低到高0不按价格排序
    sort_time_type: {
      tab1: 0,
      tab3: 0,
    }, // 1时间倒序2时间降序0默认时间倒
    videoPlayer: '', // 实例化的播放器
    events: {
      'click #myTabs a': 'switchTabs', // 切换未处理与已处理和全部订单
      'shown.bs.tab #unScheduledTab': 'showUnScheduled', // 筛选未处理订单 对应page1
      'shown.bs.tab #finishedTab': 'showFinished', // 筛选已处理订单 对应page3
      'shown.bs.tab #allTab': 'showAll', // 显示全部订单 对应page2
      'click #query': 'query', // 点击查询
      'click #reset': 'reset', // 点击重置
      'click #setDisposeModalSubmit': 'postFinishMulti', // 设置为已处理Modal里的确认按钮,上传反馈图片和备注
      'click #sureAddToAccomplishBtn': 'sureAddToBtn', // 详情中设置已处理,确认按钮
      'click #sureAddToUndoBtn': 'sureAddToBtn', // 详情中设置未处理  同一接口
      'show.bs.modal #orderDetailModal': 'showOrderDetail', // 展现订单详情
      'click [data-type="feedback_item"] img': 'feed_back_pic', // 显示图片放大模态框
      'click [data-ele="video-play"]': 'feed_back_video', // 显示视频放大模态框
      'change .selectAll': 'selectAllOrder', // 全选按钮
      'change .orderCheck': 'changeCheckBox', // 点击checkbox
      'click #dispose': 'disposeOrder', // 已处理订单转为未处理订单，未处理订单转为已处理订单
      'click #exportExcel': 'exportExcelDownload', //导出Excel
      'click #saveRemark': 'saveRemark', // 保存评论
      'changed.bs.select #buddishService': 'changeBuddhistSelect', //切换佛事项目
      'changed.bs.select #buddishSizes': 'changeBuddishSizes', //切换佛事选择项
      'click #addFeedBackPic': 'uploadFeedBackPic', // 设置为已处理Modal的上传反馈图片
      'click [data-action="upload_feed_back_pic"]': 'uploadFeedBackPic', // 订单详情里的上传反馈图片
      'click [data-type="printer_div"]': 'selectPrinter', // 绑定无规格时切换打印机选择事件
      'changed.bs.select #printNumber': 'change_print_number', // 改变打印联数事件
      'click [data-type="dimension_code_label"]': 'dimension_code_label', // 改变二维码打印设置
      'click #printOrder': 'printOrder', // 点击小票打印
      'show.bs.modal #printModal': 'printModal', //小票打印弹框
      'hide.bs.modal #printModal': 'closePrintModal', //小票打印关闭
      'click [data-type="surePrint"]': 'surePrint', // 确定打印
      'click #feed_back_pic': 'feed_back_pic', // 点击放大反馈图片
      'click [data-type="postScriptImage"]': 'postScriptImage', // 点击放大附言图片
      'click [data-id="table-title-pay-money"]': 'sort_money', // 按支付排序
      'click [data-id="table-title-pay-time"]': 'sort_time', // 按支付时间排序
      'click [data-image-cell-delete]': 'onClickImageCellDelete',
    },
    onClickImageCellDelete: function(e) {
      var $imagesContent = $(e.target)
        .parent()
        .parent('.images-content');
      $(e.target)
        .parent()
        .remove();
      var images = [];
      $('[data-image-cell-image]').map(function() {
        images.push($(this).attr('src'));
      });
      var params = {};
      var pic = images.join(',');
      var id = parseInt($imagesContent.attr('data-id'));
      params['id'] = id;
      params['pic'] = pic;
      $.ajax({
        url: config.urls.order.updateFBP,
        type: 'GET',
        data: params,
        success: function(res) {
          feedBackPicHash[id] = pic;
          Toast('删除成功！');
          $('#feed_back_pic_box').show();
        },
        error: function(res) {
          Toast('网络服务出错，上传失败');
        },
      });
    },
    sort_money: function() {
      var self = this,
        $titleMoney = $('[role="tabpanel"].active').find(
          '[data-id="table-title-pay-money"] > i'
        ),
        cur_tab = $('#query').attr('data-id');
      if ($titleMoney.hasClass('desc')) {
        $titleMoney.removeClass('desc').addClass('asc');
        self.sort_money_type[cur_tab] = 2;
      } else if ($titleMoney.hasClass('asc')) {
        $titleMoney.removeClass('asc').addClass('unsort');
        self.sort_money_type[cur_tab] = 0;
      } else {
        $titleMoney.removeClass('unsort').addClass('desc');
        self.sort_money_type[cur_tab] = 1;
      }
      $('#query').click();
    },
    sort_time: function() {
      var self = this,
        $titleTime = $('[role="tabpanel"].active').find(
          '[data-id="table-title-pay-time"] > i'
        ),
        cur_tab = $('#query').attr('data-id');
      if ($titleTime.hasClass('desc')) {
        $titleTime.removeClass('desc').addClass('asc');
        self.sort_time_type[cur_tab] = 2;
      } else if ($titleTime.hasClass('asc')) {
        $titleTime.removeClass('asc').addClass('unsort');
        self.sort_time_type[cur_tab] = 0;
      } else {
        $titleTime.removeClass('unsort').addClass('desc');
        self.sort_time_type[cur_tab] = 1;
      }
      $('#query').click();
    },
    changeBuddhistSelect: function(e) {
      var $tar = $(e.target),
        self = this,
        tab = $('#exportExcel').attr('data-id'),
        curBuddhistId = $('#buddishService').val();
      self.buddishService = curBuddhistId;
      $.ajax({
        url: config.urls.order.selection,
        data: {
          commodityId: curBuddhistId,
        },
        dataType: 'JSON',
        type: 'GET',
        success: function(msg) {
          if (msg.result == 1) {
            var sizeData = msg.data;
            if (sizeData.length > 0) {
              var group_str = '<option value="-1">全部</option>';
              for (var i = 0; i < sizeData.length; i++) {
                group_str +=
                  '<option value="' +
                  sizeData[i]['subid'] +
                  '">' +
                  sizeData[i]['name'] +
                  '</option>';
              }
              $('#buddishSizes')
                .html(group_str)
                .selectpicker('refresh')
                .parents('.form-group')
                .removeClass('hide');
            } else {
              $('#buddishSizes')
                .parents('.form-group')
                .addClass('hide');
            }
            self.query(e, tab);
          } else {
            $('#buddishSizes')
              .parents('.form-group')
              .addClass('hide');
          }
        },
        error: function(res) {
          Toast('网络服务出错，获取信息失败，请稍后再试', 0);
        },
      });
    },
    changeBuddishSizes: function(e) {
      var $tar = $(e.target),
        self = this,
        tab = $('#exportExcel').attr('data-id');
      var curBuddhistId = $('#buddishService').val(),
        subId = $('#buddishSizes').val();
      $.ajax({
        url: config.urls.order.selection,
        data: {
          commodityId: curBuddhistId,
          subid: subId,
        },
        dataType: 'JSON',
        type: 'GET',
        success: function(res) {
          self.query(e, tab);
        },
        error: function(res) {
          Toast('网络服务出错，获取订单失败，请稍后再试', 0);
        },
      });
    },
    saveRemark: function(e) {
      var $tar = $(e.target),
        self = this,
        id = $tar.attr('data-proid'),
        page = $tar.attr('data-id'),
        remarkVal = uEditor.OrderDetail.getContent(); // 屏蔽富文本需求
      // remarkVal = $('#orderDetailRemark').val();
      $.ajax({
        url: '/zzhadmin/updateOrderRemark',
        data: {
          id: id,
          remark: remarkVal,
        },
        dataType: 'JSON',
        type: 'GET',
        success: function(data) {
          if (data.result == 1) {
            Toast('保存成功');
            $('#orderDetailModal').modal('hide');
            page.length > 0 ? self.query(e, page) : alert('page is not exist');
          } else if (data.result == -1) {
            Toast(data.msg);
          }
        },
        error: function() {
          Toast('网络服务出错，更新失败', 0);
        },
      });
    },
    exportExcelDownload: function(e) {
      var self = this,
        excelBeginDate = '',
        excelEndDate = '',
        excelTel = '',
        excelBuddishService = '',
        tab = $('#exportExcel').attr('data-id'),
        templeId = eval('(' + window.localStorage['templeid'] + ')'),
        feedBackPic = Number($('#non_feed_back_pic').prop('checked')),
        searchNotPrint = Number($('#hasNotPrint').prop('checked'));
      excelBeginDate = $('#beginDate').val();
      excelEndDate = $('#endDate').val();
      excelTel = $('#tel').val();
      excelBuddishService = $('#buddishService').val();
      /* if(excelBeginDate == '' && excelEndDate == '' && excelTel == '' && excelBuddishService == '-1'){
         Toast("请先选择佛事项目");
         return false;
         } */
      var buddhistSizeId = $('#buddishSizes').val();
      if (buddhistSizeId === '-1') {
        buddhistSizeId = '0';
      }
      window.open(
        '/zzhadmin/bcDownloadExcel/?beginDate=' +
          excelBeginDate +
          '&endDate=' +
          excelEndDate +
          '&tel=' +
          excelTel +
          '&buddishService=' +
          excelBuddishService +
          '&pageName=' +
          tab +
          '&templeId=' +
          templeId +
          '&subdirideId=' +
          buddhistSizeId +
          '&isSearchNoPic=' +
          feedBackPic +
          '&searchNotPrint=' +
          searchNotPrint
      );
    },
    disposeOrder: function(e) {
      var self = this,
        // pushOrderListStr = "",
        cur_tab = $('#dispose').attr('data-id');
      // 未选中任何元素时弹框
      if (cur_tab == 'tab1') {
        if (self.pushOrderList.length === 0) {
          Toast('请勾选需要设置已处理的订单', 2);
          return false;
        }
      } else if (cur_tab == 'tab3') {
        if (self.pushOrderList2.length === 0) {
          Toast('请勾选需要设置未处理的订单', 2);
          return false;
        }
      } else if (cur_tab == 'tab2') {
        // 显示全部订单时隐藏按钮不做任何处理
      }
      if (cur_tab == 'tab1') {
        var $setDisposeModal = $('#setDisposeModal');
        $setDisposeModal
          .find('.images-content')
          .eq(0)
          .html('');
        // $('#setDisposeModalRemark').val('');
        $setDisposeModal.modal('show'); // 展示设置订单反馈图片Modal
        self.renderSetDisposeUeditor(); // 屏蔽富文本需求
        return false;
      } else if (cur_tab == 'tab3') {
        self.postFinishMulti();
      }
    },
    postFinishMulti: function() {
      // 获取参数
      var self = this,
        pushOrderListStr = '',
        cur_tab = $('#dispose').attr('data-id'),
        data;
      // 存储选中的列表项id集合
      if (cur_tab == 'tab1') {
        data = {};
        pushOrderListStr = '[' + self.pushOrderList.toString() + ']';
        var images = [];
        $('#setDisposeModal')
          .find('[data-image-cell-image]')
          .map(function() {
            images.push($(this).attr('src'));
          });
        data.pics = images.join(',');
        data.remark = uEditor.setDispose.getContent(); // 屏蔽富文本需求
        // data.remark = $('#setDisposeModalRemark').val();
      } else if (cur_tab == 'tab3') {
        data = {};
        pushOrderListStr = '[' + self.pushOrderList2.toString() + ']';
      } else if (cur_tab == 'tab2') {
        // 显示全部订单时隐藏按钮不做任何处理
      }
      data.orderIds = pushOrderListStr;
      // 此地址根据发送的id集合自动查询其所处地址并将其取反到对应文件，因此一个请求可以正确处理已处理未处理订单的转换
      $.post(
        config.urls.order.finishMulti,
        data,
        function(res) {
          self.query(null, cur_tab);
          var $page; // 由于插件没有预留加载某一页的功能，此处主动触发点击某一页，后期进行优化,所以点击后会有三条服务器请求
          if (cur_tab == 'tab1') {
            $page = $('#page1');
            self.pushOrderList = [];
          } else if (cur_tab == 'tab3') {
            $page = $('#page3');
            self.pushOrderList2 = [];
          } else if (cur_tab == 'tab2') {
            self.pushOrderList3 = [];
          }
          $('#selectNum')
            .find('span')
            .html('0');
          $('.selectAll').prop('checked', false);
          Toast('设置成功！');
          // 主动触发跳页，触犯翻页点击，可能需要点击的元素不存在
          $page
            .find('[data-page-btn="jump"]')
            .eq(0)
            .prev()
            .val(pageNum + 1);
          $page
            .find('[data-page-btn="jump"]')
            .eq(0)
            .click();
        },
        'json'
      );
    },
    renderSetDisposeUeditor: function() {
      uEditor.setDispose = UE.getEditor('setDisposeModalRemark');
      uEditor.setDispose.ready(function() {
        uEditor.setDispose.setContent('');
      });
    },
    renderOrderDetailUeditor: function(remarkHtml) {
      uEditor.OrderDetail = UE.getEditor('orderDetailRemark');
      uEditor.OrderDetail.ready(function() {
        uEditor.OrderDetail.setContent(remarkHtml);
      });
    },
    changeCheckBox: function(e) {
      var self = this,
        $tar = $(e.target),
        $selectNum = $('#selectNum').find('span'),
        tab = $('#dispose').attr('data-id'),
        if_all_selected = true,
        get_check_box = $(
          '.tab-pane.active [type="checkbox"]:not(".selectAll")'
        );
      get_check_box.map(function(index, ele) {
        if_all_selected = if_all_selected && $(ele).prop('checked');
      });
      if (!if_all_selected) {
        $('.tab-pane.active .selectAll').removeAttr('checked');
      } else {
        $('.tab-pane.active .selectAll').prop('checked', 'checked');
      }
      if (tab == 'tab1') {
        if ($tar.prop('checked')) {
          self.pushOrderList.push($tar.val());
        } else {
          self.pushOrderList.remove($tar.val());
        }
        $selectNum.html(self.pushOrderList.length);
      } else if (tab == 'tab3') {
        if ($tar.prop('checked')) {
          self.pushOrderList2.push($tar.val());
        } else {
          self.pushOrderList2.remove($tar.val());
        }
        $selectNum.html(self.pushOrderList2.length);
      } else if (tab == 'tab2') {
        if ($tar.prop('checked')) {
          self.pushOrderList3.push($tar.val());
        } else {
          self.pushOrderList3.remove($tar.val());
        }
        $selectNum.html(self.pushOrderList3.length);
      }
    },
    selectAllOrder: function(e) {
      var self = this,
        $selectNum = $('#selectNum').find('span'),
        tab = $('#dispose').attr('data-id');
      if (tab == 'tab1') {
        self.tabId2 = '#unScheduled';
      } else if (tab == 'tab3') {
        self.tabId2 = '#finished';
      } else if (tab == 'tab2') {
        self.tabId2 = '#all';
      }
      var $tar = $(e.target);
      if ($tar.prop('checked')) {
        for (var i = 0; i < $(self.tabId2 + ' .orderCheck').length; i++) {
          if ($($(self.tabId2 + ' .orderCheck')[i]).prop('checked') != true) {
            $($(self.tabId2 + ' .orderCheck')[i]).prop('checked', true);
            if (tab == 'tab1') {
              self.pushOrderList.push(
                $($(self.tabId2 + ' .orderCheck')[i]).val()
              );
              $selectNum.html(self.pushOrderList.length);
            } else if (tab == 'tab3') {
              self.pushOrderList2.push(
                $($(self.tabId2 + ' .orderCheck')[i]).val()
              );
              $selectNum.html(self.pushOrderList2.length);
            } else if (tab == 'tab2') {
              self.pushOrderList3.push(
                $($(self.tabId2 + ' .orderCheck')[i]).val()
              );
              $selectNum.html(self.pushOrderList3.length);
            }
          }
        }
      } else {
        for (var i = 0; i < $(self.tabId2 + ' .orderCheck').length; i++) {
          if ($($(self.tabId2 + ' .orderCheck')[i]).prop('checked') != false) {
            $($(self.tabId2 + ' .orderCheck')[i]).prop('checked', false);
            if (tab == 'tab1') {
              self.pushOrderList = [];
              $selectNum.html(self.pushOrderList.length);
            } else if (tab == 'tab3') {
              self.pushOrderList2 = [];
              $selectNum.html(self.pushOrderList2.length);
            } else if (tab == 'tab2') {
              self.pushOrderList3 = [];
              $selectNum.html(self.pushOrderList3.length);
            }
          }
        }
      }
    },
    sureAddToBtn: function(e) {
      var $curTar = $(e.currentTarget);
      $curTar.prop('disabled', true);

      var self = this;
      var id = $(e.target).attr('data-proid');
      var remark = uEditor.OrderDetail.getContent(); // 屏蔽富文本需求

      if (id) {
        isSubmitting = true;

        var images = [];
        $('#orderDetailModal')
          .find('[data-ele="feedback-image"]')
          .each(function(index, ele) {
            images.push($(ele).attr('src'));
          });

        $.ajax({
          type: 'POST',
          dataType: 'JSON',
          url: config.urls.order.finishMulti,
          data: {
            pics: images.join(','),
            orderIds: '[' + id + ']',
            remark: remark,
          },
          success: function(data) {
            $('#orderDetailModal').modal('hide');
            // 接口响应时间过快 而 modal('hide') 方法有延迟
            // 导致modal还没隐藏便把按钮设为可点击了 因此使用延迟避免多次点击
            setTimeout(function() {
              $curTar.prop('disabled', false);
            }, 800);
            self.query(e, 'tab1');
            self.query(e, 'tab3');
            Toast('设置成功');
          },
          error: function() {
            Toast('网络服务出错，设置失败', 0);
            $curTar.prop('disabled', false);
          },
        });
      } else {
        alert('pro id is missing');
        $curTar.prop('disabled', false);
      }
    },
    showOrderDetail: function(e) {
      var self = this,
        $tar = $(e.relatedTarget),
        id = $tar.attr('data-id'),
        pageName = $tar.attr('data-pagename'),
        data = self['orderData' + pageName];
      data = _.find(data.data, function(item) {
        return item.id == id;
      });
      if (data) {
        var html = juicer(config.template.component.orderDetailBox_tmp),
          // remark= $("#orderDetailModal").find('.remark').eq(0),
          curFBP = feedBackPicHash[id];
        if (typeof curFBP != 'undefined') {
          data['dispose_pic_url'] = curFBP;
        }
        data['dispose_pic_url'] &&
          (data.images = data['dispose_pic_url'].split(','));
        data['dispose_video_url'] &&
          (data.videos = data['dispose_video_url'].split(','));
        $('#orderDetailBox').html(html.render(data));
        $('#saveRemark')
          .attr('data-proid', id)
          .attr('data-id', 'tab' + pageName);
        if (data.remark != null) {
          // $('#orderDetailRemark').val(data.remark);
          self.renderOrderDetailUeditor(data.remark); // 屏蔽富文本需求
        } else {
          // $('#orderDetailRemark').val('');
          self.renderOrderDetailUeditor(''); // 屏蔽富文本需求
        }
        if (pageName == 1) {
          $('#orderNumberBox').show(); // 显示订单号
          $('#accomplishTimeBox').hide(); // 隐藏完成时间显示
          $('#sureAddToAccomplishBtn')
            .attr('data-proid', id)
            .attr('data-id', 'tab' + pageName)
            .show();
          $('#sureAddToUndoBtn')
            .attr('data-proid', id)
            .attr('data-id', 'tab' + pageName)
            .hide();
        } else if (pageName == 3) {
          // $("#orderNumberBox").hide();
          // $("#accomplishTimeBox").show();
          $('#orderNumberBox').show(); // 显示订单号
          $('#accomplishTimeBox').hide();
          $('#sureAddToAccomplishBtn')
            .attr('data-proid', id)
            .attr('data-id', 'tab' + pageName)
            .hide();
          $('#sureAddToUndoBtn')
            .attr('data-proid', id)
            .attr('data-id', 'tab' + pageName)
            .show();
        } else if (pageName == 2) {
          // 隐藏两个按钮
          $('#orderNumberBox').show();
          $('#accomplishTimeBox').hide();
          $('#sureAddToAccomplishBtn').hide();
          $('#sureAddToUndoBtn').hide();
        }
        var qrcode_style = {};
        qrcode_style['width'] = 100;
        qrcode_style['height'] = 100;
        qrcode_style['text'] = data['qrcode'];
        $('#order_qrcode').qrcode(qrcode_style);

        data.images &&
          data.images.length >= 10 &&
          $('#feed_back_pic_box').hide();
      }
    },
    //重置筛选
    reset: function(e) {
      var self = this,
        pageName = $(e.currentTarget).attr('data-id');
      var pageObj = {
        tab1: [self.beginDate, self.endDate, self.tel, self.buddishService],
        tab2: [self.beginDate, self.endDate, self.tel, self.buddishService],
        tab3: [self.beginDate, self.endDate, self.tel, self.buddishService],
      };
      $('#beginDate').val('');
      $('#endDate').val('');
      $('#tel').val('');
      $('#buddishService').selectpicker('val', '-1');
      $('#buddishSizes').selectpicker('val', '-1');
      $('#buddishSizes')
        .parents('.form-group')
        .addClass('hide');
      pageObj[pageName] = ['', '', '', '-1'];
      self.query(e);
    },
    paginationStart: function(
      page,
      url,
      params,
      successTemp,
      successPlace,
      flag,
      paginationName
    ) {
      var self = this;
      $(page)
        .page({
          paginationName: paginationName,
          firstBtnText: '首页',
          lastBtnText: '尾页',
          prevBtnText: '上一页',
          nextBtnText: '下一页',
          showInfo: true,
          showJump: true,
          jumpBtnText: '跳转',
          showPageSizes: true,
          pageSizeItems: [25, 50],
          pageSize: 25,
          infoFormat: '共{total}条',
          remote: {
            url: url,
            params: params,
            success: function(result, pageIndex) {
              // console.log(result)
              if (result.data.length == 0) {
                var zeroSpan = $(
                    '<span data-id="noResult" style="margin: 0 auto;width: 200px; display: block;">抱歉，没有找到相关的结果</span>'
                  ),
                  get_page_index = page.substr(5);
                if (get_page_index == '1') {
                  $('#unScheduled').addClass('hide');
                } else {
                  $('#finished').addClass('hide');
                }
                if (
                  $('.tab-content').find('[data-id="noResult"]').length == 0
                ) {
                  $('.tab-content').append(zeroSpan);
                }
                $(successPlace).html('');
                $('.numBadge').text('');
                $('[data-buddhist-order-count]').text('');
                window.localStorage['orderNumber'] = '';
              } else {
                var html = juicer(config.template.component.all_list),
                  get_page_index = page.substr(5);
                $('.tab-content')
                  .find('[data-id="noResult"]')
                  .remove();
                if (get_page_index == '1') {
                  $('#unScheduled').removeClass('hide');
                } else if (get_page_index == '3') {
                  $('#finished').removeClass('hide');
                } else if (get_page_index == '2') {
                  $('#all').removeClass('hide');
                }
                $(successPlace).html(html.render(result));
                self['orderData' + result.pageName] = result;
                if (result.pageName == 1 && !flag && result.total != 0) {
                  $('.numBadge').text(result.total);
                  // 导航栏的total显示
                  $('[data-buddhist-order-count]').text(result.total);
                  window.localStorage['orderNumber'] = result.total;
                } else if (result.pageName == 1 && !flag && result.total == 0) {
                  $('.numBadge').text('');
                  // 导航栏的total显示
                  $('[data-buddhist-order-count]').text('');
                  window.localStorage['orderNumber'] = '';
                }
              }
              $('input.selectAll')
                .eq(0)
                .prop('checked', '');
              console.log(result.total);
            },
            error: function() {
              Toast('网络服务出错，获取列表失败', 0);
            },
            beforeSend: function() {
              $('#loading-toast').removeClass('hide');
            },
            complete: function() {
              $('#loading-toast').addClass('hide');
            },
          },
        })
        .on('pageClicked', function(event, pageIndex) {
          //
          pageNum = pageIndex;
        })
        .on('jumpClicked', function(event, pageIndex) {
          pageNum = pageIndex;
        });
    },
    query: function(e, pagename) {
      var self = this,
        beginDate = $('#beginDate').val(),
        endDate = $('#endDate').val(),
        tel = $.trim($('#tel').val()),
        buddishService = selectId || $('#buddishService').selectpicker('val'),
        subid = $('#buddishSizes').selectpicker('val');
      var pageName = pagename || $(e.currentTarget).attr('data-id'),
        feedBackPic = Number($('#non_feed_back_pic').prop('checked')),
        searchNotPrint = Number($('#hasNotPrint').prop('checked')),
        // btnId=e.currentTarget.id || query,
        flag = false;
      self.arr['tab1'] = [
        '#page1',
        config.urls.order.list,
        '#unScheduledList',
        '.paginationFooter1',
        'beginDate',
        'endDate',
        'tel',
        'buddishService',
      ];
      self.arr['tab2'] = [
        '#page2',
        config.urls.order.list,
        '#allList',
        '.paginationFooter2',
        'beginDate',
        'endDate',
        'tel',
        'buddishService',
      ];
      self.arr['tab3'] = [
        '#page3',
        config.urls.order.list,
        '#finishedList',
        '.paginationFooter3',
        'beginDate',
        'endDate',
        'tel',
        'buddishService',
      ];
      $(self.arr[pageName][0]).page('destroy');
      var templeId = eval('(' + window.localStorage['templeid'] + ')');
      self.paginationStart(
        self.arr[pageName][0],
        self.arr[pageName][1],
        {
          beginDate: beginDate,
          endDate: endDate,
          tel: tel,
          templeId: templeId,
          buddishService: buddishService,
          subid: subid,
          pageName: pageName,
          isSearchNoPic: feedBackPic,
          searchNotPrint: searchNotPrint,
          orderByPriceType: self.sort_money_type[pageName], // 1价格由高到低2价格由低到高0不按价格排序
          orderByTimeType: self.sort_time_type[pageName], // 1时间倒序2时间降序0默认时间倒序
        },
        '#all_list',
        self.arr[pageName][2],
        flag,
        self.arr[pageName][3]
      );
      self.arr[pageName][4] = beginDate;
      self.arr[pageName][5] = endDate;
      self.arr[pageName][6] = tel;
      self.arr[pageName][7] = buddishService;
      selectId = null;
    },
    showUnScheduled: function(e) {
      var self = this;
      // $("#buddishSizes").parents(".form-group").addClass("hide");
      $('#query').attr('data-id', 'tab1');
      $('#reset').attr('data-id', 'tab1');
      $('#exportExcel').attr('data-id', 'tab1');
      /*$("#beginDate").datepicker("setDate",self.beginDate);
        $("#endDate").datepicker("setDate",self.endDate);
        $("#tel").val(self.tel);
        $("#buddishService").selectpicker("val",self.buddishService);
        $('#buddishService').selectpicker('refresh');*/
      $('#selectAll').attr('data-id', 'tab1');
      $('#dispose').attr('data-id', 'tab1');
      $('#dispose').text('设为已处理');
      $('#dispose').show();
      $('.tab-pane.active [type="checkbox"]').removeAttr('checked');
      self.query(e, 'tab1');
    },
    showFinished: function(e) {
      var self = this;
      // $("#buddishSizes").parents(".form-group").addClass("hide");
      $('#query').attr('data-id', 'tab3');
      $('#reset').attr('data-id', 'tab3');
      $('#exportExcel').attr('data-id', 'tab3');
      /*$("#beginDate").datepicker("setDate",self.beginDate);
        $("#endDate").datepicker("setDate",self.endDate);
        $("#tel").val(self.tel);
        $("#buddishService").selectpicker("val",self.buddishService);
        $('#buddishService').selectpicker('refresh');*/
      $('#selectAll').attr('data-id', 'tab3');
      $('#dispose').attr('data-id', 'tab3');
      $('#dispose').text('设为未处理');
      $('#dispose').show();
      $('.tab-pane.active [type="checkbox"]').removeAttr('checked');
      self.query(e, 'tab3');
    },
    showAll: function(e) {
      var self = this;
      // $("#buddishSizes").parents(".form-group").addClass("hide");
      $('#query').attr('data-id', 'tab2');
      $('#reset').attr('data-id', 'tab2');
      $('#exportExcel').attr('data-id', 'tab2');
      /*$("#beginDate").datepicker("setDate",self.beginDate);
         $("#endDate").datepicker("setDate",self.endDate);
         $("#tel").val(self.tel);
         $("#buddishService").selectpicker("val",self.buddishService);
         $('#buddishService').selectpicker('refresh');*/
      $('#selectAll').attr('data-id', 'tab2');
      $('#dispose').attr('data-id', 'tab2');
      $('#dispose').hide();
      $('.tab-pane.active [type="checkbox"]').removeAttr('checked');
      self.query(e, 'tab2');
    },
    switchTabs: function(e) {
      var self = this;
      e.preventDefault();
      $(this).tab('show');
      self.pushOrderList = [];
      self.pushOrderList2 = [];
      self.pushOrderList3 = [];
      $('#selectNum')
        .find('span')
        .html('0');
    },
    loadSelectData: function() {
      $.ajax({
        type: 'get',
        url: config.urls.order.commodity,
        async: false,
        data: {},
        success: function(msg) {
          if (msg['result'] == 1) {
            //标签
            var groups = msg['data'];
            if (groups) {
              var group_str = '<option value="-1">全部</option>';
              for (var i = 0; i < groups.length; i++) {
                group_str +=
                  '<option value="' +
                  groups[i]['commodityId'] +
                  '">' +
                  groups[i]['name'] +
                  '</option>';
              }
              $('#buddishService').html(group_str);
              $('#buddishService').selectpicker('refresh');
            }
          }
        },
        error: function(msg) {
          Toast('网络服务出错，请稍后再试', 0);
        },
      });
    },
    UrlSearch: function() {
      var name, value;
      var str = location.href; //取得整个地址栏
      var num = str.indexOf('?');
      str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

      var temp_arr = str.split('&'); //各个参数放到数组里
      for (var i = 0; i < temp_arr.length; i++) {
        num = temp_arr[i].indexOf('=');
        if (num > 0) {
          name = temp_arr[i].substring(0, num);
          value = temp_arr[i].substr(num + 1);
          this[name] = value;
        }
      }
    },
    change_print_number: function(e) {
      var self = this,
        $tar = $(e.target),
        getVal = $tar.val(),
        cur_printer = $('#selectPrinter').val();
      if (getVal == 1 && $('#print_divide').prop('checked') == true) {
        Toast('请先把“打印联数”设置为大于1，再设置隔联打印功能。', 2);
        $('#printNumber')
          .val(2)
          .selectpicker('refresh');
        return false;
      }
    },
    dimension_code_label: function(e) {
      var self = this,
        $tar = $(e.target),
        $checkBox = $tar.parents('.form-group').find('#print_divide'),
        cur_printer = $('#selectPrinter').val();
      if ($('#printNumber').val() < 2 && $checkBox.prop('checked')) {
        Toast('请先把“打印联数”设置为大于1，再设置隔联打印功能。', 2);
        $('#print_all').prop('checked', 'checked');
        return false;
      }
    },
    selectPrinter: function(e) {
      var self = this,
        $tar = $(e.target),
        opt = {},
        $tarParent = $tar.parent(),
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
        var get_msg = self.detectPrinter(e, opt);
        $tarParent
          .find('[data-type="exception_tip"]')
          .eq(0)
          .text(get_msg);
        if (get_msg != '在线，工作状态正常。') {
          $tar.removeAttr('checked');
          if (get_msg == null) {
            Toast('打印机服务器出错，请联系平台工作人员。', 0);
          } else {
            alert(get_msg);
          }
        }
      } else {
        $tarParent
          .find('[data-type="exception_tip"]')
          .eq(0)
          .text('');
      }
    },
    detectPrinter: function(e, opt) {
      var self = this,
        return_data = '';
      if (!!is_test_environment) {
        $.ajax({
          url: config.urls.order.status,
          data: opt,
          type: 'GET',
          async: false,
          success: function(res) {
            return_data = res.msg;
          },
          error: function(res) {
            Toast('网络服务出错，获取打印机状态失败！');
            return_data = res.msg;
          },
        });
      } else {
        doRequest(
          config.urls.order.status,
          opt,
          function(res) {
            return_data = res.msg;
          },
          function(res) {
            Toast('网络服务出错，获取打印机状态失败！');
            return_data = res.msg;
          },
          false
        );
      }
      return return_data;
    },
    printOrder: function(e) {
      var self = this,
        cur_tab = $('#dispose').attr('data-id');
      if (cur_tab == 'tab1') {
        var $orderInput = $('#unScheduledList').find('.orderCheck');
        self.un_complete_order_ids = [];
        $.each($orderInput, function(index, ele) {
          if ($(ele).prop('checked')) {
            self.un_complete_order_ids.push(parseInt($(ele).val()));
          }
        });
        if (self.un_complete_order_ids.length == 0) {
          Toast('请先选择要打印的订单', 2);
          return false;
        }
        $('#printModal').modal('show');
      } else if (cur_tab == 'tab3') {
        var $orderInput = $('#finished').find('.orderCheck');
        self.complete_order_ids = [];
        $.each($orderInput, function(index, ele) {
          if ($(ele).prop('checked')) {
            self.complete_order_ids.push(parseInt($(ele).val()));
          }
        });
        if (self.complete_order_ids.length == 0) {
          Toast('请先选择要打印的订单', 2);
          return false;
        }
        $('#printModal').modal('show');
      } else if (cur_tab == 'tab2') {
        var $orderInput = $('#all').find('.orderCheck');
        self.all_order_ids = [];
        $.each($orderInput, function(index, ele) {
          if ($(ele).prop('checked')) {
            self.all_order_ids.push(parseInt($(ele).val()));
          }
        });
        if (self.all_order_ids.length == 0) {
          Toast('请先选择要打印的订单', 2);
          return false;
        }
        $('#printModal').modal('show');
      }
    },
    printModal: function(e) {
      var self = this,
        printerList = '',
        opt = {},
        status_str =
          '<option value="1" data-action="print-number" >1联</option>' +
          '<option value="2" data-action="print-number" >2联</option>' +
          '<option value="3" data-action="print-number" >3联</option>' +
          '<option value="4" data-action="print-number" >4联</option>' +
          '<option value="5" data-action="print-number" >5联</option>';
      $('#printNumber').html(status_str);
      $('#printNumber').selectpicker('val', '1');
      $('#printNumber').selectpicker('refresh');
      // 更新默认的二维码打印方法为全部打印
      $('[name="print_method"]')
        .eq(1)
        .prop('checked', true);
      $.ajax({
        type: 'get',
        url: config.urls.order.printer,
        async: false,
        success: function(res) {
          // 获取打印机列表
          printerList = res.data;
        },
        error: function(res) {
          Toast('网络服务出错，获取不到打印机信息', 0);
        },
      });
      if (printerList.length == 0) {
        $('#noPrinterModal').modal('show');
        return false;
      }
      var $noSelectPrinterDiv = $('[data-type="noSelectPrinter"]').eq(0),
        print_list_json = {},
        print_list_arr = [],
        template = juicer(config.template.component.print_list);
      $.each(printerList, function(index, ele) {
        var print_list_object = {};
        print_list_object['id'] = ele.id;
        print_list_object['address'] = ele.address;
        print_list_arr[index] = print_list_object;
      });
      // 上述操作为数据格式转换，将获取的数据转化为渲染数据格式，然后一次性渲染出打印机列表，data id address
      // printer_list_arr = [{id:xx,address:xx,},{id:xx,address:xx,}...]
      print_list_json['data'] = print_list_arr;
      $noSelectPrinterDiv.html(template.render(print_list_json));
      if (printerList.length == 1) {
        var opt = {},
          get_msg = '',
          $cur_printer = $('[data-type="printer_div"]').eq(0);
        opt['printerId'] = $cur_printer.attr('data-id');
        get_msg = self.detectPrinter(e, opt);
        if (get_msg == '在线，工作状态正常。') {
          $cur_printer.prop('checked', 'checked');
        } else {
          if (get_msg == null) {
            Toast('打印机服务器出错，请联系平台工作人员。', 0);
          }
        }
        $cur_printer
          .parent()
          .find('[data-type="exception_tip"]')
          .eq(0)
          .text(get_msg);
      }
    },
    closePrintModal: function(e) {
      var self = this;
      $('[data-type="noSelectPrinter"]')
        .eq(0)
        .find('[data-type="printer_div"]')
        .prop('checked', '');
    },
    surePrint: function(e) {
      var self = this,
        // 选中的打印机
        selected_printer = [],
        cur_ercode = '',
        cur_mobile = '',
        cur_tab = $('#dispose').attr('data-id'),
        opt = {};
      $.each(
        $('[data-type="noSelectPrinter"]')
          .eq(0)
          .find('input:checked'),
        function(index, ele) {
          selected_printer.push(parseInt($(ele).attr('data-id')));
        }
      );
      if (selected_printer.length == 0) {
        Toast('请选择打印机！', 2);
        return false;
      }
      cur_ercode = parseInt($('[name="print_method"]:checked').val()); //  获取打印二维码参数
      cur_mobile = parseInt($('[name="print_tel_method"]:checked').val()); //  获取打印电话号码参数
      if (cur_tab == 'tab1') {
        opt['orderIdList'] = self.un_complete_order_ids;
      } else if (cur_tab == 'tab3') {
        opt['orderIdList'] = self.complete_order_ids;
      } else if (cur_tab == 'tab2') {
        opt['orderIdList'] = self.all_order_ids;
      }
      opt['printerIdList'] = selected_printer;
      opt['printNum'] = parseInt($('#printNumber').val());
      opt['qrcodePrint'] = cur_ercode;
      opt['isPrintMobile'] = cur_mobile;
      if (is_test_environment) {
        $.ajax({
          url: config.urls.order.printOrder,
          type: 'GET',
          data: opt,
          success: function(res) {
            var msg = '正在打印' + opt['orderIdList'].length + '个订单';
            Toast(msg);
            $('#printModal').modal('hide');
          },
          error: function(res) {
            alert('网络服务出错，请稍后再试');
          },
        });
      } else {
        doRequest(
          config.urls.order.printOrder,
          opt,
          function(res) {
            var msg = '正在打印' + opt['orderIdList'].length + '个订单';
            Toast(msg);
            $('#printModal').modal('hide');
          },
          function(res) {
            alert(res['msg']);
          }
        );
      }
    },
    feed_back_pic: function(e) {
      var self = this,
        $tar = $(e.target),
        cur_src = $tar.attr('src');
      $('#show_feed_back_pic img').attr('src', cur_src);
      $('#show_feed_back_pic').modal('show');
    },
    feed_back_video: function(e) {
      var self = this,
        $curTar = $(e.currentTarget),
        $videoCell = $curTar.parents('[data-ele="video-cell"]'),
        $video = $videoCell.find('[data-ele="video"]'),
        $videoSource = $('#video-source'),
        cur_video = $video.prop('src');
      if (self.videoPlayer) {
        // 已初始化
        self.videoPlayer.src(cur_video);
        self.videoPlayer.load();
      } else {
        // 未初始化
        $videoSource.prop('src', cur_video);
        self.videoPlayer = videojs('video-player');
        self.videoPlayer.ready(function() {
          console.log('初始化videojs成功');
        });
      }
      $('#show_feed_back_video').modal('show');
    },
    postScriptImage: function(e) {
      var self = this;
      var $tar = $(e.target),
        cur_src = $tar.attr('src');
      $('#show_post_script_pic img').attr('src', cur_src);
      $('#show_post_script_pic').modal('show');
    },
    uploadFeedBackPic: function(e) {
      var self = this,
        $tar = $(e.target);
      upload = new ChooseImage({
        multiSelect: !0,
        onSubmit: function(data) {
          var html = self.html,
            id = $tar.attr('data-id'),
            sizePicId = $tar.attr('id'),
            $imagesContent = $tar
              .parents('.modal-body')
              .eq(0)
              .find('.images-content')
              .eq(0);
          data.map(function(value, index, arr) {
            $imagesContent.append(
              juicer(config.template.component.imageCell, { image: value.src })
            );
          });
          if ($('#setDisposeModal').hasClass('in')) {
            // 设为已处理的Modal不在此处上传服务器
            return false;
          } else {
            var images = [];
            $('[data-image-cell-image]').map(function() {
              images.push($(this).attr('src'));
            });
            self.updateFeedBackPic(id, images.join(','));
          }
        },
      });
      upload.show();
    },
    updateFeedBackPic: function(id, pic) {
      var params = {};
      params['id'] = id;
      params['pic'] = pic;
      $.ajax({
        url: config.urls.order.updateFBP,
        type: 'GET',
        data: params,
        success: function(res) {
          feedBackPicHash[id] = pic;
          $('#feed_back_pic').hide();
          $('[data-action="upload_feed_back_pic"]')
            .eq(0)
            .text('点击上传');
          Toast('上传成功！');

          pic.split(',').length >= 10 && $('#feed_back_pic_box').hide();
        },
        error: function(res) {
          Toast('网络服务出错，上传失败');
        },
      });
    },
    initialize: function() {
      var self = this,
        templeId = eval('(' + window.localStorage['templeid'] + ')'),
        feedBackPic = Number($('#non_feed_back_pic').prop('checked')),
        searchNotPrint = Number($('#hasNotPrint').prop('checked')),
        UrlSearch = new self.UrlSearch();
      selectId = UrlSearch.id;
      //日期初始化
      $('.input-daterange').datepicker({
        keyboardNavigation: false,
        language: 'zh-CN',
        todayHighlight: true,
        forceParse: false,
        autoclose: true,
        clearBtn: false,
        format: 'yyyy-mm-dd',
      });
      $('.input-daterange input').each(function() {
        $(this).datepicker('clearDates');
      });
      $('.selectpicker').selectpicker({});
      self.loadSelectData();
      // 默认显示未处理订单
      self.paginationStart(
        '#page1',
        config.urls.order.list,
        {
          pageName: 'tab1',
          templeId: templeId,
          isSearchNoPic: feedBackPic,
          searchNotPrint: searchNotPrint,
        },
        '#all_list',
        '#unScheduledList',
        false,
        '.paginationFooter1'
      );
      $('#loading-toast').addClass('hide');
      if (selectId !== undefined) {
        setTimeout(function() {
          $('#query').click();
        }, 100);
        var $selectButton = $('[data-id="buddishService"]');
        $('#buddishService').selectpicker('val', selectId);
      }
      // $('#finishedTab').click(); // 如若默认显示完成订单，主动触发点击
    },
  });
  var msgListView = new View();
  var selectId;
});
