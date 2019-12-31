import $ from 'jquery';
import Toast from 'old/toast';
import config from './config';
import 'old/bootstrap-select.min';
import 'old/backbone';
import juicer from 'juicer';
$.ajaxSetup({
  cache: false,
});
var if_first_init = true,
  activityId;
var View = Backbone.View.extend({
  el: 'body',
  getNumber: null,
  events: {
    'click ': 'elClick',
    'click .action': 'action',
    'click .mask ': 'selected',
    'click .maskDown ': 'selected2',
    'click #sureAddLabel': 'sureAddLabel',
    'click #addNewLabel': 'addNewLabel',
    'click .pop-container': 'batchOperation',
    'click .rename': 'rename',
    'click #clear': 'clear',
    'click #query': 'query',
    'click .addLabel': 'addLabel',
    'click .del': 'delLabel',
    'click #exportExcel': 'exportExcel',
    'click #sureBatchDelVol': 'delVolunteer',
    'click .search-icon': 'search',
    'click .cancelDel': 'cancelDel',
    'click .sureDelVolBtn': 'sureDelVol',
    'click .volGroupPanel': 'UserInfoRedirect',
    'click .labelSingle': 'labelSingle',
    'click #sureAddGrouping': 'sureAddGrouping',
    'click .dels': 'beforeBatchDelVol',
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
  beforeBatchDelVol: function() {
    var self = this,
      ids = self.selectedVolunteerIds();
    if (ids.length > 0) {
      $('#batchDelVolModal').modal('show');
    } else {
      Toast('请选择要删除的义工', 2);
    }
  },
  labelSingle: function(e) {
    e.stopPropagation();
    $('#groupingModal').modal('show');
    var $currentTar = $(e.currentTarget),
      $tar = $(e.target),
      labelTags = $currentTar.find('[data-type="tags"]'),
      labelIds = [];
    for (i = 0; i < labelTags.length; i++) {
      labelIds.push(labelTags.eq(i).attr('data-id'));
    }
    var inputLabel = $('.js_tag_putOn_tags input'),
      labelArrLen = labelIds.length;
    inputLabel.each(function(index, DOM) {
      var Labelvalue = $(DOM).attr('name');
      for (var i = 0; i < labelArrLen; i++) {
        if (Labelvalue == labelIds[i]) {
          $(DOM).prop('checked', true);
          return;
        } else {
          $(DOM).prop('checked', false);
        }
      }
    });
    var userId = $currentTar.attr('data-id');
    $('#sureAddGrouping').attr('data-id', userId);
  },
  sureDelVol: function(e) {
    e.stopPropagation();
    var self = this,
      $tar = $(e.target),
      delItemId = [];
    delItemId[0] = Number($tar.parents('.weChat-msg-del-box').attr('data-id'));
    var opt = {};
    opt['volunteerId'] = delItemId;
    opt = JSON.stringify(opt);
    if (!delItemId) {
      Toast('ID不存在', 2);
    } else {
      $.ajax({
        url: '/zzhadmin/delVolunteer/',
        data: opt,
        type: 'POST',
        dataType: 'json',
        success: function(msg) {
          Toast(msg.msg);
          self.query();
        },
        error: function(msg) {
          Toast('网络服务出错,请稍后重试');
        },
      });
    }
  },
  search: function() {
    var self = this,
      searchItem = $('#search').val(),
      opt = {};
    opt['pageNumber'] = 0;
    opt['pageSize'] = self.getNumber;
    opt['sex'] = $('#sex')
      .prev()
      .find('.selected')
      .attr('data-original-index');
    opt['from_age'] = $('#from_age').val();
    opt['to_age'] = $('#to_age').val();
    opt['start'] = $('#beginDate').val();
    opt['end'] = $('#endDate').val();
    opt['searchContent'] = $('#search').val();
    opt['activityId'] = activityId;
    var tagId = $('#label').val();
    opt['tagId'] = tagId;
    if (opt['sex'] == 1) {
      opt['sex'] = '男';
    } else if (opt['sex'] == '2') {
      opt['sex'] = '女';
    } else {
      delete opt['sex'];
    }
    if (searchItem == '') {
      Toast('请输入要搜索的内容', 2);
    } else {
      $.ajax({
        url: '/zzhadmin/getVolunteerList/',
        data: opt,
        type: 'get',
        beforeSend: function() {
          $('.masker').show();
        },
        complete: function() {
          $('.masker').hide();
        },
        success: function(data) {
          if (data['result'] >= 0) {
            var labelName = $('#label').selectpicker('val'),
              label = $('.label-group button.selectpicker').attr('title');
            $('.volGroupTitle')
              .attr('data-id', labelName)
              .text(label);
            $('[data-type="volunteerAmount"]').text('共' + data.total + '人');
            self.displayOperationPanle();
            var template = juicer(
                config.template.component.volunteer_panel_temp
              ),
              opt = {};
            opt['data'] = data.data;
            var HTMLtemplate = template.render(opt);
            $('.volGroupWarp').html(HTMLtemplate);
            self.delVolPopStart();
            var firstSize = self.getNumber + 0.1,
              pageSize = 3,
              count = Math.floor(firstSize / pageSize),
              pageNum = data.pageNumber,
              dataLen = data.data.length;
            self.scroll2getData(count, pageNum, dataLen);
          }
          if (pageNum < 0 && (dataLen = 0)) {
            $('.volGroupWarp').html(
              '<div class="nothingFound"> <span class="icon bell_icon"></span><span class="nothingTips">抱歉，没有找到相关信息</span> </div>'
            );
          }
        },
        error: function() {
          Toast('网络服务失败，搜索失败', 0);
        },
      });
    }
  },
  UserInfoRedirect: function(e) {
    var $tar = $(e.currentTarget),
      id = $tar.attr('data-id'),
      target = e.target,
      labelTar = $(target).parents('.labelSingle');
    if (
      target.className != 'mask' &&
      target.className != 'maskDown' &&
      target.className != 'del-icon' &&
      target.className != 'labelSingle' &&
      !labelTar.length
    ) {
      window.open(
        '/zzhadmin/volunteer_loggingData/?activityId=' +
          activityId +
          '&volunteerId=' +
          id
      );
    }
  },
  tagAllCondition: function() {
    var labelName = $('.volGroupTitle').attr('data-id'),
      defaultHtml = $('.volGroupTitle').html();
    return labelName == '全部义工' || defaultHtml == '全部义工';
  },
  displayOperationPanle: function() {
    var self = this,
      status = ['none', 'block'];
    if (self.tagAllCondition()) {
      status = status[0];
    } else {
      status = status[1];
    }
    $('.labelOperation').css('display', status);
  },
  delVolunteer: function() {
    var self = this,
      ids = self.selectedVolunteerIds(),
      opt = {};
    opt['volunteerId'] = ids;
    opt = JSON.stringify(opt);
    if (ids) {
      $.ajax({
        type: 'POST',
        url: '/zzhadmin/delVolunteer/',
        data: opt,
        success: function(msg) {
          $('#batchDelVolModal').modal('hide');
          self.queryVolenteer(3);
          Toast('义工删除成功！');
          $('#batchOperation').popover('hide');
          $('.action')
            .removeClass('backgroundGreen')
            .removeClass('white');
        },
        error: function(msg) {
          Toast('网络服务出错，删除义工失败', 0);
        },
      });
    } else {
      Toast('请选择要删除的义工', 2);
    }
  },
  delLabel: function() {
    var self = this,
      labelId = $('.volGroupTitle').attr('data-id');
    $('.cancelDel')
      .unbind('click')
      .click(function() {
        $('.del').popover('hide');
      });
    $('.sureDelBtn')
      .unbind('click')
      .click(function() {
        if (self.tagAllCondition()) {
          Toast('"全部义工"标签不能被删除，请选择分组标签', 2);
        } else {
          $.ajax({
            url: '/zzhadmin/delTag/',
            type: 'POST',
            dataType: 'JSON',
            data: {
              id: labelId,
            },
            success: function() {
              Toast('标签已删除成功');
              $('.del').popover('hide');
              setTimeout(function() {
                self.loadSelectData();
                self.query();
              }, 800);
            },
            beforeSend: function() {
              $('.masker').show();
            },
            complete: function() {
              $('.masker').hide();
            },
            error: function() {
              Toast('网络服务出错，删除失败', 0);
            },
          });
        }
      });
  },
  exportExcel: function() {
    let searchContent = $('#search').val();
    let tagId = $('#label').val();
    let fromAge = $('#from_age').val();
    let toAge = $('#to_age').val();
    let start = $('#beginDate').val();
    let end = $('#endDate').val();
    let sexValue = $('#sex')
      .prev()
      .find('.selected')
      .attr('data-original-index');
    let sex;
    if (sexValue == '1') {
      sex = '男';
    } else if (sexValue == '2') {
      sex = '女';
    }
    let url =
      `/zzhadmin/downloadVolunteerList?from_age=${fromAge}&to_age=${toAge}` +
      `&start=${start}&end=${end}&searchContent=${searchContent}&activityId=${activityId}` +
      `&tagId=${tagId}${sex ? `&sex=${sex}` : ''}`;
    console.log(url);
    window.open(url);
  },
  selectedVolunteerIds: function() {
    var Item = $('.mask.selected');
    var selectedVolunteerId = [];
    Item.each(function(index, Dom) {
      selectedVolunteerId[index] = Number($(Dom).attr('data-id'));
      if (!selectedVolunteerId[index]) {
        alert('data-id null error');
      }
    });
    return selectedVolunteerId;
  },
  addLabel: function() {
    var self = this,
      labelSize = $('#label').find('option').length,
      selectedItemLength = $('.mask.selected').length;
    if (selectedItemLength == 0) {
      Toast('您还未选中任何卡片，请先选择', 2);
    } else if (labelSize == 1) {
      $('.newLabelChange').text('您还没有创建标签');
      $('#newModal').modal();
    } else {
      $('#groupingModal').modal();
    }
  },
  elClick: function(e) {
    var $tar1 = $(e.target).parents('.labelOperation'),
      $tar2 = $(e.target).parents('.popover '),
      $tar3 = $(e.target).parents('#batchOperation '),
      $tar4 = $(e.target).parents('.weChat-msg-del-box ');
    if (!$tar1.length && !$tar2.length && !$tar3.length && !$tar4.length) {
      $('.rename').popover('hide');
      $('#batchOperation').popover('hide');
      $('.del').popover('hide');
      $('.del-icon').popover('hide');
      $('.action')
        .removeClass('backgroundGreen')
        .removeClass('white');
    }
  },
  loadSelectData: function() {
    var self = this;
    $.ajax({
      type: 'get',
      url: '/zzhadmin/tagList/',
      data: {},
      success: function(msg) {
        if (msg['result'] >= 0) {
          var groups = msg['data'];
          if (groups) {
            var group_str = '<option value="0">全部义工</option>';
            for (var i = 0; i < groups.length; i++) {
              group_str +=
                '<option value="' +
                groups[i]['id'] +
                '">' +
                groups[i]['name'] +
                '</option>';
            }
            $('#label').html(group_str);
            $('#label').selectpicker('refresh');
          }
          if_first_init && self.first_init();
        }
      },
      error: function(msg) {
        Toast('网络服务失败，' + msg['message'], 0);
      },
    });
  },
  first_init: function() {
    var self = this;
    var url = window.location.search.substr(1);
    if (url.indexOf('signup_way') >= 0) {
      self.queryVolenteer(2);
    } else {
      self.queryVolenteer();
    }
    $(document).keydown(function(event) {
      if (event.keyCode == 13) {
        $('#query').focus();
        self.queryVolenteer();
      }
    });
    self.popoverStart();
    self.displayOperationPanle();
    $('.rename').on('shown.bs.popover', function() {
      $('.errorTips').css('display', 'none');
    });
    $('#groupingModal').on('show.bs.modal', function(e) {
      $('#batchOperation').popover('hide');
      var labelGroup = $('#label option'),
        groupLabel = {};
      labelGroup.each(function(index, DomEle) {
        var id = $(DomEle).val(),
          name = $(DomEle).text();
        if (id == '0') {
        } else {
          groupLabel['label' + index] = {
            id: id,
            name: name,
          };
        }
      });
      $('#newModal').on('show.bs.modal', function(e) {
        $('.errorTips').css('display', 'none');
        $('.newLabelChange').text('创建新标签');
        $('#groupingModal').modal('hide');
      });
      var template = juicer(config.template.component.labelGroupTemp),
        opt = {};
      opt['list'] = groupLabel;
      var HTMLtemplate = template.render(opt);
      $('.js_tag_putOn_tags').html(HTMLtemplate);
      $('#sureAddGrouping').attr('data-id', '-1');
    });
    $('#loading-toast').addClass('hide');
    if_first_init = false;
  },
  requireGroupList: function() {
    $.ajax({
      type: 'GET',
      url: '/zzhadmin/volunteer_getGroupDetail/',
      dataType: 'JSON',
      success: function(data) {
        $('#labelGroup').html('');
        var groups = data.list;
        for (var i = 0; i < groups.length; i++) {
          var dom2 = $(
            ' <li><span>' +
              groups[i].name +
              " </span><span class='label label-success backgroundGreen groupCnt'>" +
              groups[i].cnt +
              '</span></li>'
          );
          $('#labelGroup').append(dom2);
        }
        $('#labelGroup').selectpicker('refresh');
      },
      error: function() {
        Toast('网络服务出错，请稍后再试', 2);
      },
    });
  },
  editTitleContent: function(img_id, img_name) {
    $('#InputEdit')
      .attr('value', img_name)
      .attr('data-id', img_id);
  },
  rename: function(e) {
    var me = this,
      labelName = $('.volGroupTitle').attr('data-id'),
      label = $('.volGroupTitle').text();
    me.editTitleContent(labelName, label);
    $('.cancelRename')
      .unbind('click')
      .click(function() {
        $('.rename').popover('hide');
      });
    $('.sureRenameBtn')
      .unbind('click')
      .click(function() {
        var newLabelName = $('#InputEdit').val();
        if (newLabelName == '' || newLabelName.length < 2) {
          $('.errorTips').css('display', 'block');
        } else {
          $('.errorTips').css('display', 'none');
          $.ajax({
            url: '/zzhadmin/renameTag/',
            type: 'POST',
            dataType: 'JSON',
            data: {
              id: labelName,
              name: newLabelName,
            },
            success: function(data) {
              if (data.result >= 0) {
                me.loadSelectData();
                $('.volGroupTitle')
                  .attr('data-id', labelName)
                  .text(newLabelName);
                $('.rename').popover('hide');
                $('#label').selectpicker('val', labelName);
                me.query();
              } else {
                Toast(data.message);
              }
            },
            beforeSend: function() {
              $('.masker').show();
            },
            complete: function() {
              $('.masker').hide();
            },
            error: function() {
              Toast('网络服务出错，重命名失败', 2);
            },
          });
        }
      });
  },
  batchOperation: function(e) {
    var $tar = $(e.target);
    if ($tar.hasClass('selectAll')) {
      $tar.toggleClass('active1');
    }
    if ($tar.hasClass('selectAll')) {
      $('.mask').toggleClass('selected');
    }
    if ($tar.hasClass('clearSelect')) {
      $('.mask').removeClass('selected');
    }
    if ($tar.hasClass('dels')) {
    }
  },
  addNewLabel: function() {
    $('#newModal').on('show.bs.modal', function(e) {
      $('.errorTips').css('display', 'none');
      $('.newLabelChange').text('创建新标签');
      $('#labelName').val('');
    });
  },
  sureAddLabel: function() {
    var labelName = $('#labelName').val(),
      self = this;
    if (labelName.length < 2) {
      $('.errorTips').css('display', 'block');
    } else {
      $('.errorTips').css('display', 'none');
      $.ajax({
        type: 'POST',
        url: '/zzhadmin/addTag/',
        data: {
          name: labelName,
        },
        success: function(msg) {
          Toast(msg['msg']);
          if (msg['result'] >= 0) {
            var id = msg['data']['id'],
              str = '<option value="' + id + '">' + labelName + '</option>';
            $('#label').append(str);
            $('#label').selectpicker('refresh');
            $('#newModal').modal('hide');
          }
        },
        error: function(msg) {
          Toast('网络服务出错，请稍后再试', 0);
        },
      });
    }
  },
  selected: function(e) {
    var $tar = $(e.currentTarget);
    $tar
      .parents('.jsMaskWrp')
      .find('.mask')
      .toggleClass('selected');
  },
  selected2: function(e) {
    var $tar = $(e.currentTarget);
    $tar
      .parents('.jsMaskWrp')
      .find('.mask')
      .toggleClass('selected');
  },
  action: function(e) {
    var $tar = $(e.currentTarget);
    $('.action')
      .removeClass('backgroundGreen')
      .removeClass('white');
    $tar.addClass('backgroundGreen').addClass('white');
  },
  queryVolenteer: function(signup_way) {
    var self = this;
    if (document.body.clientWidth < 1400) {
      var conWidth = 930;
    } else if (document.body.clientWidth < 1682) {
      var conWidth = 1230;
    } else {
      var conWidth = 1530;
    }
    if (signup_way == 3) {
      var conHeight = $('.leftBox').height();
    } else {
      var conHeight = Math.abs(
        $(window).height() - $('.leftBox').height() - $('.leftBox').offset().top
      );
    }
    var perWidth = 300,
      perHeight = 110,
      colNumber = Math.floor(conWidth / perWidth),
      rowNumber = Math.floor(conHeight / perHeight);
    self.getNumber = colNumber * (rowNumber + 1);
    var opt = {};
    opt['pageNumber'] = 0;
    opt['pageSize'] = self.getNumber;
    opt['sex'] = $('#sex')
      .prev()
      .find('.selected')
      .attr('data-original-index');
    opt['from_age'] = $('#from_age').val();
    opt['to_age'] = $('#to_age').val();
    opt['start'] = $('#beginDate').val();
    opt['end'] = $('#endDate').val();
    opt['searchContent'] = $('#search').val();
    opt['activityId'] = activityId;
    var tagId = $('#label').val();
    opt['tagId'] = tagId;
    if (opt['sex'] == 1) {
      opt['sex'] = '男';
    } else if (opt['sex'] == '2') {
      opt['sex'] = '女';
    } else {
      delete opt['sex'];
    }
    $.ajax({
      type: 'get',
      data: opt,
      url: '/zzhadmin/getVolunteerList/',
      success: function(data) {
        var template = juicer(config.template.component.volunteer_panel_temp),
          opt = {};
        opt['data'] = data.data;
        var HTMLtemplate = template.render(opt);
        $('.volGroupWarp').html(HTMLtemplate);
        $('[data-type="volunteerAmount"]').text('共' + data.total + '人');
        self.delVolPopStart();
        var firstSize = self.getNumber + 0.1,
          pageSize = 3,
          count = Math.floor(firstSize / pageSize),
          pageNum = data.pageNumber,
          dataLen = data.data.length;
        self.scroll2getData(count, pageNum, dataLen);
        if (pageNum < 0 && (dataLen = 0)) {
          $('.volGroupWarp').html(
            '<div class="nothingFound"> <span class="icon bell_icon"></span><span class="nothingTips">抱歉，没有找到相关信息</span> </div>'
          );
        }
      },
      beforeSend: function() {
        $('.masker').show();
      },
      complete: function() {
        $('.masker').hide();
      },
      error: function() {
        Toast('网络服务出错，请稍后再试', 0);
      },
    });
  },
  checkScrollSide: function() {
    var $aPin = $('.volGroupWarp>.volGroupPanel'),
      lastPinH =
        $aPin.last().offset().top + Math.floor($aPin.last().height() / 2),
      documentH = $(window).height();
    return lastPinH < documentH ? true : false;
  },
  popoverStart: function() {
    $('#batchOperation')
      .popover({
        html: true,
        trigger: 'manual',
        content: $('.popover-content1').html(),
        placement: 'top',
      })
      .click(function() {
        $(this).popover('show');
        $('.rename').popover('hide');
        $('.del').popover('hide');
      });
    console.log('初始化成功');
    $('.rename')
      .popover({
        html: true,
        trigger: 'manual',
        title: '标签名称',
        content: $('.popover-content2').html(),
        placement: 'bottom',
      })
      .click(function() {
        $(this).popover('show');
        $('#batchOperation').popover('hide');
        $('.del').popover('hide');
      });
    $('.del')
      .popover({
        html: true,
        trigger: 'manual',
        content: $('.popover-content3').html(),
        placement: 'bottom',
      })
      .click(function() {
        $(this).popover('show');
        $('.del-icon').popover('hide');
        $('.rename').popover('hide');
        $('#batchOperation').popover('hide');
      });
  },
  msieConflict: function() {
    jQuery.browser = {};
    (function() {
      jQuery.browser.msie = false;
      jQuery.browser.version = 0;
      if (navigator.userAgent.match(/MSIE ([0-9]+)./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
      }
    })();
  },
  initialize: function(e) {
    var self = this,
      UrlSearch = new self.UrlSearch();
    console.log('manageType is ' + window.manageType);
    self.msieConflict();
    var title = decodeURI(UrlSearch.title);
    activityId = parseInt(UrlSearch.activityId);
    $('[data-id="titleName"]').text(title);
    $('#recordData').prop(
      'href',
      '/zzhadmin/volunteer_loggingData/?activityId=' + activityId
    );
    if (window.manageType !== 1) {
      $('#addNewLabel').addClass('hide');
      $('.labelOperation').addClass('hide');
      $('#newLabel').addClass('hide');
    }
    $('#from_age').bind('click blur', function() {
      var val = parseInt($(this).val()),
        bigVal = parseInt($('#to_age').val());
      if (val < 0) {
        Toast('年龄不能小于0', 2);
        $(this).val(0);
      } else if (val > bigVal || isNaN(bigVal)) {
        $('#to_age').val(val);
      } else if (isNaN(val)) {
        $('#from_age').val(bigVal);
      }
    });
    $('#to_age').bind('click blur', function() {
      var val = parseInt($(this).val());
      var smallVal = parseInt($('#from_age').val());
      if (smallVal >= 0 && smallVal <= val) {
      } else if (val == 1) {
        $('#from_age').val(0);
      } else if (isNaN(val)) {
        $('#to_age').val(smallVal);
      } else {
        $('#from_age').val(val);
      }
      if (val < 0) {
        Toast('年龄不能小于0', 2);
        $(this).val(0);
        $('#from_age').val(0);
      }
    });
    $('.selectpicker').selectpicker({});
    $('.input-daterange').datepicker({
      keyboardNavigation: false,
      language: 'zh-CN',
      todayHighlight: true,
      forceParse: false,
      autoclose: true,
      clearBtn: false,
      format: 'yyyy-mm-dd',
      endDate: new Date(),
    });
    self.loadSelectData();
  },
  sureAddGrouping: function(e) {
    var self = this,
      ids = self.selectedVolunteerIds(),
      userId = $(e.currentTarget).attr('data-id'),
      selectedIDs = null,
      url = '',
      checkedGroups = $(".js_tag_putOn_tags input[type='checkbox']:checked"),
      slectedID = [],
      checkID = [];
    checkedGroups.each(function(index, Dom) {
      var id = parseInt($(Dom).attr('name'));
      slectedID[index] = id;
    });
    var opt = {};
    opt['tagIds'] = slectedID;
    if (userId === '-1') {
      url = '/zzhadmin/addTagUser/';
      opt['volunteerIds'] = ids;
    } else {
      url = '/zzhadmin/addTagOneUser/';
      opt['volunteerId'] = userId;
    }
    $.ajax({
      type: 'POST',
      url: url,
      data: opt,
      dataType: 'JSON',
      success: function(msg) {
        $('#groupingModal').modal('hide');
        Toast('标签信息更新成功！');
        self.query();
      },
      error: function(msg) {
        Toast('网络服务出错，添加标签失败！', 0);
      },
      beforeSend: function() {
        $('.masker').show();
      },
      complete: function() {
        $('.masker').hide();
      },
    });
  },
  clear: function(e) {
    var self = this;
    $('.input.form-control').val('');
    $('#label').selectpicker('val', '-1');
    $('#label').selectpicker('refresh');
    $('#sex').selectpicker('val', '-1');
    $('#sex').selectpicker('refresh');
    $('#inherit').selectpicker('val', '-1');
    $('#inherit').selectpicker('refresh');
    $('#educationLevel').selectpicker('val', '-1');
    $('#educationLevel').selectpicker('refresh');
    $('#origin').selectpicker('val', '-1');
    $('#origin').selectpicker('refresh');
    self.query();
  },
  delVolPopStart: function() {
    $('.del-icon')
      .popover({
        html: true,
        trigger: 'manual',
        content: $('.popover-content4').html(),
        placement: 'bottom',
      })
      .click(function() {
        $(this).popover('show');
        $('.del-icon')
          .not(this)
          .popover('hide');
        $('.rename').popover('hide');
        $('#batchOperation').popover('hide');
      });
  },
  cancelDel: function(e) {
    e.stopPropagation();
    $('.del-icon').popover('hide');
  },
  scroll2getData: function(count, pageNum, dataLen) {
    var self = this,
      scrollStatus = true;
    function scrollData() {
      var winH = $(window).height(),
        pageH = $(document.body).height(),
        scrollT = document.documentElement.scrollTop || document.body.scrollTop,
        aa = (pageH - winH - scrollT) / winH;
      if (aa < 0.25) {
        if (document.body.clientWidth < 1400) {
          var conWidth = 930;
        } else if (document.body.clientWidth < 1682) {
          var conWidth = 1230;
        } else {
          var conWidth = 1530;
        }
        var perWidth = 300,
          colNumber = Math.floor(conWidth / perWidth);
        if (pageNum > 0 || dataLen > 0) {
          var opt = {};
          opt['pageNumber'] = count;
          opt['pageSize'] = colNumber;
          opt['sex'] = $('#sex')
            .prev()
            .find('.selected')
            .attr('data-original-index');
          opt['from_age'] = $('#from_age').val();
          opt['to_age'] = $('#to_age').val();
          opt['start'] = $('#beginDate').val();
          opt['end'] = $('#endDate').val();
          opt['searchContent'] = $('#search').val();
          opt['activityId'] = activityId;
          var tagId = $('#label').val();
          opt['tagId'] = tagId;
          if (opt['sex'] == 1) {
            opt['sex'] = '男';
          } else if (opt['sex'] == '2') {
            opt['sex'] = '女';
          } else {
            delete opt['sex'];
          }
          $.ajax({
            type: 'get',
            url: '/zzhadmin/getVolunteerList/',
            data: opt,
            async: false,
            success: function(data) {
              if (data.data) {
                var template = juicer(
                    config.template.component.volunteer_panel_temp
                  ),
                  opt = {};
                opt['data'] = data.data;
                var HTMLtemplate = template.render(opt);
                $('.volGroupWarp').append(HTMLtemplate);
                $('[data-type="volunteerAmount"]').text(
                  '共' + data.total + '人'
                );
                pageNum = data.pageNumber;
                dataLen = data.data.length;
              } else {
                Toast('已到最后', 2);
              }
              self.delVolPopStart();
            },
            error: function() {},
          });
          count++;
          if (pageNum < 0) {
            setTimeout(function() {
              Toast('已到最后！', 2);
            }, 1000);
          }
        }
      }
      scrollStatus = true;
    }
    $(window).bind('scroll', function() {
      if (scrollStatus) {
        setTimeout(scrollData, 100);
        scrollStatus = false;
      } else {
      }
    });
  },
  query: function() {
    var self = this,
      opt = {};
    opt['pageNumber'] = 0;
    opt['pageSize'] = self.getNumber;
    opt['sex'] = $('#sex')
      .prev()
      .find('.selected')
      .attr('data-original-index');
    opt['from_age'] = $('#from_age').val();
    opt['to_age'] = $('#to_age').val();
    opt['start'] = $('#beginDate').val();
    opt['end'] = $('#endDate').val();
    opt['searchContent'] = $('#search').val();
    opt['activityId'] = activityId;
    var tagId = $('#label').val();
    opt['tagId'] = tagId;
    if (opt['sex'] == 1) {
      opt['sex'] = '男';
    } else if (opt['sex'] == '2') {
      opt['sex'] = '女';
    } else {
      delete opt['sex'];
    }
    $.ajax({
      type: 'get',
      url: '/zzhadmin/getVolunteerList/',
      data: opt,
      success: function(data) {
        if (data['result'] >= 0) {
          var labelName = $('#label')
              .prev()
              .find('.selected')
              .find('.text')[0].innerText,
            label = $('#label').val();
          $('.volGroupTitle')
            .attr('data-id', label)
            .text(labelName);
          $('[data-type="volunteerAmount"]').text('共' + data.total + '人');
          self.displayOperationPanle();
          var template = juicer(config.template.component.volunteer_panel_temp),
            opt = {};
          opt['data'] = data.data;
          var HTMLtemplate = template.render(opt);
          $('.volGroupWarp').html(HTMLtemplate);
          self.delVolPopStart();
          var firstSize = self.getNumber + 0.1,
            pageSize = 3,
            count = Math.floor(firstSize / pageSize),
            pageNum = data.pageNumber,
            dataLen = data.data.length;
          self.scroll2getData(count, pageNum, dataLen);
        }
        if (pageNum < 0 && (dataLen = 0)) {
          $('.volGroupWarp').html(
            '<div class="nothingFound"> <span class="icon bell_icon"></span><span class="nothingTips">抱歉，没有找到相关信息</span> </div>'
          );
        }
      },
      error: function(msg) {
        Toast('网络服务出错，请稍后再试', 2);
      },
      beforeSend: function() {
        $('.masker').show();
      },
      complete: function() {
        $('.masker').hide();
      },
    });
    return false;
  },
});
var msgListView = new View();
