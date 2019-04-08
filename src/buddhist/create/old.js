/**
 * Created by Linfe on 2017/3/1.
 */
/**
 * 编辑佛事
 */
define([
  'jquery',
  'underscore',
  'old/toast',
  'moment',
  'clipboard',
  '@zzh/choose-image',
  './config',
  './dispose_model',
  './util',
  '@zzh/store-image',
  'util/purify_a_target',
  'old/utils',
  'old/backbone',
  'juicer',
  'jquery-confirm',
  'bootstrap-select',
  'bootstrap-switch',
  'jquery-ui/ui/widgets/sortable',
], function(
  $,
  _,
  Toast,
  moment,
  ClipBoard,
  ChooseImage,
  config,
  modelDispose,
  myTool,
  StoreImage,
  purifyATarget,
  doRequest
) {
  $.ajaxSetup({
    cache: false,
  });
  var is_test_environment = config.environment; // 测试环境为true
  window.contentData = {}; // 提交前的所有数据集合

  // 当前页面用到的重要正则
  var myRegExp = {
    suixi_price: /((\d)+(\.(\d)+)?(\,|\，)?)+/g,
    // 正则解释： (n位数字开头) (.n位数字出现0-n次)  (,或，n位数字(.n位数字出现0-n次))出现0-n次
    suixi_price_right: /^(\d+)(\.(\d+))*((,|，)\d+(\.(\d+))?)*$/,
  };

  var foshiId = null, // 佛事ID
    templateId = null, // 佛事模板ID
    editType = null, // 编辑类型  0为复制,1为编辑, 2为用系统佛事模板新建,3为使用我的模板新建或编辑我的模板
    foshiName = null, // 佛事类型名称
    ifTemplate = null, // 若是我的佛事模板编辑点击进来为1，其它为正常模板id
    verifyId = null, // 若是通过审核的佛事，则由地址参数带入为1，否则无此参数为undefined
    sizeIteration = 0, // 选择项图片计数
    origin_printer_list = [], // 原始打印机设置列表
    printer_list = [], // 打印机设置列表
    selection_list = [], // 选择项列表
    no_selection_list = [], // 没有选择项时小票打印设置
    ifFirstSave = true, // 第一次点击保存按钮
    first_set = true, // 第一次进入小票打印设置Modal
    overall_if_open_printer = false, // 无规格时是否开启打印机，有规格时是否选择了规格,
    set_imagetext = 1, // 保存后的弹框选项
    template_content = {}, // 获取的模板内容
    has_local_storage = false, // 新建佛事时是否已经有localStorage 默认false
    has_tip = false, // 是否有提示离开页面保存
    if_set_printer = false, // 是否设置了打印机
    if_submiting_pic = false, // submit过程是否正在保存图片
    ifSingleMoney; // 选择项中判断是否是单金额，keyup单金额到多金额变化时改变Switch插件的状态，多金额到多金额不改变

  var View = Backbone.View.extend({
    el: 'body',
    locationBc: 0, // 所在机器 0：测试机 1：上线测试机 2：正式机
    sizePostscript: {}, // 保存选择项附言对象     sizeCid 对应 sizeAddition
    prepareRemovePostscript: {}, //删除的选择项附言
    prepareRemovePostscriptId: null, //删除的选择项附言ID
    PicssId: 0, // 封面图片计数
    PicId: 1, // 封面图片计数
    addClassId: null, // 佛事分类Id
    ready_editor: 0, // 已经初始化好的ueditor
    show_printer_id: 0, // 打开model应该展示的打印机
    new_template_name: 0, // 新建佛事模板名称
    show_printer_type: null, // 设置好的打印机对应是否有规格：有规格1，无规格0
    html: $('.upload_wrap').html(), //封面图片div的html
    sizes: null, // 规格modal
    sizesView: null,
    additionItems: null, // 附言modal
    additionView: null,
    sizesAddition: null, // 规格附言modal
    sizesAdditionView: null,
    classification: [], // 佛事分类列表
    events: {
      /**其它**/
      'keyup [data-ele="s-textarea"]': 'onKeyupSTextarea', // 自定义文本框输入
      /**基本项：标题 分类 封面 详情**/
      'show.bs.modal #classificationModal': 'showClassificationModal', // 打开分类列表modal
      'hide.bs.modal #classificationModal': 'hideClassificationModal', // 关闭分类列表modal
      'click .deleteClassificationList': 'deleteClassificationList', // 删除佛事分类列表
      'click .reviseClassificationList': 'reviseClassificationList', // 修改佛事分类列表
      'click #addClassificationList': 'addClassificationList', // 添加佛事分类
      'click #coverPic0': 'uploadCoverPic', // 上传封面图片
      'click .delPic': 'delPic', // 删除封面图片
      'click #myEditor': 'focusMyEditor', // 聚焦myEditor

      /**选择项**/
      'click #generateRandom': 'generateRandom', // 给总的价格生成随机数
      'keyup #suixiInput': 'detectSuixiInput', // 实时检测总的价格输入
      'blur #suixiInput': 'blurSuixiInput', // 检测总的价格输入
      'click #needPay': 'showSuixiInput', // 选择需支付
      'click #noNeedPay': 'hideSuixiInput', // 选择无需支付
      'show.bs.modal #sub-set-modal': 'showSubSetModal', // 打开选择项设置modal
      'click #save-sub-set': 'onClickSaveSubSet', // 点击选择项设置modal保存按钮

      'click #proStyleBtn': 'showSizeBox', // 增加第一个选择项
      'changed.bs.select [name="sizeType"]': 'onChangeSubType', // 改变选择项分类
      'blur #proName': 'proName', // blur标题
      'blur .proSizeName': 'setProValue', // 失去焦点保存库存、价格、是否自动完成订单、名称
      'blur .proPrice': 'setProValue', // 保存库存、价格、是否自动完成订单、名称
      'blur .proStock': 'setProValue', // 保存库存、价格、是否自动完成订单、名称
      'focus .proPrice': 'showRandomPrice', // focus选择项中价格输入
      'mousedown [data-id="generateRandomPrice"]': 'generateRandomPrice', // 给选择项的价格生成随机数
      'mousedown [data-id="autoFinishOrder"]': 'autoFinishOrder', // 点击label设置规格是否自动完成
      'keydown .proPrice': 'changeIfSingleMoney', // 改变单金额标志位
      'keyup .proPrice': 'detectRandom', // 检测当前输入的价格是否需要显示生成随机数按钮
      'focus #suixiInput': 'showSuixiRandomPrice', // focus支付中的价格输入
      'click .smallPicture': 'uploadSmallPic', // 上传选择项图片
      'click .delSmallPic': 'delSmallPic', // 删除选择项图片
      'click .copyProSize': 'copyProSize', // 复制选择项
      'click .removeProSize': 'removeProSize', // 删除选择项

      /**选择项附言**/
      'click #sizesAddAddition': 'sizesAddAddition', // 规格中添加第一个附言
      'click #sizesAddAdditionItem': 'sizesAddAdditionItem', // 规格中添加附言
      'show.bs.modal #sizesPostModal': 'showSizesPostModal', //规格附言打开模态框
      'click #saveSizeInputSetting': 'saveSizeInputSetting', // 保存规格附言文本框设置
      'click #saveSizeDateSetting': 'saveSizeDateSetting', // 保存规格附言日期设置
      'click #saveSizeSelectSetting': 'saveSizeSelectSetting', // 保存规格附言下拉组件设置
      'click #saveSizeInstructSetting': 'saveSizeInstructSetting', // 保存规格附言说明文本设置
      'click #saveSizeImagesSetting': 'saveSizeImagesSetting', // 保存规格附言图片上传设置
      'click #saveSizeRadioSetting': 'saveSizeRadioSetting', // 保存规格radio设置附言
      // 'show.bs.modal #instructionModal': "showInstructionModal",  //规格附言说明打开模态框
      'show.bs.modal #inputSizeAdditionModal': 'showSizeAdditionModal', // 规格中附言文本框设置modal
      'show.bs.modal #dateSizeAdditionModal': 'showSizeAdditionModal', // 规格中附言日期设置modal
      'show.bs.modal #selectSizeAdditionModal': 'showSizeAdditionModal', // 规格中附言下拉设置modal
      'show.bs.modal #instuctSizeAdditionModal': 'showSizeAdditionModal', // 规格中附言说明文本设置modal
      'show.bs.modal #imagesSizeAdditionModal': 'showSizeAdditionModal', // 规格中附言图片上传设置modal
      'show.bs.modal #radioSizeAdditionModal': 'showSizeAdditionModal', // 规格中附言图片上传设置modal
      'click [data-id="closeSizePostscript"]': 'closeSizePostscript', //点击规格附言模态框X按钮
      'click .sizesAdditionRemove': 'sizesAdditionRemove', // 删除选择项附言
      'click .saveAdd': 'saveAddition', // 保存规格的附言
      'blur .sizeAdditionName': 'setSizeAdditionName', // blur保存规格附言标题
      'hide.bs.modal #selectAdditionModal': 'hideselectAdditionModal', // 关闭下拉列表modal
      // 'click [data-type="saveInstruction"]': "saveInstruction",   // 保存规格附言说明
      'click [name="sizeTelVerify"]': 'onClickSizeTelVerify', // 点击是否需要短信验证

      /**附言**/
      'click #addAddition': 'addAddition', // 添加第一个附言
      'click #addAdditionItem': 'addAdditionItem', // 添加附言条目
      'show.bs.modal #inputAdditionModal': 'showInputAdditionModal', // 附言文本框设置modal
      'show.bs.modal #dateAdditionModal': 'showInputAdditionModal', // 附言文本框设置modal
      'show.bs.modal #imagesAdditionModal': 'showInputAdditionModal', // 附言文本框设置modal
      'show.bs.modal #instuctAdditionModal': 'showInputAdditionModal', // 附言文本框设置modal
      'show.bs.modal #selectAdditionModal': 'showInputAdditionModal', // 附言文本框设置modal
      'show.bs.modal #radioAdditionModal': 'showInputAdditionModal', // 附言文本框设置modal
      'click .additionRemove': 'removeAddition', // 删除附言
      'blur .additionName': 'setAdditionName', // blur保存附言标题
      'click #saveInputSetting': 'saveInputSetting', // 保存文本框设置
      'click #saveInstructSetting': 'saveInstructSetting', // 保存附言说明文本设置
      'click #saveImagesSetting': 'saveImagesSetting', // 保存附言图片上传设置
      'click #saveDateSetting': 'saveDateSetting', // 保存日期设置附言
      'click #saveRadioSetting': 'saveRadioSetting', // 保存radio设置附言
      'click #saveSelectSetting': 'saveSelectSetting', // 保存下拉列表附言
      'click [name="telVerify"]': 'onClickTelVerify', // 点击是否需要短信验证

      /*选择项附言 附言 公用*/
      'click [data-ele="recharge-msg-num"]': 'onClickRechargeMsgNum', // 点击手机号码附言 充值短信

      /**其他项： 按钮文字 参与者列表 统计区域 开始时间 结束时间 剩余时间 功德证书 反馈信息**/
      'click [name="if_feedback"]': 'if_feedback', // 开启或关闭反馈类型
      'mouseenter [data-ele="preview-spcl-sub-ps"]': 'enter_spcl_sub_ps', // enter特殊选择项附言
      'mouseleave [data-ele="preview-spcl-sub-ps"]': 'leave_spcl_sub_ps', // leave特殊选择项附言
      'mouseenter [data-type="feedback_item"]': 'enter_get_feedback_item', // enter渲染反馈模板
      'mouseleave [data-type="feedback_item"]': 'leave_get_feedback_item', // leave渲染反馈模板
      'click [data-type="feedback_item"]': 'click_get_feedback_item', // click调整反馈模板状态
      'click [name="summaryArea"]': 'onClickSummaryArea', // 点击统计区域radio
      'click [data-ele="summary-area-type"]': 'onClickSummaryAreaType', // 点击统计样式
      // 'click [data-type="feedback_modal_box_list_attr_item_name"]': 'insert_feedback_modal_item',     // 将反馈动态值插入ueditor

      /**打印机**/
      'changed.bs.select #selectPrinter': 'selectPrinter', // 绑定有规格时切换打印机选择事件
      'click [data-type="no_selection_printer_div"]':
        'selectNoSelectionPrinter', // 绑定无规格时切换打印机选择事件
      'changed.bs.select #printNumber': 'change_print_number', // 改变打印联数事件
      'click [data-type="dimension_code_label"]': 'dimension_code_label', // 改变二维码打印设置
      'click [data-type="print_tel_label"]': 'print_tel_label', // 改变手机打印设置
      'show.bs.modal #setPrintModal': 'setPrintModal', // 小票打印模态框打开事件
      'hide.bs.modal #setPrintModal': 'closeSetPrintModal', // 小票打印模态框关闭事件
      'click [data-type="surePrint"]': 'surePrint', // 确认保存小票打印设置
      'click .print_label': 'print_switch', // 切换是否开启打印机
      'click [data-type="selection_checkbox"]': 'selection_checkbox', // 小票打印有规格项时其中规格项选择事件
      /**保存**/
      'click #submit': 'submit', // 上传按钮
      'click #closeNotSetPrinterModal': 'showSetPrinterModal', // 未设置打印机时弹出的模态框点击按钮
      'click #skip-set-printer-and-save': 'skipSetPrinterAndSave', // 跳过设置打印机并保存
      'hide.bs.modal #notSetPrinterModal': 'hideNotSetPrinterModal', // 隐藏未设置小票打印机时的阻拦框时，将其是否为第一次保存设置为false
      'click #set_template': 'set_template', // 设为模板
      'click #save-draft': 'save_draft', // 存为草稿
      'click [data-type="confirm_template"]': 'confirm_template', // 保存template_modal
      'click [data-type="cancel_template"]': 'cancel_template', // 取消template_modal
      'click #cancel': 'cancel', // 点击取消按钮
      'hide.bs.modal #addCalendarModal': 'closeAddCalendarModal', // 关闭添加佛历modal
      'click [data-action="close"][data-type="promotion"]':
        'onClickClosePromotion', //点击关闭保存状态模态框
      'click #sureCalendar': 'sureCalendar', // 保存佛历提醒时间,

      /*工具类函数*/
    },
    /**其它**/
    // 自定义文本框输入文本
    onKeyupSTextarea: function(e) {
      var $curTar = $(e.currentTarget),
        $numTip = $curTar.next(),
        textLen = $curTar.val().length,
        maxLen = $curTar.prop('maxlength');
      $numTip.html(textLen + '/' + maxLen);
    },

    /**基本项：标题 分类 封面 详情**/
    // 打开分类列表modal
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
    // 关闭分类列表modal
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
        // 多选框配置 - 初始化
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
    // 删除佛事分类
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
    // 修改佛事分类
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
    // 添加佛事分类
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
            }); // 给修改分类的值添加ID
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
    // 上传封面图片
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
          // self.afterAddUploadFilesForPersonSaying(data);
        },
      });
      upload.show();
    },
    // 删除封面图片
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
    // 聚焦myEditor
    focusMyEditor: function(e) {
      $('#myEditor').focus();
    },

    /**选择项**/
    // 给总的价格生成随机数
    generateRandom: function(e) {
      var $tar = $(e.target);
      e.preventDefault();
      var randomList =
        '5,5,5,5.55,5.88,6,6,6.66,6.68,6.88,7.77,8,8.88,9.66,9.99,10,10,10,10,10.01,10.88,11.11,13.14,13.88,15.68,16,16.66,16.88,18,18.18,18.88,19.19,19.88,20,20,20,20.66,22,22.22,25.55,26.66,26.88,28,28.88,33.33,36,38.88,46.66,49.99,50,66.66,68.68,88.88,99.99,100,108,168';
      $('#suixiInput').val(randomList);
      $tar.addClass('hide');
      // 初始化插件
      $('#autoFinishSwitch').bootstrapSwitch({
        size: 'mini',
        onText: '开',
        offText: '关',
        onColor: 'primary',
        offColor: 'info',
        state: true,
        onSwitchChange: function() {},
      });
      // 只要点击了随机按钮就设置Switch为开
      $('#autoFinishSwitch').bootstrapSwitch('state', true);
      $tar.next().removeClass('hide');
    },
    // 实时检测总的价格输入
    detectSuixiInput: function(e) {
      var $tar = $(e.target);
      var get_val = $tar.val();
      // $tar.val(get_val.replace(/[^\d\,\，\.]/g,''));
      var showRandom =
        get_val.toString().indexOf(',') + get_val.toString().indexOf('，');
      if (showRandom > -2) {
        // 多金额
        $tar.next().addClass('hide');
        // 初始化Switch插件，只在不存在时初始化
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
        // 单金额
        $tar.next().removeClass('hide');
        $tar
          .next()
          .next()
          .addClass('hide');
        // 销毁Switch
        $('#autoFinishSwitch').bootstrapSwitch('destroy');
      }
    },
    // 失去焦点时，检测总的价格输入
    blurSuixiInput: function(e) {
      var self = this;
      var $tar = $(e.target),
        get_val = $tar.val();
      // 检验价格格式是否正确
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
    // 选择需支付
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
    // 选择无需支付
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
    // 打开选择项设置modal
    showSubSetModal: function(e) {
      var $relatedTarget = $(e.relatedTarget),
        $tar = $(e.target),
        $subEndTime = $('#sub-end-time'),
        $subSetModal = $('#sub-set-modal');
      // 时间选择插件input blur 时 会触发此modal展示函数 莫名奇怪的bug
      if ($tar.get(0) === $subEndTime.get(0)) {
        return;
      }
      var self = this,
        cid = $relatedTarget.attr('data-cid'), // 获取选择项cid
        curSubModal = self.sizes.get(cid),
        $saveSubSet = $('#save-sub-set'),
        $subSetModalTitle = $('#sub-set-modal-title'),
        name = curSubModal.get('name'),
        endTime = curSubModal.get('endTime'),
        enrollNum = curSubModal.get('enroll_num'),
        subType = curSubModal.get('subdivide_type');
      // 保存cid
      $saveSubSet.attr('data-cid', cid);
      // 设置modal标题
      $subSetModalTitle.text('选择项设置：' + name);
      // 渲染到期时间
      $subEndTime.val(endTime);
      // 渲染参与限制
      $('[name="sub-enroll-limit"][value="' + enrollNum + '"]').prop(
        'checked',
        true
      );

      // 时效佛事 展示时长
      var $timeDurationFormGroup = $('#sub-time-duration-form-group');
      var $timeDurationNum = $('#sub-time-duration-num');
      var $timeDurationUnit = $('#sub-time-duration-unit');
      var timeDurationNum = curSubModal.get('占位符');
      var timeDurationUnit = curSubModal.get('占位符');
      if (subType == 5) {
        $timeDurationFormGroup.show();
        $timeDurationNum.val(timeDurationNum);
        $timeDurationUnit.selectpicker('val', timeDurationUnit);
      } else {
        $timeDurationFormGroup.hide();
        $timeDurationNum.val('');
        $timeDurationUnit.selectpicker('val', 'day');
      }
    },
    // 点击选择项设置modal保存按钮
    onClickSaveSubSet: function(e) {
      var $tar = $(e.target),
        $modal = $('#sub-set-modal'),
        self = this,
        cid = $tar.attr('data-cid'), // 获取选择项cid
        curSubModal = self.sizes.get(cid),
        subType = curSubModal.get('subdivide_type'),
        verifyObj = {
          value: true,
          reason: '',
        };

      var $endTime = $('#sub-end-time'),
        endTime = $endTime.val();

      var enrollNum = parseInt($('[name="sub-enroll-limit"]:checked').val());

      var timeDurationNum = $('#sub-time-duration-num').val();
      var timeDurationUnit = $('#sub-time-duration-unit').val();

      // 数据校验
      if (subType === 5) {
        // 时效佛事
        if (timeDurationUnit == 'day') {
          // 1 - 30
          if (timeDurationNum < 1 || timeDurationNum > 30) {
            verifyObj.value = false;
            verifyObj.reason = '天数应为1-30';
          }
        } else if (timeDurationUnit == 'month') {
          // 1 - 12
          if (timeDurationNum < 1 || timeDurationNum > 12) {
            verifyObj.value = false;
            verifyObj.reason = '月份应为1-12';
          }
        } else if (timeDurationUnit == 'year') {
          // 1 - 20
          if (timeDurationNum < 1 || timeDurationNum > 20) {
            verifyObj.value = false;
            verifyObj.reason = '年份应为1-20';
          }
        }
      }

      if (verifyObj.value) {
        curSubModal.set('endTime', endTime);
        curSubModal.set('enroll_num', enrollNum);
        curSubModal.set('占位符', timeDurationNum);
        curSubModal.set('占位符', timeDurationUnit);
        $modal.modal('hide');
      } else {
        Toast(verifyObj.reason, 2);
      }
    },
    // 增加第一个选择项,   !!!此函数在渲染表格函数里分情况被触发了既页面初始化时触发了，通过主动触发proStyleBtn的click事件
    showSizeBox: function(e) {
      // console.log("触发box重绘")
      // console.log(this.sizes);
      // debugger

      var self = this;
      e.preventDefault();
      var sizeBox = $('#proStyle').parents('.form-group'), // 展示选择项的父容器
        addBox = $('#proStyleBtn')
          .parents('div')
          .prev()[0]; // 选择项按钮左侧label
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
        // console.log(self.sizes)
        self.sizes.add(new SizeModel({}));
        self.sizesView.render();
        // console.log(self.sizes)
      }
      self.selection_change_printer_text(1);
    },
    // 改变选择项分类
    onChangeSubType: function(e) {
      // debugger
      var self = this,
        $tar = $(e.target),
        subType = $tar.val();
      e.preventDefault();

      // console.log(subType);
    },
    // blur标题
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
    // 保存库存、价格、名称
    setProValue: function(e) {
      var self = this,
        $tar = $(e.target),
        value = $tar.val(),
        cid = $tar.attr('data-cid');

      if ($tar.hasClass('proSizeName')) {
        // 选择项
        if (value != '') {
          $tar.parents('.ui-state-default').removeClass('has-error');
        } else {
          $tar.parents('.ui-state-default').addClass('has-error');
        }
        self.sizes.get(cid).set('name', value);
      } else if ($tar.hasClass('proPrice')) {
        // 价格
        var isAutoFinish = $tar.attr('data-isAutoFinish');
        self.sizes.get(cid).set('price', value); // 保存价格
        $tar.prev().addClass('hide');
        // $tar.prev().prev().addClass("hide");
        // self.sizes.get(cid).set("isAutoFinish", 0);
        // 验证价格格式
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
              // 单金额
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
        // 库存
        self.sizes.get(cid).set('stock', value);
      }
    },
    // focus选择项中价格输入聚焦
    showRandomPrice: function(e) {
      var $tar = $(e.target),
        inputValue = $tar.val().toString();
      e.preventDefault();
      var ifHide = inputValue.indexOf(',') + inputValue.indexOf('，');
      if (ifHide > -2) {
        // 输入了多个金额,显示自动完成
        $tar
          .prev()
          .prev()
          .removeClass('hide');
        $tar.prev().addClass('hide');
        // console.log('多金额')
      } else {
        // 小于等于-2表示不存在','为输入了一个金额，显示生成随喜金额
        $tar.prev().removeClass('hide');
        $tar
          .prev()
          .prev()
          .addClass('hide');
        // console.log('单一金额')
      }
    },
    // 给规格的价格生成随机数
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
      self.sizes.get(cid).set('isSingleMoney', 0); // 修改单多金额标志位，触发重绘
      // debugger
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
        var top = 0; // $(".upload_wrap").find(".upload_box").last().position().top +
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
    // 自动处理规格订单的label，触发相应的bootstrap-switch开关的toggle事件
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
    // 检测单金额标志位
    changeIfSingleMoney: function(e) {
      var self = this,
        $tar = $(e.target);
      var get_val = $tar.val();
      var showRandom =
        get_val.toString().indexOf(',') + get_val.toString().indexOf('，');
      if (showRandom > -2) {
        // 按前多金额
        ifSingleMoney = !1;
      } else {
        // 按前单金额
        ifSingleMoney = !0;
      }
    },
    // 检测当前输入的价格是否需要显示生成随机数按钮,无价格时显示随机数且将自动完成数据置为0，多个价格时显示自动完成订单按钮
    detectRandom: function(e) {
      var self = this,
        $tar = $(e.target);
      var get_val = $tar.val();
      var cid = $tar.attr('data-cid');
      // $tar.val(get_val.replace(/[^\d\,\，\.]/g,''));
      var showRandom =
        get_val.toString().indexOf(',') + get_val.toString().indexOf('，');
      self.sizes.get(cid).set('price', get_val);
      if (showRandom > -2) {
        // 多金额显示订单自动处理，
        $tar.prev().addClass('hide');
        $tar
          .prev()
          .prev()
          .removeClass('hide');
        if (ifSingleMoney) {
          // 单金额到多金额，将自动完成订单设置初始化为1
          $tar
            .prev()
            .prev()
            .find('.autoFinishSwitch')
            .bootstrapSwitch('state', true);
        }
        // self.sizes.get(cid).set("isSingleMoney", 0); // 不能设置，会导致重绘
        // 不能设置isAutoFinish触发重绘，会导致input失去焦点
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
        // 单金额显示随机生成金额，并将自动完成订单设置为0
        $tar.prev().removeClass('hide');
        $tar
          .prev()
          .prev()
          .addClass('hide');
        // self.sizes.get(cid).set("isSingleMoney", 1); // 不能设置，会导致重绘
        self.sizes.get(cid).set('isAutoFinish', 0);
      }
    },
    // focus支付中的价格输入
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
    // 上传选择项图片
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
    // 删除规格中图片
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
    // 复制选择项
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
        var currentPostscript = self.sizes
          .get(cid)
          .attributes.postScript.clone();
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
    // 删除选择项
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
                  var sizeBox = $('#proStyle').parents('.form-group'); // 选择项的外层容器
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
                // 删除前当前是最后一项，就要显隐相关控件
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

    /**选择项附言**/
    // 规格中添加第一个附言
    sizesAddAddition: function(e) {
      var self = this;
      e.preventDefault();

      // 获取当前选择项的subType 添加到子项model中去
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
    // 规格中添加附言
    sizesAddAdditionItem: function(e) {
      var self = this;
      e.preventDefault();

      // 获取当前选择项的subType 添加到子项model中去
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
    // 规格中附言模态框
    showSizesPostModal: function(e) {
      var $relatedTarget = $(e.relatedTarget), //获取规格附言数据
        self = this,
        cid = $relatedTarget.attr('data-cid'); // 获取选择项cid
      $('.proSizeName').blur();
      if (typeof cid == 'string' && cid.length > 0) {
        var model = self.sizes.get(cid),
          name = model.get('name');
        $('#sizesPostModal').attr('data-sub-cid', cid); // 将外层的sub cid保存至sub ps modal上 供内层查询外层数据使用
        $('#sizeName').text(
          '选择项：' + name + ' (假如需要用户下单时填写信息，请在此处添加)'
        );
        // 由于外层的sub-select会改变self.sizes的附言内容 因此每次打开时重新赋值self.sizePostscript
        if (self.sizes.get(cid).get('postScript')) {
          // 排除普通选择项 无默认附言
          self.sizePostscript[cid] = self.sizes.get(cid).get('postScript');
          var sizesPostScript = self.sizePostscript[cid];
          // console.log(self.sizes);
          // console.log(self.sizePostscript);
          // console.log(sizesPostScript); // 一个models集合对象
        }

        // if(self.sizePostscript[cid]){
        //     var sizesPostScript = self.sizePostscript[cid];
        // }

        $('.saveAdd').attr('data-cid', cid);
        if (sizesPostScript) {
          // 有选择项
          var getSizesAddition = sizesPostScript,
            getSizesAdditionModels = getSizesAddition.models,
            getSizesAdditionModelsLen = getSizesAdditionModels.length;
          // 以下代码存在会导致 在新建普通选择项时 默认普通 切换为 祈福 再切换为 往生 其长度为正确添加 仅仅为 2 正确为 4 sizeView中的change改写的数据是正确的
          // 长度为2 且保存的id 中不正确 导致不能使用 model.get() 可以使用遍历获取
          // 遍历models  克隆每个model产生新的cid 弹出旧的model 推入新的model 返回结果为旧model倒序且拥有全新的cid
          // for(var i=0;i<getSizesAdditionModelsLen;i++){
          //     var postCid = getSizesAdditionModels[0]["cid"],
          //         getPostscriptModel = null;
          //     getPostscriptModel = getSizesAddition.get(postCid);
          //     var newPostScriptModel = getPostscriptModel.clone();
          //     getSizesAddition.shift(postCid);
          //     getSizesAddition.push(newPostScriptModel);
          // }
          // console.log(sizesPostScript);
          // console.log(getSizesAddition);
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
          // 无选择项
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
    // 保存规格文本框附言
    saveSizeInputSetting: function(e) {
      var self = this,
        $tar = $(e.target),
        cid = $tar.attr('data-cid'),
        subCid = $('#sizesPostModal').attr('data-sub-cid');
      if (typeof cid == 'string' && cid.length > 0) {
        // 文本框类附言默认均设置 是否必填 示例文字
        var subModel = self.sizes.get(subCid),
          subType = subModel.get('subdivide_type'),
          model = self.sizesAddition.get(cid),
          inputType = model.get('inputType'),
          isMust = parseInt($('input[name=inputSizeRequire]:checked').val()),
          placeholder = $('#inputSizePlaceholder').val(),
          describtion = $('#inputSizeDescribtion').val();

        // 手机号码 是否验证字段
        if (inputType == 5) {
          var isVerify = parseInt($('input[name=sizeTelVerify]:checked').val());
          model.set('isVerify', isVerify);
        } else {
          model.set('isVerify', 0);
        }

        // 名字个数
        if (
          (subType == 2 && inputType == 11) ||
          (subType == 3 && inputType == 12)
        ) {
          var maxNameNum = parseInt($('#sizesInputMaxNameNum').val());
          model.set('pic_num', maxNameNum);
        }

        // 姓名字数
        if (
          (subType == 2 && (inputType == 10 || inputType == 11)) ||
          (subType == 3 && inputType == 12)
        ) {
          var nameWordLimit = parseInt($('#sizesInputNameWordLimit').val());
          model.set('font_length', nameWordLimit);
        }

        // 祈福心愿字数
        if (subType == 3 && inputType == 15) {
          var qiFuWishWordLimit = parseInt(
            $('#sizesInputQiFuWishWordLimit').val()
          );
          model.set('font_length', qiFuWishWordLimit);
        }

        // 非祈福心愿字数
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
    // 保存规格日期附言
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
    // 保存规格下拉列表附言
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
    // 保存规格附言说明文本设置
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
    // 保存规格附言图片上传设置
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
    // 保存规格radio设置附言
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
    //规格附言说明打开模态框
    /*showInstructionModal: function(e){
            var $relatedTarget = $(e.relatedTarget),      //获取规格附言数据
                self = this,
                cid = $relatedTarget.attr("data-cid"),
                model = self.sizes.get(cid),
                name = model.get("name");
            $("#sizeName2").text(name+"附言文本说明");
            $('[data-type="saveInstruction"]').attr('data-cid', cid);
            if (typeof cid == "string" && cid.length > 0) {
                var model = self.sizes.get(cid),
                    instruction = model.get("explain");
                $('#sizeInstruction').val(instruction);
            }
        },*/
    // 规格附言设置展开模态框
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
          picNum = model.get('pic_num'), // 最大上传数
          font_length = model.get('font_length'), // 心愿的字数限制字段
          isVerify = model.get('isVerify'), // 5 手机号码附言 是否短信验证字段
          cur_addition_name = config.argument.addition_list[inputType];
        cur_title.text(cur_addition_name + '设置');
        $('#saveSizeInputSetting').attr('data-cid', cid);
        $('#saveSizeDateSetting').attr('data-cid', cid);
        $('#saveSizeSelectSetting').attr('data-cid', cid);
        $('#saveSizeInstructSetting').attr('data-cid', cid);
        $('#saveSizeImagesSetting').attr('data-cid', cid);
        $('#saveSizeRadioSetting').attr('data-cid', cid);
        // 设置必填项
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

        // 设置日期选择范围
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
        // 设置下拉列表单多选
        if (inputType == 3) {
          if (dataType == 0) {
            $('#singleSizeSelect').prop('checked', true);
          } else {
            $('#multiSizeSelect').prop('checked', true);
          }
        }
        // 设置手机号码附言 的 是否验证短信
        if (inputType == 5) {
          $('[name="sizeTelVerify"][value="' + isVerify + '"]').prop(
            'checked',
            true
          );
          $('[data-ele="size-tel-verify-form-group"]').removeClass('hide');
          // 初始化 短信剩余量 文案
          var isSubPs = 1;
          self.initTelPsVerifyMsg(isSubPs, isVerify);
        } else {
          $('[name="sizeTelVerify"][value="' + 0 + '"]').prop('checked', true);
          $('[data-ele="size-tel-verify-form-group"]').addClass('hide');
          $('#size-input-required-form-group').show();
        }
        // 设置示例文字
        if (typeof placeholder == 'string' && placeholder.length > 0) {
          $('#inputSizePlaceholder').val(placeholder);
        } else {
          $('#inputSizePlaceholder').val('');
        }
        // 设置描述
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
        // 设置文本说明
        if (inputType == 13) {
          $('#sizeInstruction').val(placeholder);
        }
        // 设置图片上传
        if (inputType == 14) {
          $('#inputImagesSizeUploadNum').val(picNum);
        }
        // 设置下拉菜单文字
        if (typeof selectInput == 'object' && selectInput.length > 0) {
          var my_input = '';
          for (var i = 0; i < selectInput.length; i++) {
            my_input += selectInput[i] + '\n';
          }
          $('#selectSizeTextarea').val(my_input);
        } else {
          $('#selectSizeTextarea').val('');
        }

        // 单选类选择项附言设置 inputType 1 4 5 6 7 10 11 12 15
        // 普通(1):  心愿15 必填 填写字数 示例文字
        // 往生类(2)：阳上人10：姓名字数 示例文字                   往生者11： 名字个数 姓名字数 示例文字
        // 祈福类(3)：功德芳名12：名字个数 姓名字数 示例文字         心愿15：必填 心愿字数 示例文字

        // 控制必填项的隐藏 1 4 5 6 7 10 11 12 15 排除往生2(10 11) 3(12)
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

        // 控制名字个数的显隐 往生往生2-11 祈福功德芳名3-12
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

        // 控制姓名字数的显隐 2-10 2-11 3-12
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
        // 控制祈福心愿字数的显隐
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
        // 控制非祈福心愿的心愿字数显隐
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
    //点击规格附言模态框X按钮
    closeSizePostscript: function(e) {
      var self = this;
      if (self.prepareRemovePostscriptId != '') {
        self.sizePostscript[self.prepareRemovePostscriptId] =
          self.prepareRemovePostscript;
      }
    },
    // 删除规格附言
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
                  // self.sizesAddition.add(new sizesAdditionModel({}));
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
    // 保存规格的附言
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
    // blur保存规格附言标题
    setSizeAdditionName: function(e) {
      var self = this,
        $tar = $(e.target),
        value = $tar.val(),
        cid = $tar.attr('data-cid');
      self.sizesAddition.get(cid).set('name', value);
      self.sizesAdditionView.render();
    },
    // 关闭下拉列表modal
    hideselectAdditionModal: function(e) {
      $('#selectTextarea').val('');
    },
    // 保存规格附言说明
    /*saveInstruction: function (e) {
            var self = this,
                $tar = $(e.target),
                cid = $tar.attr("data-cid"),
                getSizeInstruction = $('#sizeInstruction').val(),
                model = self.sizes.get(cid);
            model.set("explain", getSizeInstruction);
            $('#instructionModal').modal('hide');
        },*/
    // 点击是否需要短信验证
    onClickSizeTelVerify: function(e) {
      var $checkedRadio = $('[name="sizeTelVerify"]:checked');
      var self = this,
        isSubPs = 1,
        isVerify = parseInt($checkedRadio.val());
      self.initTelPsVerifyMsg(isSubPs, isVerify);
    },

    /**附言**/
    // 添加第一个附言
    addAddition: function(e) {
      var self = this;
      e.preventDefault();
      // self.additionItems.add(new AdditionModel({}));
      self.additionView.render();
      $('#additionTable,#addAdditionItem')
        .parents('.form-group')
        .removeClass('hide');
      $('#addAddition')
        .parents('.form-group')
        .addClass('hide');
    },
    // 添加附言条目
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
    // 附言文本框设置modal
    showInputAdditionModal: function(e) {
      var $relatedTarget = $(e.relatedTarget),
        $tar = $(e.target),
        self = this,
        cid = $relatedTarget.attr('data-cid'),
        cur_title = $tar.find('.modal-title');
      // console.log(self.additionItems.get(cid));
      // console.log(self.additionItems.get(cid).get('inputType'));

      // debugger
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
          // 在此添加心愿的字数限制字段
          font_length = model.get('font_length'),
          cur_addition_name = config.argument.addition_list[inputType];
        cur_title.text(cur_addition_name + '设置');
        $('#saveInputSetting').attr('data-cid', cid);
        $('#saveDateSetting').attr('data-cid', cid);
        $('#saveSelectSetting').attr('data-cid', cid);
        $('#saveInstructSetting').attr('data-cid', cid);
        $('#saveImagesSetting').attr('data-cid', cid);
        $('#saveRadioSetting').attr('data-cid', cid);
        // 公用类：必填项
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
        // 公用类：示例文字
        if (typeof placeholder == 'string' && placeholder.length > 0) {
          $('#inputPlaceholder').val(placeholder);
        } else {
          $('#inputPlaceholder').val('');
        }
        // 公用类：描述
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
        // 短信验证
        if (inputType == 5) {
          $('[name="telVerify"][value="' + isVerify + '"]').prop(
            'checked',
            true
          );
          $('[data-ele="tel-verify-form-group"]').removeClass('hide');
          // 初始化 短信剩余量 文案
          var isSubPs = 0;
          self.initTelPsVerifyMsg(isSubPs, isVerify);
        } else {
          $('[name="telVerify"][value="' + 0 + '"]').prop('checked', true);
          $('[data-ele="tel-verify-form-group"]').addClass('hide');
          $('#input-required-form-group').show();
        }
        // 设置日期选择范围
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
        // 设置下拉列表单多选
        if (inputType == 3) {
          if (dataType == 0) {
            $('#singleSelect').prop('checked', true);
          } else {
            $('#multiSelect').prop('checked', true);
          }
        }
        // 设置文本说明
        if (inputType == 13) {
          $('#instruction').val(placeholder);
        }
        // 设置图片上传
        if (inputType == 14) {
          $('#inputImagesUploadNum').val(picNum);
        }
        // 设置下拉菜单文字
        if (typeof selectInput == 'object' && selectInput.length > 0) {
          var my_input = '';
          for (var i = 0; i < selectInput.length; i++) {
            my_input += selectInput[i] + '\n';
          }
          $('#selectTextarea').val(my_input);
        }
        // 设置心愿菜单的字数限制
        if (inputType == 15) {
          if (font_length) {
            $('#wishWordLimit').val(font_length);
          } else {
            $('#wishWordLimit').val('');
          }
          // 此处将服务器的数据写进字数限制
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
    // 删除附言
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
    // blur保存附言标题
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
    // 保存文本框设置
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
        // 心愿附言 获取字数限制
        if (inputType == 15) {
          var font_length = parseInt($('#wishWordLimit').val());
          if (isNaN(font_length)) {
            font_length = 0;
          }
          model.set('font_length', font_length);
        } else {
          // 非心愿则传0
          model.set('font_length', 0);
        }
        // 手机号码附言 获取是否验证短信
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
    // 保存附言说明文本设置
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
    // 保存附言图片上传设置
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
    // 保存日期附言
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
    // 保存radio设置附言
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
    // 保存下拉列表附言
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
    // 点击是否需要短信验证
    onClickTelVerify: function(e) {
      var $checkedRadio = $('[name="telVerify"]:checked');
      var self = this,
        isSubPs = 0,
        isVerify = parseInt($checkedRadio.val());
      self.initTelPsVerifyMsg(isSubPs, isVerify);
    },

    /*选择项附言 附言 公用*/
    // 点击手机号码附言 充值短信
    onClickRechargeMsgNum: function(e) {
      window.open('/zzhadmin/volunteer_sendSMS_index/', '_blank');
    },

    /**其他项： 按钮文字 参与者列表 统计区域 开始时间 结束时间 剩余时间 功德证书 反馈信息**/
    // 开启或关闭反馈类型
    if_feedback: function(e) {
      var $tar = $(e.target),
        cur_id = $tar.attr('id'),
        ue2 = UE.getEditor('myEditor2');
      if (cur_id === 'open_feedback') {
        $('#myEditor2').removeClass('hide');
        ue2.ready(function() {
          ue2.setContent(config.template.component.pay_succ_details, false);
        });
      } else {
        $('#myEditor2').addClass('hide');
      }
    },
    // enter特殊选择项附言
    enter_spcl_sub_ps: function(e) {
      var $tar = $(e.target);
      var curIndex = $tar.attr('data-index'),
        curImg = $tar.attr('data-src');
      // 已经存在时，直接获取并显示，stop为防止快速移入的防抖
      var $container = $(
        '[data-ele="spcl-sub-ps-overview-modal-' + curIndex + '"]'
      );
      if (!!$container.length) {
        $container.stop(true).fadeIn();
        return !1;
      }
      // 不存在时，生成新元素，插入并显示
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
    // leave特殊选择项附言
    leave_spcl_sub_ps: function(e) {
      var $tar = $(e.target);
      var curIndex = $tar.attr('data-index');
      $('[data-ele="spcl-sub-ps-overview-modal-' + curIndex + '"]')
        .stop(true)
        .fadeOut();
    },
    // enter渲染反馈模板
    enter_get_feedback_item: function(e) {
      var $tar = $(e.target);
      // 如果事件对象是img就找到其父元素
      if (!$tar.is('div')) $tar = $tar.parent();
      var cur_index = $tar.attr('data-index'),
        cur_img = $tar.attr('data-src');
      if (cur_index == '0') return false;
      // 已经存在时，直接获取并显示，stop为防止快速移入的防抖
      var $container = $(
        '[data-role="gongde_overview_modal_' + cur_index + '"]'
      );
      if (!!$container.length) {
        $container.stop(true).fadeIn();
        return !1;
      }
      // 不存在时，生成新元素，插入并显示
      var $container = $(
        juicer(config.template.component.gongdeOverview).render({
          src: cur_img,
          index: cur_index,
        })
      );
      $container
        .appendTo('body')
        .stop(true)
        .fadeIn();
    },
    // leave渲染反馈模板
    leave_get_feedback_item: function(e) {
      var $tar = $(e.target);
      if (!$tar.is('div')) $tar = $tar.parent();
      var cur_index = $tar.attr('data-index');
      if (cur_index == '0') return false;
      if (!$tar.is('div')) $tar = $tar.parent();
      var cur_index = $tar.attr('data-index');
      $('[data-role="gongde_overview_modal_' + cur_index + '"]')
        .stop(true)
        .fadeOut();
    },
    // click调整反馈模板状态
    click_get_feedback_item: function(e) {
      var $tar = $(e.target);
      if (!$tar.is('div')) $tar = $tar.parent();
      if ($tar.hasClass('selected_feedback_item')) {
        $tar.removeClass('selected_feedback_item');
        $tar.find('.show_selected').remove();
      } else {
        $('#feedback_box')
          .find('.feedback_modal_box_list_item')
          .not($tar)
          .removeClass('selected_feedback_item')
          .find('.show_selected')
          .remove();
        $tar.addClass('selected_feedback_item');
        var selected_img = document.createElement('img');
        $(selected_img)
          .attr({
            src:
              'https://pic.zizaihome.com/10b73976-23a2-11e9-88db-00163e0c001e.png',
          })
          .addClass('show_selected');
        $tar.prepend(selected_img);
      }
    },
    // 点击统计区域radio
    onClickSummaryArea: function(e) {
      var $curTar = $(e.currentTarget),
        value = parseInt($curTar.val(), 10); // 0 不显示 1 显示
      // 统计区域
      var $summaryAreaTypeContainer = $(
          '[data-ele="summary-area-type-container"]'
        ),
        $summaryAreaType = $('[data-ele="summary-area-type"]'),
        $summaryAreaType1 = $('[data-ele="summary-area-type"][data-type="1"]'),
        $summaryAreaSet = $('[data-ele="summary-area-set"]'),
        $summaryAreaSet2 = $('[data-ele="summary-area-set"][data-type="2"]'),
        $targetAmount = $('#target-amount');
      if (value) {
        // 显示 默认普通样式
        $summaryAreaTypeContainer.show();
        $summaryAreaType.removeClass('active');
        $summaryAreaType1.addClass('active');
        $summaryAreaSet2.hide();
      } else {
        // 不显示
        $summaryAreaTypeContainer.hide();
      }
    },
    // 点击统计样式
    onClickSummaryAreaType: function(e) {
      var $curTar = $(e.currentTarget),
        type = parseInt($curTar.attr('data-type'), 10); // 1 普通样式 2 众筹样式
      // 统计区域
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
        // 众筹样式
        $targetAmount.val('');
        $summaryAreaSet2.show();
      } else {
        $summaryAreaSet2.hide();
      }
    },
    // 将反馈动态值插入ueditor
    /*insert_feedback_modal_item: function (e) {
                    var $tar = $(e.target),
                        cur_typeId = $tar.attr('data-typeId'),
                        modal_html = '',
                        ue2 = UE.getEditor('myEditor2');
                    switch (cur_typeId){
                        case "1":
                            modal_html = '<span class="dynamic_attribute" data-type="feedback_modal_item_buddhist_name" style="padding:0;margin:0;font-size: 1em;line-height: 22px;">佛事名称</span>';
                            break;
                        case "2":
                            modal_html = '<span class="dynamic_attribute" data-type="feedback_modal_item_temple_name" style="padding:0;margin:0;font-size: 1em;line-height: 22px;">寺院名称</span>';
                            break;
                        case "3":
                            modal_html = '<span class="dynamic_attribute" data-type="feedback_modal_item_pay_time" style="padding:0;margin:0;font-size: 1em;line-height: 22px;">支付时间</span>';
                            break;
                        case "4":
                            modal_html = '<span class="dynamic_attribute" data-type="feedback_modal_item_pay_amount" style="padding:0;margin:0;font-size: 1em;line-height: 22px;">支付金额</span>';
                            break;
                        case "5":
                            modal_html = '<span class="dynamic_attribute" data-type="feedback_modal_item_merit_name" style="padding:0;margin:0;font-size: 1em;line-height: 22px;">功德姓名</span>';
                            break;
                        default:
                            break;
                    }
                    var modal_dom = $(modal_html).prop('outerHTML');
                    ue2.execCommand( 'inserthtml', modal_dom)
                },*/

    /**打印机**/
    // 绑定有规格时切换打印机选择事件
    selectPrinter: function(e) {
      var self = this,
        $tar = $(e.target),
        opt = {},
        getVal = $tar.val(),
        get_printer_list = printer_list;
      /*先恢复选项成默认数据*/
      $('#seletionItemList')
        .find('input')
        .removeAttr('checked');
      $('#printNumber')
        .val(1)
        .selectpicker('refresh');
      $('#print_all').prop('checked', 'checked');
      /*先恢复选项成默认数据*/
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
        /*获取打印机状态结束*/
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
            // 渲染二维码打印设置
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
            // 渲染电话打印设置
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
    // 绑定无规格时切换打印机选择事件
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
    // 改变打印联数事件
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
    // 改变二维码打印设置
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
            cur_ercode = parseInt($('[name="print_method"]:checked').val()); //  获取打印二维码参数
            ele['qrcodePrint'][subIndex] = cur_ercode;
          });
        }
      });
    },
    // 改变手机打印设置
    print_tel_label: function(e) {
      var self = this,
        $tar = $(e.target),
        cur_printer = $('#selectPrinter').val();
      $.each(printer_list, function(index, ele) {
        if (parseInt(cur_printer) === ele['id']) {
          $.each(ele['isPrintMobile'], function(subIndex, subEle) {
            var mobile_print = '';
            mobile_print = parseInt(
              $('[name="print_tel_method"]:checked').val()
            ); //  获取打印手机号码参数
            ele['isPrintMobile'][subIndex] = mobile_print;
          });
        }
      });
    },
    // 小票打印模态框打开事件
    setPrintModal: function(e) {
      var self = this,
        // 新建页面的选择项，用来控制小票打印机展示内容
        ifHasSelectItem = !$('#proStyle')
          .parents('.form-group')
          .hasClass('hide');
      // 初始化打印联数选择
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
      // 获取打印机列表
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
      // 如果打印机数量为空，弹出购买打印机modal并返回
      if (printerList.length == 0) {
        $('#noPrinterModal').modal('show');
        return false;
      }
      // 编辑、复制、我的佛事模板第一次进入或者有本地缓存第一次进入
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
                /* 判断是否已经存在打印机ID */
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
      // 如果有规格
      if (ifHasSelectItem) {
        /*深复制对象，解决直接关闭会保存问题，会回到上一次状态*/
        printer_list = myTool.deepCopy(origin_printer_list);
        if (typeof printer_list == 'undefined') {
          printer_list = [];
        }
        /*解决直接关闭会保存问题，会回到上一次状态*/

        // 如果存有原始打印机设置数据就不更新打印机列表
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
          /*有规格时渲染打印机信息*/
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
                /*列出编辑或复制情况之前保存的打印机*/
                for (var j = 0; j < printer_list.length; j++) {
                  if (printer_list[j]['id'] == printer_object['id']) {
                    if_new_printer = false;
                    break;
                    /*如果之前保存的已经有当前打印机信息不做操作,跳出for循环*/
                  }
                }
                if (if_new_printer) {
                  /*如果没有就在该列表后追加新的打印机*/
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
          /*有规格时渲染打印机信息结束*/
        }

        /*渲染选择项列表开始*/
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
        /*渲染选择项列表结束*/

        /*设置模块显示隐藏*/
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
        /*设置模块显示隐藏结束*/
        // 切换到之前设置的第一个打印机
        self.show_printer_id &&
          $('#selectPrinter')
            .val(self.show_printer_id)
            .selectpicker('refresh')
            .trigger('change');
      } else {
        //无选择项情况
        var print_list_json = {},
          print_list_arr = [],
          template = juicer(config.template.component.print_list);
        $('[data-type="seletionItemList"]')
          .eq(0)
          .html(''); // 清空有选择项时的列表
        $.each(printerList, function(index, ele) {
          var print_list_object = {};
          print_list_object['id'] = ele.id;
          print_list_object['address'] = ele.address;
          print_list_arr[index] = print_list_object;
        });
        print_list_json['data'] = print_list_arr;
        $noSelectPrinterDiv.html(template.render(print_list_json));

        /*设置模块显示隐藏*/
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
        /*设置模块显示隐藏结束*/

        /*渲染之前设置的值*/
        var no_selection_list_len = no_selection_list.length;
        if (no_selection_list_len > 0) {
          var if_open_printer =
              no_selection_list[no_selection_list_len - 1]['isOpenPrinter'],
            selected_printer_list =
              no_selection_list[no_selection_list_len - 1]['printerId'],
            print_number =
              no_selection_list[no_selection_list_len - 1][
                'continuousPrintNum'
              ],
            mobile_print =
              no_selection_list[no_selection_list_len - 1]['isPrintMobile'],
            qrcode_print =
              no_selection_list[no_selection_list_len - 1]['qrcodePrint'];

          // 渲染小票打印开启或关闭
          if (if_open_printer == 1) {
            $('#open_print').prop('checked', 'checked');
            $('[data-type="noSelectPrinter"]')
              .find('[data-type="no_selection_printer_div"]')
              .removeAttr('disabled');
          } else {
            $('#close_print').prop('checked', 'checked');
          }
          // 渲染选择的打印机
          // 重置选中状态
          $('[data-type="noSelectPrinter"]')
            .find('[data-type="no_selection_printer_div"]')
            .removeAttr('checked'); // 先重置打印机列表
          // 遍历选中
          if (typeof selected_printer_list !== 'undefined') {
            // 本地新建且自动缓存时若为设置打印机会出现undefined
            for (var j = 0; j < selected_printer_list.length; j++) {
              $('[data-type="noSelectPrinter"]')
                .find('[data-id="' + selected_printer_list[j] + '"]')
                .eq(0)
                .prop('checked', 'checked');
            }
          }
          // 渲染打印联数
          if (typeof print_number !== 'undefined') {
            // 本地新建且自动缓存时若为设置打印机会出现undefined
            $('#printNumber')
              .val(print_number)
              .selectpicker('refresh');
          }
          // 渲染二维码打印设置
          if (qrcode_print == 1) {
            $('#print_all').prop('checked', 'checked');
          } else if (qrcode_print == 2) {
            $('#print_divide').prop('checked', 'checked');
          } else if (qrcode_print == 3) {
            $('#print_non_qrcode').prop('checked', 'checked');
          } else {
            // 本地新建且自动缓存时若为设置打印机会出现undefined时默认全部打印
            $('#print_all').prop('checked', 'checked');
          }
          // 渲染手机号码打印设置
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
        /*渲染之前设置的值结束*/
      }
    },
    // 小票打印模态框关闭事件
    closeSetPrintModal: function(e) {
      var self = this;
      $('[data-type="exception_tip"]')
        .eq(0)
        .text('');
      /*测试检测*/
      var has_selection_list = selection_list,
        has_not_selection_list = no_selection_list,
        has_not_selection_list_len = has_not_selection_list.length;
      if (has_not_selection_list_len > 0) {
        overall_if_open_printer =
          has_not_selection_list[has_not_selection_list_len - 1][
            'isOpenPrinter'
          ];
      } else if (has_selection_list.length > 0) {
        overall_if_open_printer = true;
      } else {
        overall_if_open_printer = false;
      }
      /*测试检测*/
    },
    // 打印机model点击确认 保存
    surePrint: function(e) {
      var self = this,
        ifHasSelection = !$('[data-type="seletionItemList"]')
          .eq(0)
          .parent()
          .hasClass('hide'); //判断是否是有规格的情况
      // 需求改动：添加提交时判断是否设置打印机，将变量提升
      // if_set_printer = false; // 是否设置了打印机

      // 深复制当前保存的打印机信息
      var transfer = myTool.deepCopy(printer_list);
      origin_printer_list = transfer;
      // 如果有规格
      if (ifHasSelection) {
        /*隔联打印时检验打印联数是否大于1*/
        var if_has_ercode = $('#print_divide').prop('checked'),
          print_number = $('#printNumber').val();
        if (if_has_ercode && print_number < 2) {
          alert('请先把“打印联数”设置为大于1，再设置隔联打印功能。');
          return false;
        }
        /*隔联打印时检验打印联数是否大于1结束*/

        // 开始转变数据结构
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
                // 如果已经有了selection设置，不空，则修改属性值
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
            // 给空的selectionList[i] 添加属性
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
            for (
              var i = 0;
              i < sub_wrap_selection[0]['printerId'].length;
              i++
            ) {
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
          // 将当前打印机信息设置到当前选择项model 的 printer中
          curModel.set('printer', wrap_selection);
        });
        // 清空无选择项时的全局选择项列表变量，在保存时方便判断如何整理数据
        no_selection_list = [];
      } else {
        // 没有规格时
        var if_open_printer = Number($('#open_print').prop('checked')),
          qrcode_print,
          mobile_print,
          selected_printer_list = [],
          print_number = '';
        qrcode_print = parseInt($('[name="print_method"]:checked').val()); //  获取打印二维码参数
        mobile_print = parseInt($('[name="print_tel_method"]:checked').val()); //  获取打印电话号码参数
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
        // 无选择项列表末尾添加最新的无选择项时打印机信息
        no_selection_list.push(temporary_obj);
        // 清空有选择项时的全局选择项列表变量，在保存时方便判断如何整理数据
        selection_list = [];
      }
      !if_set_printer && (self.show_printer_id = 0);
      if_set_printer
        ? self.change_printer_text('已设置')
        : self.change_printer_text('设置');
      $('#setPrintModal').modal('hide');
    },
    // 切换是否开启打印机
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
    // 小票打印有规格项时其中规格项选择事件
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
      // 判断是选中还是取消
      var if_checked = $tar.prop('checked');
      $.each(printer_list, function(index, ele) {
        if (ele['id'] == curPrinterId) {
          // 判断是否已经存在选择项的数组
          if (
            typeof ele['selection'] != 'undefined' &&
            ele['selection'].length != 0
          ) {
            var is_new_selection = false;
            // 判断是否是已经存在的选择项
            $.each(ele['selection'], function(subIndex, subEle) {
              // 如果当前选择项序号等于触发目标序号,就替换当前序号索引的数组位置的值
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

    /**保存**/
    // 点击发布 存为模板 存为草稿
    submit: function(e, save_to_template, save_to_draft) {
      var self = this;
      // 根据按钮文本判断，未设置打印机、第一次点击保存且存在打印机时开启对应拟态框，不使用变量!if_set_printer，因为源代码并未实时改变它
      if (
        ifFirstSave &&
        $('[data-type="set_print"]')
          .eq(0)
          .text() === '设置' &&
        !save_to_template &&
        !save_to_draft
      ) {
        // 获取打印机列表
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
          // 有打印机则弹框，无打印机则执行保存操作
          $('#notSetPrinterModal').modal('show');
          return;
        }
      }
      // 保存操作
      var $container = $('[data-role="submit-container"]');
      if (!!$container.length) {
        $container.appendTo('body').fadeIn();
      } else {
        $container = $(
          juicer(config.template.component.savingModal).render({})
        );
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
      // 检测网络
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
            // 存为模板
            self.saveOtherSiteAllImagesSuccess_template();
          } else {
            if (save_to_draft) {
              // 存为草稿
              self.saveOtherSiteAllImagesSuccess(1);
            } else {
              // 新建/编辑佛事
              self.saveOtherSiteAllImagesSuccess();
            }
          }
        }
      );
    },
    // 未设置打印机时弹出的模态框点击按钮
    showSetPrinterModal: function() {
      $('#notSetPrinterModal').modal('hide');
      $('#setPrintModal').modal('show');
    },
    // 跳过设置打印机并保存
    skipSetPrinterAndSave: function() {
      var $modal = $('#notSetPrinterModal'),
        $submit = $('#submit');
      $modal.modal('hide');
      $submit.click();
    },
    // 未设置小票打印的拦截窗口，仅在第一次点击保存时出现
    hideNotSetPrinterModal: function(e) {
      ifFirstSave = false;
    },
    // 点击设置模板弹出modal
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
    // 存为草稿
    save_draft: function(e) {
      var self = this;
      self.submit(e, 0, 1);
    },
    // 确定存为模板
    confirm_template: function(e) {
      var self = this,
        $tar = $(e.target);
      self.new_template_name = $('[data-type="template_name"]').val();
      $tar.parents('[data-role="my_modal"]').fadeOut();
      self.submit(e, 1, 0);
    },
    // 取消存为模板
    cancel_template: function(e) {
      var self = this,
        $tar = $(e.target);
      $tar.parents('[data-role="my_modal"]').fadeOut();
    },
    // 页面取消按钮
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
    // 关闭添加佛历modal
    closeAddCalendarModal: function() {
      var self = this;
      self.getUnprintedOrder();
    },
    //点击关闭保存状态模态框
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
          /*cancel: {
                        text: '取消',
                        action: function () {

                        }
                    }*/
        },
      });
    },
    // 保存佛历提醒时间
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
      // temple_check_if_hide = $("#ifAddMyTemple").parents('.input-group').hasClass('hide'),
      // temple_check = $("#ifAddMyTemple").prop("checked");
      // 通过cms添加图文列表
      var set_calendar = 0;
      if (!calendar_check_if_hide && calendar_check) set_calendar = 1;
      // if(!temple_check_if_hide && temple_check) set_imagetext = 1;
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

    /*工具类函数*/
    // 初始化手机号码附言 短信验证 文案
    initTelPsVerifyMsg: function(isSubPs, isVerify) {
      var self = this;
      self.getMsgNum(function(msgNum) {
        var $msgNumTip, $msgNum, $inputRequiredFormGroup, $inputRequired;
        if (isSubPs) {
          // 选择项附言
          $msgNumTip = $('#size-msg-num-tip');
          $msgNum = $('#size-msg-num');
          $inputRequiredFormGroup = $('#size-input-required-form-group');
          $inputRequired = $('#sizesInputRequired');
        } else {
          // 外层附言
          $msgNumTip = $('#msg-num-tip');
          $msgNum = $('#msg-num');
          $inputRequiredFormGroup = $('#input-required-form-group');
          $inputRequired = $('#inputRequired');
        }

        if (isVerify) {
          // 需要验证则 设为必填并隐藏必填项 展示短信余量
          $msgNum.text(msgNum);
          $msgNumTip.show();
          $inputRequired.prop('checked', true);
          $inputRequiredFormGroup.hide();
        } else {
          // 无需验证则 展示必填项 隐藏短信余量
          $msgNumTip.hide();
          $inputRequiredFormGroup.show();
        }
      });
    },
    // 获取短信剩余数量
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
    // 添加error red border
    addRedBorder: function($ele) {
      $ele.addClass('border--red');
      setTimeout(function() {
        $ele.removeClass('border--red');
      }, 5000);
    },
    // 返回佛事管理页面
    change_url: function() {
      window.location.href = '/zzhadmin/managerCeremonyIndex/';
    },
    // 获取未打印订单数量
    getUnprintedOrder: function(e) {
      var self = this,
        get_print_opt = {};
      if (foshiId == null) {
        // 新建佛事时直接跳转到管理页面
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
    // 读取当前内容
    read_current_content: function() {
      var self = this,
        current_content = {};
      // 如果editType = 1, 默认ceremonyMap; editType = 2,3 默认template_content
      if (editType == 1) {
        current_content = ceremonyMap;
      } else {
        current_content = template_content;
      }
      current_content['title'] = $('#proName').val();
      current_content['ceremonyTypeId'] = $('#classification').val();
      if (!(editType == 3 && ifTemplate == 1)) {
        // 非编辑我的模板
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
      var detailsEdi = UE.getEditor('myEditor'),
        pay_succ_detailsEdi = UE.getEditor('myEditor2');
      detailsEdi.ready(function() {
        current_content['details'] = detailsEdi.getContent(); //详情编辑器内容
      });
      pay_succ_detailsEdi.ready(function() {
        current_content['pay_succ_details'] = pay_succ_detailsEdi.getContent(); // 下单后提示内容
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
      ).val(); //参与者列表显示为1，不显示为0
      current_content['showEndTime'] = $(
        'input[name=remainingTime]:checked'
      ).val(); //剩余时间
      current_content['opName'] = $('#operation').val(); // 按钮文字
      current_content['feedback_type'] =
        $('.selected_feedback_item').attr('data-index') || ''; // 按钮文字
      current_content['startTime'] = $('#timeStart').val(); // 开始时间
      current_content['endTime'] = $('#timeLimit').val(); // 结束时间
      //  统计区域和目标金额
      var $targetAmount = $('#target-amount');
      var is_show_cnt = parseInt(
        $('input[name=summaryArea]:checked').val(),
        10
      ); //是否展示统计区域
      var targetAmount = parseFloat($targetAmount.val()); // 目标金额
      if (is_show_cnt === 1) {
        // 显示 进一步获取正确的数值
        is_show_cnt = parseInt(
          $('[data-ele="summary-area-type"].active').attr('data-type'),
          10
        );
        if (is_show_cnt === 2) {
          // 众筹样式
          if (
            isNaN(targetAmount) ||
            targetAmount <= 0 ||
            String(targetAmount).indexOf('.') !== -1
          ) {
            // 金额错误
            targetAmount = '';
          }
        } else {
          targetAmount = '';
        }
      } else {
        // 不显示
        targetAmount = '';
      }
      current_content['showStatictics'] = is_show_cnt; //统计区域
      current_content['targetAmount'] = targetAmount; //统计区域
      // debugger

      if (no_selection_list.length > 0) {
        /*封装无选择项时的小票打印设置*/
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
        /*封装无选择项时的小票打印设置结束*/
      }
      // console.log(current_content);
      return current_content;
    },
    // 执行保存内容到本地
    save_content_to_local: function() {
      var self = this,
        current_content = {};
      current_content = self.read_current_content();
      localStorage.removeItem('foshi_content');
      localStorage.setItem('foshi_content', JSON.stringify(current_content));
      Toast("您当前的佛事内容已缓存至本地(●'◡'●)");
    },
    // 清空之前保存在localstorage的佛事内容
    clear_local_content: function() {
      localStorage.removeItem('foshi_content');
    },
    // 渲染本地数据
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
              // 渲染标题展示参与人数
              $('#show-join-num').bootstrapSwitch(
                'state',
                !!current_content.allow_showVistNum
              );
              // 渲染封面图片
              self.showimgs(current_content);
              // 渲染简介
              $('#summary').val(current_content.custom_introduce);
              $('#summary').trigger('keyup');
              // 渲染编辑器内容
              self.showDetail(current_content, 1);
              // 渲染规格
              self.showSizes(current_content, 1);
              // 渲染附言
              self.showAddition(current_content, 1);
              // 渲染价格、库存、是否完成订单
              self.showPrimeSize(current_content);
              // 渲染checkBox
              self.inputCheck(current_content);

              var add_wrap_obj = {};
              add_wrap_obj['isOpenPrinter'] = current_content.isOpenPrinter;
              add_wrap_obj['printerId'] = current_content.printerId;
              add_wrap_obj['continuousPrintNum'] =
                current_content.continuousPrintNum;
              add_wrap_obj['qrcodePrint'] = current_content.qrcodePrint;
              add_wrap_obj['isPrintMobile'] = current_content.isPrintMobile;
              no_selection_list.push(add_wrap_obj);
              overall_if_open_printer = current_content.isOpenPrinter;
              // 渲染打印机
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
    // 开始验证数据
    startVerify: function() {
      var self = this,
        detailsEdi = UE.getEditor('myEditor'),
        pay_succ_detailsEdi = UE.getEditor('myEditor2'),
        details = null,
        pay_succ_details = '',
        feedback_type = '',
        suixiMoney = null, // 无任何规格的随喜金额
        inventory = null, // 无任何规格的随喜库存
        isAutoFinish = null; // 无任何规格的订单自动处理
      // 没有选择佛事分类 直接返回
      if ($('button[data-id=classification]').length == 0) {
        Toast('请添加分类', 2);
        $('html, body').scrollTop($('#classifiSelect').offset().top);
        return false;
      }
      var foshiName = $('#proName').val(), //标题名
        is_show_participant = $('input[name=participateList]:checked').val(), //参与者列表显示为1，不显示为0
        is_show_time = $('input[name=remainingTime]:checked').val(), //剩余时间
        typeName = $('button[data-id=classification]')[0].getAttribute('title'), // 佛事分类名称
        typeIndexFind = 0, // 佛事分类序号
        typeIndex = 0, // 佛事分类ID
        subdivideStr = [], // 选择项数组
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
        inputLength = $('#additionBox > tr').length, //附言选项长度
        inputType = [], // 外层附言类型
        inputString = [], // 外层附言类型名字数组
        additionID = [], // 外层附言Id数组
        isMust = [], // 外层附言必填选项数组
        inputName = [], // 外层附言名字数组
        prompt_text = [], // 外层示例文字
        describtion = [], // 外层描述
        selectInput = [], // 外层附言若是下拉选择项 会有此字段
        font_length = [], // 外层心愿附言字数限制
        isVerify = [], // 外层手机号码附言 是否需要验证 字段
        dataType = [], // 外层附言日期选项数组
        picNum = [], // 外层附言上传数量数组
        postScript = [], // 外层附言发送格式
        buy_btn_name = $('#operation').val(), //  操作输入框
        start_time = $('#timeStart').val(), // 开始时间
        end_time = $('#timeLimit').val(), // 结束时间
        productionImg = [], // 存储上传的封面图片src数组
        no_need_pay = false; // 默认无需开启 false, 针对特殊逻辑
      $(typeList).each(function(index, ele) {
        //获取佛事分类序号
        if (ele == typeName) {
          typeIndexFind = index;
        }
      });
      //  统计区域和目标金额
      var $targetAmount = $('#target-amount');
      var is_show_cnt = parseInt(
        $('input[name=summaryArea]:checked').val(),
        10
      ); //是否展示统计区域
      var targetAmount = parseFloat($targetAmount.val()); // 目标金额
      if (is_show_cnt === 1) {
        // 显示 进一步获取正确的数值
        is_show_cnt = parseInt(
          $('[data-ele="summary-area-type"].active').attr('data-type'),
          10
        );
        if (is_show_cnt === 2) {
          // 众筹样式
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
        // 不显示
        targetAmount = 0;
        $targetAmount.parents('.form-group').removeClass('has-error');
      }
      // debugger

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
      // 没有选择项时
      if (
        $('#sizeBox')
          .parents('.form-group')
          .hasClass('hide')
      ) {
        // 无需支付时
        if (
          $('#suixiInput')
            .parents('.form-group')
            .hasClass('hide')
        ) {
          suixiMoney = 0;
          isAutoFinish = 0;
          no_need_pay = true;
        } else {
          var suixiOrigin = $('#suixiInput').val(); // 取得输入的随喜金额
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
            // 重新编写的数据校验
            var suixi_match = suixiOrigin
              .toString()
              .match(myRegExp.suixi_price_right);
            if (suixi_match) {
              suixiOrigin = suixi_match[0];
              suixiOrigin = suixiOrigin.replace(/\，/g, ','); // 替换中文'，'为英文','再上传
              var suixiArr = suixiOrigin.split(',');
              if (suixiArr.length > 1) {
                // 多金额
                suixiArr[suixiArr.length - 1] == '' &&
                  (suixiOrigin = suixiOrigin.substr(0, suixiOrigin.length - 1));
                suixiMoney = '[' + suixiOrigin + ']';
                // 多金额获取当前是否自动完成订单参数
                isAutoFinish = Number(
                  $('#autoFinishSwitch').bootstrapSwitch('state')
                );
              } else {
                // 单金额
                suixiMoney = suixiOrigin;
                // 单金额当前是否自动完成订单参数为0
                isAutoFinish = 0;
              }
            } else {
              Toast(
                '支付金额格式出错，请以逗号分隔数字且无其它无关字符出现',
                2
              );
              $('html, body').scrollTop($('#suixiInput').offset().top - 50);
              self.addRedBorder($('#suixiInput'));
              return false;
            }
          }
        }
        inventory = $('#proStore').val();
        inventory == '' && (inventory = -1);
      } else {
        // 有选择项时
        var sizebox_error = false;
        $('#sizeBox > tr').each(function(index, ele) {
          var curCid = ele.id,
            curModel = self.sizes.get(curCid),
            subType = curModel.get('subdivide_type'),
            curPostscript = curModel.get('postScript'),
            postscriptArr = [];
          // debugger
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
              postscriptWrap['isVerify'] = curPostscriptArr[i].isVerify; // 手机号码附言 是否需要短信验证 字段
              // 心愿字段
              if (
                postscriptWrap['inputType'] == 15 ||
                (subType == 3 && postscriptWrap['inputType'] == 12) ||
                (subType == 2 &&
                  (postscriptWrap['inputType'] == 10 ||
                    postscriptWrap['inputType'] == 11))
              ) {
                // 字数字段 心愿 祈福选择项 功德芳名往生者 往生选择项 往生者 阳上人
                postscriptWrap['font_length'] = curPostscriptArr[i].font_length;
              } else {
                postscriptWrap['font_length'] = 0; // 非心愿字数限制置为0
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

          // debugger
          // 未定义printer的选择项默认添加为[]
          // if (currentPrinter === '') {
          //     currentPrinter = [];
          // }
          // debugger
          if (typeof currentPrice == 'string') {
            var typePrice =
              currentPrice.indexOf(',') + currentPrice.indexOf('，');
          } else if (typeof currentPrice == 'number') {
            var typePrice = -1;
          }
          if (currentPrice == '') {
            var specifiPrice = 0;
          } else {
            // 重新编写的数据校验
            var select_suixi_match = currentPrice
              .toString()
              .match(myRegExp.suixi_price_right);
            if (select_suixi_match) {
              currentPrice = select_suixi_match[0];
              if (typePrice < 0) {
                // 单金额
                var specifiPrice = currentPrice;
              } else {
                // 多金额
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
              // 格式错误
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
          subdivide['isAutoFinish'] = curModel.get('isAutoFinish'); // 新加的自动完成订单字段
          subdivide['subdivide_type'] = curModel.get('subdivide_type'); // 新加分类字段
          subdivide['endTime'] = curModel.get('endTime'); // 新加选择项到期时间
          subdivide['enroll_num'] = curModel.get('enroll_num'); // 新加选择项参与次数限制
          selection_list.length > 0 &&
            (subdivide['printer'] = curModel.get('printer')); //有选择项时小票打印设置
          subdivide['sort'] = index;
          editType == 1 && specifiId != '' && (subdivide['id'] = specifiId); // 获取规格Id
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
          // 循环附言并获取外层附言的设置
          inputString[index] = $.trim(
            $(ele)
              .eq(0)
              .find('button')
              .eq(0)
              .text()
          ); // 获取附言类型名字
          if (editType == 1) {
            var addID = $(ele)
              .eq(0)
              .find('img')[0].attributes[1].value;
            additionID[index] = addID; //编辑时获取附言Id
          }
          // 获取外层附言的数据
          var cid = $(ele).attr('id'),
            modelAll = self.additionItems.get(cid); // 获取数据模型
          isMust[index] = modelAll.get('is_must'); // 获取必填选择
          dataType[index] = modelAll.get('dataType'); // 获取可选日期
          picNum[index] = modelAll.get('pic_num'); // 获取图片上传数量
          describtion[index] = modelAll.get('describe'); // 获取描述
          selectInput[index] = modelAll.get('selectInput'); // 获取下拉菜单文字
          font_length[index] = modelAll.get('font_length'); // 获取心愿字数限制
          isVerify[index] = modelAll.get('isVerify'); // 获取手机号码附言 是否需要验证 字段
          inputName[index] = $(ele)
            .eq(0)
            .find('input.additionName')
            .eq(0)
            .val(); // 获取标题
          // 获取附言类型
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
          // 获取prompt_text
          if (inputType[index] !== 3) {
            prompt_text[index] = modelAll.get('prompt_text');
            prompt_text[index] == null && (prompt_text[index] = '');
          } else {
            // 下拉列表
            prompt_text[index] = [];
            if (typeof selectInput[index] != 'undefined') {
              for (var i = 0; i < selectInput[index].length; i++) {
                prompt_text[index].push(selectInput[index][i]);
              }
            }
          }
        });

        for (var i = 0; i < inputLength; i++) {
          //整理得出最终上传的 外层附言数据格式
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
          postScriptInner['isVerify'] = isVerify[i]; // 手机号码附言的 是否 短信验证

          // 心愿的字数限制
          if (inputType[i] == 15) {
            postScriptInner['font_length'] = font_length[i];
          } else {
            // 非心愿传0,因为非单选文本也需要传此参数，所以在此加一句
            postScriptInner['font_length'] = 0;
          }

          postScript.push(postScriptInner);
        }
      }
      $('.myupload img').each(function(index, Dom) {
        productionImg.push($(Dom).attr('src'));
      });

      //校验图片为空的情况
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
        if (
          subdivideStr[i]['name'] == '' &&
          subdivideStr[i]['inputType'] != 13
        ) {
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
        details = detailsEdi.getContent(); //详情编辑器内容
      });
      pay_succ_detailsEdi.ready(function() {
        pay_succ_details = pay_succ_detailsEdi.getContent(); // 下单后提示内容
      });
      if (details.length < 3) {
        $('html, body').scrollTop(400);
        Toast('请填写详情!', 2);
        return false;
      }

      // 开启反馈信息时判断是否填写了反馈内容
      // console.log($('#open_feedback').prop('checked'));
      // console.log(pay_succ_details.length);
      if ($('#open_feedback').prop('checked') && pay_succ_details.length < 3) {
        Toast('请填写下单提示!', 2);
        return false;
      }
      // 功德证书类型
      feedback_type = $('.selected_feedback_item').attr('data-index');
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
        // 无选择项
        opt['price'] = suixiMoney;
        opt['stock'] = inventory;
        opt['isAutoFinish'] = isAutoFinish;
      } else {
        // 有选择项
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
        /*封装无选择项时的小票打印设置*/
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
        /*封装无选择项时的小票打印设置结束*/
      }
      if (!(editType == 3 && ifTemplate == 1)) {
        // 非编辑我的模板 添加标题参与人数开关 简介字段
        opt['allow_showVistNum'] = Number(
          $('#show-join-num').bootstrapSwitch('state')
        );
        opt['custom_introduce'] = $('#summary').val();
      }
      // 是否开启反馈信息
      opt.pay_succ_details_flag =
        parseInt($('input[name="if_feedback"]:checked').attr('value')) || 0;

      window.contentData = opt;
      console.log(window.contentData);
      // debugger
      return true;
    },
    // 新建或修改佛事  替换编辑器图片完成事件，开始准备上传整体页面数据
    saveOtherSiteAllImagesSuccess: function(save_to_draft) {
      var self = this,
        params = {}, // 上传对象
        submit_url = '', // 上传Url
        start_time = $('#timeStart').val(), // 开始时间
        end_time = $('#timeLimit').val(); // 结束时间
      if (editType == 1) {
        // 编辑佛事
        params = window.contentData;
        params['id'] = foshiId;
        submit_url = '/zzhadmin/managerEditCeremony/';
        if (verifyId == 2) {
          // 编辑草稿
          params['op_status'] = 2;
        }
      } else if (editType == 3 && ifTemplate) {
        // 编辑我的佛事模板
        // 不保存开始结束时间
        window.contentData['startTime'] = '';
        window.contentData['endTime'] = '';
        submit_url = '/zzhadmin/saveCeremonyTemplate/';
        params = {};
        params['templateId'] = templateId;
        params['content'] = window.contentData;
      } else {
        // 新建佛事
        params = window.contentData;
        submit_url = '/zzhadmin/createCeremony/';
      }

      if (save_to_draft) {
        // 点击存为草稿（新建或编辑草稿进来后）
        params['op_status'] = 2;
      } else {
        // 点击发布（新建编辑佛事） 其它按照原status传递 服务器status 0 1 2 已审核 未审核 草稿 对应本地 verifyId 1 0 2
        if (verifyId == 1) {
          // 已审核传0
          params['op_status'] = 0;
        } else {
          // 未审核传1
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
          self.clear_local_content(); // 清空之前保存在localstorage的佛事内容
          $('[data-role="submit-container"]').fadeOut(); // 隐藏保存loading弹框
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
            // 草稿直接跳转
            self.change_url();
          } else {
            // 非草稿
            if (res.createCalendar !== 1) {
              // 非添加进佛历
              self.getUnprintedOrder();
            } else {
              // 添加进佛历
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
          //请求完成后最终执行参数
          if (status == 'timeout') {
            //超时,status还有success,error等值的情况
            $('[data-role="submit-container"]').fadeOut();
            Toast('提交超时，请重新保存', 0);
          }
        },
      });
    },
    // 存为模板  替换编辑器图片完成事件，开始准备上传整体页面数据
    saveOtherSiteAllImagesSuccess_template: function() {
      var self = this,
        params = {}, // 上传对象
        submit_url = ''; // 上传Url
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
          self.clear_local_content(); // 清空之前保存在localstorage的佛事内容
          $('[data-role="submit-container"]').fadeOut(); // 隐藏保存loading弹框
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
          //请求完成后最终执行参数
          if (status == 'timeout') {
            //超时,status还有success,error等值的情况
            $('[data-role="submit-container"]').fadeOut();
            Toast('提交超时，请重新保存', 0);
          }
        },
      });
    },
    // 获取url参数函数
    UrlSearch: function() {
      var name,
        value,
        str = location.href, //取得整个地址栏
        num = str.indexOf('?');
      str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

      var arr = str.split('&'); //各个参数放到数组里
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf('=');
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          this[name] = value;
        }
      }
    },
    // 渲染反馈模板
    render_feedback_item: function(feedback_modal) {
      var ue2 = UE.getEditor('myEditor2'),
        feedback_html = '';
      feedback_modal != '' && (feedback_html = feedback_modal.render({}));
      ue2.setContent(feedback_html, false);
    },
    // 初始化开始
    initialize: function() {
      var self = this,
        UrlSearch = new self.UrlSearch();
      // 获取url参数
      editType = UrlSearch.edit;
      foshiId = UrlSearch.id;
      ifTemplate = UrlSearch.ifTemplate;
      verifyId = UrlSearch.verifyId; // 0未审核 1已审核 2草稿
      // 修改描述文字
      if (editType == 1) {
        document.title = '编辑佛事';
        $('[data-id="titleName"]').text('编辑佛事');
        if (verifyId != 2) {
          // 保留编辑草稿的发布文本 并隐藏编辑非草稿的存为草稿按钮
          $('#submit').text('修改佛事');
          $('#save-draft').addClass('hide');
        }
      } else if (editType == 0) {
        document.title = '复制佛事';
        $('[data-id="titleName"]').text('复制佛事');
      }
      // 获取佛事分类列表 如果是编辑佛事 则正确赋值选中
      self.render_buddhist_type_list();
      // ediType = undefined  为完全的新建佛事
      // editType = 0 为复制佛事
      // editType = 1 为编辑佛事
      // editType = 2 表示选择的是系统佛事模板 来新建佛事
      // editType = 3 表示选择的是我的佛事模板 来新建佛事
      // editType = 3 ifTemplate = 1 表示编辑我的佛事模板
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
      // 初始化日期选择
      self.initDateTimepicker();
      // 初始化拖拽排序
      self.initSortable();
      // 初始化提示框
      $('[data-type="tip"]').tooltip();
      // 非编辑我的模板初始化并显示标题展示参与人数开关和简介
      // 初始化标题参与人数switch
      var $showJoinNumCtnr = $('#show-join-num-ctnr'),
        $switch = $('#show-join-num'),
        $summaryCtnr = $('#summary-ctnr');
      if (editType == 3 && ifTemplate == 1) {
        // 编辑我的模板隐藏
        $showJoinNumCtnr.hide();
        $summaryCtnr.hide();
      } else {
        // 初始化开关
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
      // 增加离开页面触发函数
      window.addEventListener('beforeunload', function(e) {
        if (!has_tip) {
          var confirmationMessage = '你确定离开吗?（未保存的修改将不生效）';
          (e || window.event).returnValue = confirmationMessage;
          return confirmationMessage;
        }
      });
      // 如果是完全的新建佛事
      if (!editType) {
        setInterval(function() {
          // 60s执行一次是否保存内容到本地
          self.save_content_to_local();
        }, 60000);
        setTimeout(function() {
          // 新建佛事一进来若本地保存的内容不为空，则询问是否拉取本地数据覆盖
          // 渲染localStorage foshi_content
          self.render_local_content();
        }, 3000);
      }
    },
    // 初始化日期选择
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
      // 开始时间
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
      // 结束时间
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
      // 选择项的结束时间
      // 初始化当前行的选择项日期选择
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
    // 初始化拖拽排序
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
    // 获取佛事模板内容
    get_buddhist_template: function() {
      var self = this,
        get_url = '',
        params = {};
      params['templateId'] = templateId;
      if (editType == 2) {
        // 获取系统佛事模板，新建页面的所有数据获取
        get_url = '/zzhadmin/ceremony_template/';
      } else {
        // 获取非系统佛事模板，新建页面的所有数据获取
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
    // 渲染佛事模板
    render_buddhist_template: function(getContent) {
      var self = this;
      $('#proName').val(getContent.title);
      // 渲染标题展示参与人数
      if (typeof getContent.allow_showVistNum !== 'undefined') {
        // 老数据无此字段
        $('#show-join-num').bootstrapSwitch(
          'state',
          !!getContent.allow_showVistNum
        );
      }
      // 渲染分类
      $('#classification').selectpicker('val', getContent.ceremonyTypeId);
      // 渲染封面图片
      self.showimgs(getContent);
      // 渲染简介
      if (typeof getContent.custom_introduce !== 'undefined') {
        // 老数据无此字段
        $('#summary').val(getContent.custom_introduce);
        $('#summary').trigger('keyup');
      }
      // 渲染编辑器内容
      self.showDetail(getContent);
      // 渲染选择项
      self.showSizes(getContent);
      // 渲染附言
      self.showAddition(getContent);
      // 渲染价格、库存
      self.showPrimeSize(getContent);
      // 渲染checkBox
      self.inputCheck(getContent);
      // 后台模板新加反馈信息的开启关闭状态
      // 兼容老的模板数据 无开关反馈信息字段则置为0
      if (typeof getContent.pay_succ_details_flag === 'undefined') {
        getContent.pay_succ_details_flag = 0;
      }
      self.setIfOpenFeedback(getContent);
      // 只有使用我的模板新建和编辑我的模板时才渲染打印机相关 其它为默认
      if (editType == 3) {
        // 渲染打印机按钮文本
        self.setPrinterStatus(getContent);
      }
    },
    render_ueditor: function() {
      var self = this,
        ue = UE.getEditor('myEditor'),
        ue2 = UE.getEditor('myEditor2');
      // 为ueditor添加placeholder的自定义函数
      /*UE.Editor.prototype.placeholder = function (justPlainText) {
                var _editor = this;
                _editor.addListener("focus", function () {
                    var localHtml = _editor.getPlainTxt();
                    if ($.trim(localHtml) === $.trim(justPlainText)) {
                        _editor.setContent(" ");
                    }
                });
                _editor.addListener("blur", function () {
                    var localHtml = _editor.getContent();
                    if (!localHtml) {
                        _editor.setContent(justPlainText);
                    }
                });
                _editor.ready(function () {
                    _editor.fireEvent("blur");
                });
            };*/
      function editorSlideTop() {
        // 最新版本佛事反馈，微信端还没适配好，先隐藏
        pay_succ_details = config.template.component.pay_succ_details;
        // pay_succ_details = [
        // '<section>',
        // '<section style="position:relative;margin:0 auto;width: 100%;box-sizing: border-box;overflow: hidden">',
        // '<img style="width: 100%;" src="https://pic.zizaihome.com/dcb2d320-7820-11e7-8246-00163e0c1e1c.png" alt=""/>',
        // '<section style="position:absolute;left:0;width: 100%;top:35%;height:65%;box-sizing: border-box;overflow: hidden">',
        // '<p style="font-family:&quot;隶书&quot;;font-weight:500;text-align:center;font-size:40px;color:#fff;letter-spacing: 6px;text-indent: 34px;width: 100%;margin: 0;">随喜赞叹！</p>',
        // '</section>',
        // '</section>',
        // '</section>'
        // ].join('');
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
      // ue.placeholder("欢迎使用“导入微信图文”功能，导入成功后请将内文进行相应的编辑与更新。");
      // ue2.placeholder("欢迎使用“导入微信图文”功能，导入成功后请将内文进行相应的编辑与更新。");
    },
    // 隐藏loading图标
    hide_loading: function() {
      var self = this;
      self.ready_editor++;
      if (self.ready_editor == 2) {
        $('#loading-toast').addClass('hideEle');
      }
    },
    // 绑定模型的排序
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
    // 渲染佛事分类列表
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

            // 获取分类数据并渲染下拉列表
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
              // 多选框配置 - 初始化
              $('.selectpicker').selectpicker({});
              self.res = res;
            }

            // 编辑佛事选中佛事分类
            if (foshiId) {
              $('#classification').selectpicker(
                'val',
                ceremonyMap.ceremonyTypeId
              );

              // 以下代码莫名其妙 建议删除
              // if (
              //   $('#classification')
              //     .prev()
              //     .find('.selected')
              //     .find('.text')
              //     .text() != foshiName
              // ) {
              //   // 分类名和佛事名不相同
              //   if (!is_test_environment) {
              //     $('#classification').selectpicker(
              //       'val',
              //       ceremonyMap.ceremonyTypeId
              //     );
              //   }
              //   var foshiNameList = $('#classification')
              //     .prev()
              //     .find('.selected')
              //     .siblings();
              //   $('#classification')
              //     .prev()
              //     .find('.selected')
              //     .removeClass('selected');
              //   foshiNameList.each(function(index, item) {
              //     var currentName = $('.text', item).text();
              //     if (currentName == foshiName) {
              //       item.setAttribute('class', 'selected');
              //     }
              //   });
              //   $('[data-id="classification"]').attr('title', foshiName);
              //   $('[data-id="classification"]')
              //     .find('span')
              //     .eq(0)
              //     .text(foshiName);
              // }
            }
            // 初始化模板
            self.additionItems = new AdditionCollection([
              new AdditionModel({}),
            ]);
            self.additionView = new AdditionsView({
              el: '#additionBox',
              model: self.additionItems,
            });
            // self.additionView.render();

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
            // self.sizesView.render();
            // 绑定sort box
            self.bind_model_sort();
            var html = self.html;
            // 渲染封面图片
            if (res != undefined) {
              var imgSrc = res.productionImg;
              // console.log(res)
              // console.log(res.productionImg)

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
    // 渲染封面
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
          height: '100px' /*"z-index": "-1",*/,
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
    // 渲染编辑器内容
    showDetail: function(getContent, ifLocalStorage) {
      var self = this,
        ue = UE.getEditor('myEditor'),
        ue2 = UE.getEditor('myEditor2'),
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
    // 渲染规格
    showSizes: function(getContent, ifLocalStorage) {
      // 根据传入的ceremonyMap.subdivideStr数据进行渲染
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
      // 根据sort调换顺序
      for (var k = 0; k < inputSizesOrigin.length; k++) {
        var kid = inputSizesOrigin[k].sort;
        inputSizes[kid] = inputSizesOrigin[k];
      }
      if (inputSizes == undefined || inputSizes.length == 0) return false;
      var inputSizesLen = inputSizesOrigin.length,
        jsonSizes = $.parseJSON(JSON.stringify(inputSizes));

      for (var i = 0; i < inputSizesLen; i++) {
        if (jsonSizes[i].postScript != undefined) {
          var jsonSizesAdd = $.parseJSON(
            JSON.stringify(jsonSizes[i].postScript)
          );
          for (var j = 0; j < jsonSizesAdd.length; j++) {
            var inputPrompt = jsonSizesAdd[j].prompt_text;
            if (
              Object.prototype.toString.call(inputPrompt) == '[object Array]'
            ) {
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
      // 对服务器获取的选择项数据 进行修改
      for (var i = 0; i < jsonSizes.length; i++) {
        // 处理服务器获取的价格数组字符串，去除两端的数组中括号 处理库存数据转化为本地所需映射
        if (isNaN(Number(jsonSizes[i].price))) {
          var priceLen = jsonSizes[i].price.length - 1;
          if (typeof jsonSizes[i].price != 'string') {
            jsonSizes[i].price = jsonSizes[i].price.join(',');
          } else if (!ifLocalStorage) {
            jsonSizes[i].price = jsonSizes[i].price.substring(1, priceLen);
          }
        }
        // 2017年10月27日15:33:58添加 判断服务器传来的金额,有两种格式，字符串和数字，改写model所需的isSingleMoney字段
        // console.log(typeof jsonSizes[i].price === 'string');
        if (
          jsonSizes[i].price.toString().indexOf(',') +
            jsonSizes[i].price.toString().indexOf('，') ===
          -2
        ) {
          // 不存在,和, 即单金额
          jsonSizes[i].isSingleMoney = 1;
        } else {
          jsonSizes[i].isSingleMoney = 0;
        }
        // 修改本地需要的数据
        jsonSizes[i].stock == -1 && (jsonSizes[i].stock = '');
        // 添加选择项到期时间字段
        if (typeof jsonSizes[i].endTime === 'undefined') {
          jsonSizes[i].endTime = '';
        }
        /// 添加选择项人数限制字段
        if (typeof jsonSizes[i].enroll_num === 'undefined') {
          jsonSizes[i].enroll_num = 0;
        }
      }
      // debugger
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
        .hasClass('hide') && $('#proStyleBtn').click(); // 若第一次render选择项 要移除hide
      if ($('.rePos').length != 0) {
        var right = -$('.rePos')
          .eq(0)
          .position().left;
        $('.delSmallPic').css('right', right);
      }
      for (var i = 0; i < inputSizesLen; i++) {
        // 遍历选择项
        var subType = jsonSizes[i].subdivide_type;
        if (typeof jsonSizes[i].postScript !== 'undefined') {
          var jsonSizesAdd = $.parseJSON(
            JSON.stringify(jsonSizes[i].postScript)
          );
          for (var j = 0; j < jsonSizesAdd.length; j++) {
            // 遍历附言
            var inputPrompt = jsonSizesAdd[j].prompt_text;
            if (
              Object.prototype.toString.call(inputPrompt) == '[object Array]'
            ) {
              if (typeof inputPrompt[0]['name'] != 'undefined') {
                for (var k = 0; k < inputPrompt.length; k++) {
                  jsonSizesAdd[j].selectInput = inputPrompt[k]['name'];
                }
              } else {
                jsonSizesAdd[j].selectInput = inputPrompt;
              }
              jsonSizesAdd[j].prompt_text = '';
            }
            // 将选择项的类型添加给内层
            jsonSizesAdd[j].subType = subType;
          }
          // 祈福类3 对附言数据中的 功德芳名12 心愿15 数据进行置顶和 各至少一项的添加处理
          // 往生类2 对附言数据中的 阳上人10 往生者 11 数据进行置顶和 各至少一项的添加处理
          jsonSizesAdd = self.handleSpecialSubPs(subType, jsonSizesAdd);
          // console.log(jsonSizesAdd);
          jsonSizes[i].postScript = new sizesAdditionCollection(jsonSizesAdd);
          self.sizesAddition = new sizesAdditionCollection(jsonSizesAdd);
          var sizeCid = self.sizes.models[i].cid;
          // self.sizes.get(sizeCid).set('postScript') = self.sizesAddition;
          // 此处无法使用get set
          self.sizes.models[i].attributes.postScript = self.sizesAddition;
          self.sizePostscript[sizeCid] = self.sizesAddition;
        }
      }
      // console.log(self.sizes);
    },
    // 处理特殊附言数据
    handleSpecialSubPs: function(subType, psArr) {
      if (subType == 3) {
        var FMPs = [],
          XYPs = [],
          otherPs = [];
        psArr.map(function(ps) {
          if (ps.inputType == 12) {
            // 功德芳名
            // 修改默认数据 兼容老数据
            if (ps.font_length === 0) {
              ps.font_length = 8;
            }
            if (ps.pic_num === 0) {
              ps.pic_num = 4;
            }
            FMPs.push(ps);
          } else if (ps.inputType == 15) {
            // 心愿
            // 修改默认数据 兼容老数据
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
          // 添加一个默认的功德芳名
          FMPs.push({
            cid: '',
            dataType: 2,
            describe: '',
            font_length: 8,
            // id: 28519,
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
          // 添加一个默认的心愿
          XYPs.push({
            cid: '',
            dataType: 2,
            describe: '',
            font_length: 20,
            // id: 28524
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
            // 阳上人
            // 修改默认数据 兼容老数据
            if (ps.font_length === 0) {
              ps.font_length = 8;
            }
            ps.pic_num = 0;
            YSRPs.push(ps);
          } else if (ps.inputType == 11) {
            // 往生者
            // 修改默认数据 兼容老数据
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
          // 添加一个默认的阳上人
          YSRPs.push({
            cid: '',
            dataType: 2,
            describe: '',
            font_length: 8,
            // id: 28519,
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
          // 添加一个默认的往生者
          WSZPs.push({
            cid: '',
            dataType: 2,
            describe: '',
            font_length: 8,
            // id: 28524
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
    // 渲染附言
    showAddition: function(getContent, ifLocalStorage) {
      // 附言
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
        if (Object.prototype.toString.call(inputPrompt) == '[object Array]') {
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
        .hasClass('hide') && $('#addAddition').click(); // 若第一次render公共附言 要移除hide
    },
    // 渲染价格、库存、自动完成订单按钮
    showPrimeSize: function(getContent) {
      var primePrice = getContent.price, // 本地缓存的多金额为val获取值,但是服务器获取的多金额格式为[a,b,c...]
        primeStock = getContent.stock,
        primeIsAutoFinish = getContent.isAutoFinish;
      // 根据获取的数据初始化最外层的Switch插件
      // console.log(getContent)
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
        // 区分服务器和本地数据
        if (primePrice.toString().charAt(0) == '[') {
          // 服务器获取的金额，拆解[]符号后渲染
          primePrice = primePrice.substring(1);
          var priceLen = primePrice.length - 1;
          primePrice = primePrice.substring(0, priceLen);
          $('#suixiInput').val(primePrice); // 正确显示价格
        } else {
          // 本地缓存金额数据直接渲染
          $('#suixiInput').val(primePrice);
        }
        // 区分单多金额,注意将中文逗号转化为英文逗号
        if (
          primePrice.toString().indexOf(',') !== -1 ||
          primePrice.toString().indexOf('，') !== -1
        ) {
          // 多金额显示自动完成按钮
          $('#generateRandom').addClass('hide');
          $('#generateRandom')
            .next()
            .removeClass('hide');
        } else {
          // 单金额，销毁Switch组件，显示自动生成金额
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
    // 渲染checkBox
    inputCheck: function(getContent) {
      $('#operation').val(getContent.opName); //  操作输入框
      // 复制时不复制开始、结束时间
      var $timeStart = $('#timeStart'),
        $timeLimit = $('#timeLimit');
      if (editType != 0) {
        $timeStart.val(getContent.startTime); // 开始时间
        $timeLimit.val(getContent.endTime); // 结束时间
        if (verifyId != 1) {
          // 未审核的进行初始化且可以修改
          $timeStart.datetimepicker('update');
          $timeLimit.datetimepicker('update');
        } else {
          // 已审核的不进行初始化，灰色不可点击
          $timeStart.addClass('c999');
          $timeStart.prop('disabled', true);
          $timeLimit.addClass('c999');
          $timeLimit.prop('disabled', true);
        }
      }
      // 参与者列表
      if (getContent.showClient == 1) {
        $('#showParticipateList').attr('checked', true);
        $('#hideParticipateList').attr('checked', false);
        $('#showParticipateList').click();
      } else {
        $('#showParticipateList').attr('checked', false);
        $('#hideParticipateList').attr('checked', true);
        $('#hideParticipateList').click();
      }
      // 统计区域
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
        // 显示
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
          // 众筹样式
          $targetAmount.val(getContent.targetAmount);
          $summaryAreaSet2.show();
        } else {
          $summaryAreaSet2.hide();
        }
      } else {
        // 不显示
        $showSummary.attr('checked', false);
        $hideSummary.attr('checked', true);
        $summaryAreaTypeContainer.hide();
      }
      // 剩余时间
      if (getContent.showEndTime == 1) {
        $('#showRemainingTime').attr('checked', true);
        $('#hideRemainingTime').attr('checked', false);
        $('#showRemainingTime').click();
      } else {
        $('#showRemainingTime').attr('checked', false);
        $('#hideRemainingTime').attr('checked', true);
        $('#hideRemainingTime').click();
      }
      // 功德证书
      if (getContent.feedbackType != 1) {
        $('#feedback_box')
          .find('[data-index="' + getContent.feedbackType + '"]')
          .click();
      }
    },
    // 渲染是否开启反馈信息
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
    // 渲染打印机状态（即改变按钮的设置与已设置文本）
    setPrinterStatus: function(getContent, ifLocalStorage) {
      var self = this,
        // 无选择项的打印机设置参数：get_external_printers  if_open_printer
        get_external_printers = getContent['printerId'],
        if_open_printer = getContent['isOpenPrinter'],
        get_internal_printer = '';
      // 以下为有选择项（规格）的情况
      if (!get_external_printers) {
        var get_subdivideStr = [];
        if (!ifLocalStorage) {
          get_subdivideStr = getContent['subdivideStr'];
        } else {
          // 读取本地缓存配置
          get_subdivideStr = JSON.parse(getContent['subdivideStr']);
        }
        // 进行覆盖改写，覆盖下方注释掉的代码，以前获取的有规格需要显示的默认打印机不是第一台,而是遍历取得的第一个打印机ID
        var hasSelectPrinterList = []; // 有对应规格的打印机数组
        get_subdivideStr.map(function(value, index, arr) {
          // 点击复制进入 选择项的printer为 ''
          // 点击编辑进入 选择项的printer为 [...]
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

        // $.each(get_subdivideStr, function (index, elem) {
        //     // printerId存在则表示选择项的打印机配置存在，为布尔值
        //     get_internal_printer = elem['printer'][0] && elem['printer'][0]['printerId'];
        //     // 只要存在选择项的打印机配置就跳出
        //     if (get_internal_printer) return false
        // });
        // 不存在则为undefined
        // console.log(get_internal_printer)
        // 存在选择项打印机配置就打印printer_id(设置默认显示的打印机)
        // get_internal_printer && (self.show_printer_id = get_internal_printer);
        self.show_printer_type = 1;
      } else {
        // 无选择项时
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
      // 上述复杂的操作都是为了检测有没有打印机设置，根据有无改变按钮文本，并配置相应的全局变量
      self.show_printer_id && self.change_printer_text('已设置');
    },
    // 改变打印机设置按钮文字
    change_printer_text: function(set_text) {
      $('[data-type="set_print"]').text(set_text);
    },
    // 选择项减少到0和增加到1时间，改变打印机设置按钮文字
    selection_change_printer_text: function(selectionStatus) {
      // selectionStatus 0为选择项减少到0，1为选择项增加到1
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
  }); // View结束

  //选择项附言的model和view
  var sizesAdditionModel = Backbone.Model.extend({
    defaults: {
      subType: '', // 外层附言的种类
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
      font_length: 0, // 心愿字数限制字段
      isVerify: 0, // 手机号码附言 短信是否需要验证字段
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
      self.$el.attr('id', this.model.cid); // $el 表示附言tr
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
          // 修改心愿默认字数限制为200
          self.model.set('font_length', 200);
        } else {
          self.model.set('font_length', 0);
        }
        modelDispose.method.change_prompt_text(e.target.value, self.model);
      });
      if (
        self.model.get('inputType') == 2 ||
        self.model.get('inputType') == 9
      ) {
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
      // 外层选择项种类为祈福3：功德芳名12 心愿15 往生2：阳上人10 往生者11
      // 将特殊类附言移至特殊附言表格
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

  //选择项的model和view
  var SizeModel = Backbone.Model.extend({
    idAttribute: 'p_id',
    defaults: {
      cid: '',
      name: '普通佛事',
      price: '',
      stock: '',
      endTime: '', // 到期时间
      enroll_num: 0, // 参与次数限制
      pic: '',
      id: '',
      printer: [],
      explain: '',
      isSingleMoney: 1, // 添加用于监控是否为单金额的字段，仅影响ui：控制自动生成随喜金额按钮和自动完成订单按钮的显隐
      isAutoFinish: 0, // 多金额的自动完成订单，默认关
      subdivide_type: 1, // 新加规格分类
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
      // 给常用规格加默认标题
      // modelDispose.method.add_default_size_title_prompt_text(my_json, self.model);
      var html = template.render(my_json),
        sizehtml = html.replace(/sizePic0/, 'sizePic' + sizeIteration++),
        selectpicker = self.$el.html(sizehtml).find('.selectpicker');
      // debugger

      // this.$el.html(sizehtml);
      this.$el.attr('id', this.model.cid);
      // 添加下拉菜单开始
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
        // console.log(self.model);
        // console.log(new sizesAdditionCollection([new sizesAdditionModel({}),new sizesAdditionModel({})]));
        // 改变选择项时 修正特殊附言的数据
        var psModelArr = self.model.get('postScript');

        if (!psModelArr) {
          // 无附言切换时
          if (subType === 2) {
            // 往生类 生成默认阳上人往生者数据
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
                subType: 2,
              }),
            ]);
          } else if (subType === 3) {
            // 祈福类 生成默认功德芳名心愿数据
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
                subType: 3,
              }),
            ]);
          } else if (subType === 4) {
            // 快递类 生成默认的 联系人 手机号码 地址
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
                subType: 4,
              }),
            ]);
          }
        } else {
          // 有附言
          // 修改内层数据的subType
          psModelArr.models.map(function(ps) {
            ps.set('subType', parseInt(e.target.value));
          });
          // 置顶特殊附言 并保证至少存在两项
          if (subType === 3) {
            //祈福类
            var FMPs = [],
              XYPs = [],
              otherPs = [];
            psModelArr.models.map(function(ps) {
              if (ps.get('inputType') === 12) {
                // 修改默认值 兼容老数据
                if (ps.get('font_length') === 0) {
                  ps.set('font_length', 8);
                }
                if (ps.get('pic_num') === 0) {
                  ps.set('pic_num', 4);
                }
                FMPs.push(ps);
              } else if (ps.get('inputType') === 15) {
                // 修改默认值 兼容老数据
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
              // 添加一个默认的功德芳名
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
                  subType: 3,
                })
              );
            }
            if (!XYPs.length) {
              // 添加一个默认的心愿
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
                  subType: 3,
                })
              );
            }
            psModelArr.models = FMPs.concat(XYPs, otherPs);
          } else if (subType === 2) {
            // 往生类
            var YSRPs = [],
              WSZPs = [],
              otherPs = [];
            psModelArr.models.map(function(ps) {
              if (ps.get('inputType') === 10) {
                // 修改默认值 兼容老数据
                if (ps.get('font_length') === 0) {
                  ps.set('font_length', 8);
                }
                ps.set('pic_num', 0);
                YSRPs.push(ps);
              } else if (ps.get('inputType') === 11) {
                // 修改默认值 兼容老数据
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
              // 添加一个默认的阳上人
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
                  subType: 2,
                })
              );
            }
            if (!WSZPs.length) {
              // 添加一个默认的往生者
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
                  subType: 2,
                })
              );
            }
            psModelArr.models = YSRPs.concat(WSZPs, otherPs);
          } else if (subType === 4) {
            // 快递类
            var ps4 = [], // 联系人
              ps5 = [], // 电话号码
              ps6 = [], // 地址
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
                  subType: 4,
                })
              );
            }
            psModelArr.models = ps4.concat(ps5, ps6, psOther);
          }
        }
        // console.log(psModelArr.models);
        self.model.set('postScript', psModelArr);
        self.model.set('subdivide_type', subType);
        if (subType === 1) {
          if (pic === wangshengSrc || pic === qifuSrc) {
            self.model.set('pic', '');
          }
        } else if (subType === 2) {
          // 往生 祈福选择项 添加默认图片
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
        } else if (subType === 5) {
          if (pic === wangshengSrc || pic === qifuSrc) {
            self.model.set('pic', '');
          }
        }
        // modelDispose.method.change_size_name(e.target.value, self.model);
      });
      // 添加下拉菜单结束
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
      // 初始化switch控件
      var isAutoFinish = !!this.model.get('isAutoFinish'); // 布尔化参数
      // 每次初始化会触发两次重绘，一次selectinput 的change一次subdivide_type改写触发
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
      // 初始化tooltip
      self.$el.find('[data-ele="tooltip"]').tooltip();
      return this;
    },
  });
  var sizesViewRendering = !1;
  var SizesView = Backbone.View.extend({
    initialize: function() {
      // prompt_text暂时未加
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
        sizeModal.set('cid', sizeModal.cid); // ?? 此处导致死循环 ???
        // sizeModal.set("modelsLength", models.length);
        sizeModal.set('sort', index);
        var sizeView = new SizeView({
          model: sizeModal,
        });
        fragment.appendChild(sizeView.render().el);
      });
      self.$el.html(fragment);
      // $('[data-type="additionInstruction"]').tooltip();

      sizesViewRendering = !1;
    },
  });

  //附言的model和view
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
      font_length: 200, // 心愿字数限制字段
      isVerify: 0, // 手机号码附言 短信是否需要验证字段
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
      // debugger
      /*给常用附言加默认标题*/
      modelDispose.method.add_default_title_prompt_text(my_json, self.model);
      var html = template.render(my_json),
        selectpicker = self.$el.html(html).find('.selectpicker');
      self.$el.attr('id', this.model.cid); // $el 表示附言tr
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
        // 日期类的什么操作？？？
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
          // 修改心愿默认字数限制为200
          self.model.set('font_length', 200);
        } else {
          self.model.set('font_length', 0);
        }
        modelDispose.method.change_prompt_text(e.target.value, self.model);
      });
      if (
        self.model.get('inputType') == 2 ||
        self.model.get('inputType') == 9
      ) {
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
        //                        sizeModal.set("modelsLength", models.length);
        sizeModal.set('sort', index);
        var sizeView = new AdditionView({
          model: sizeModal,
        });
        fragment.appendChild(sizeView.render().el);
      });

      self.$el.html(fragment);
    },
  });

  //实例化View
  var msgListView = new View();

  $(function() {
    // 初始化已存在节点的tooltip
    $('[data-toggle="tooltip"]').tooltip();
    if (!is_test_environment) {
      var inputFoshiTypeId = ceremonyMap.ceremonyTypeId;
      // 如果不存在ceremonyMap 说明不是编辑佛事，直接返回
      if (typeof inputFoshiTypeId === 'undefined') return false;
      console.log(ceremonyMap);
      // debugger
      // 获取佛事信息，执行渲染函数
      // 渲染佛事标题
      $('#proName').val(ceremonyMap.title);
      // 标题的参加人数开关
      $('#show-join-num').bootstrapSwitch(
        'state',
        !!ceremonyMap.allow_showVistNum
      );
      // 渲染佛事封面
      msgListView.showimgs(ceremonyMap);
      // 渲染简介
      $('#summary').val(ceremonyMap.custom_introduce);
      $('#summary').trigger('keyup');
      // 渲染佛事编辑器
      msgListView.showDetail(ceremonyMap);
      // 包装好打印机数据
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
      // 判断是否有规格
      if (typeof ceremonyMap.subdivideStr !== 'undefined') {
        msgListView.showSizes(ceremonyMap);
      } else {
        msgListView.showPrimeSize(ceremonyMap);
      }
      // 渲染附言
      msgListView.showAddition(ceremonyMap);
      // 渲染参与者列表、统计区域等input
      msgListView.inputCheck(ceremonyMap);
      // 渲染打印机状态
      msgListView.setPrinterStatus(ceremonyMap);
      // 是否开启反馈信息
      msgListView.setIfOpenFeedback(ceremonyMap);
    }
    /*等待渲染完成，判断是否隐藏添加封面上传按钮*/
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
});
