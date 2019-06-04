/**
 * Created by Linfe on 2017/4/1.
 */
define([
  'jquery',
  'old/toast',
  './config',
  'old/bootstrap-select.min',
  'old/backbone',
  'juicer',
], function($, Toast, config) {
  $.ajaxSetup({
    cache: false,
  });
  var if_first_init = true,
    activityId;
  var View = Backbone.View.extend({
    el: 'body',
    getNumber: null,
    events: {
      'click ': 'elClick', // el 内点击事件
      'click .action': 'action', // 点击新建标签、批量操作等右上角操作
      'click .mask ': 'selected', // 点击每个义工右上角mask
      'click .maskDown ': 'selected2', // 点击每个义工右上角maskDown
      'click #sureAddLabel': 'sureAddLabel', // 确定添加标签
      'click #addNewLabel': 'addNewLabel', // 点击添加新标签
      'click .pop-container': 'batchOperation', // 点击批量操作中的按钮
      'click .rename': 'rename', //点击重命名标签
      'click #clear': 'clear', // 重置筛选
      'click #query': 'query', // 点击筛选
      'click .addLabel': 'addLabel', // 点击加标签
      'click .del': 'delLabel', // 点击删除标签
      'click #exportExcel': 'exportExcel', // 点击导出Excel
      'click #sureBatchDelVol': 'delVolunteer', // 点击删除义工按钮
      'click .search-icon': 'search', // 点击问号查询图标
      'click .cancelDel': 'cancelDel', // 点击取消删除标签
      'click .sureDelVolBtn': 'sureDelVol', // 点击确认删除义工
      'click .volGroupPanel': 'UserInfoRedirect', // 点击义工跳转页面
      'click .labelSingle': 'labelSingle', // 点击义工信息的标签，编辑它的标签
      'click #sureAddGrouping': 'sureAddGrouping', // 确定更改义工的标签设置
      'click .dels': 'beforeBatchDelVol', // 点击批量操作中的删除
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
      //增删个人标签初模态框始化
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
      //给确定按钮加上id，表示单个用户
      var userId = $currentTar.attr('data-id');
      $('#sureAddGrouping').attr('data-id', userId);
    },
    sureDelVol: function(e) {
      e.stopPropagation();
      var self = this,
        $tar = $(e.target),
        delItemId = [];
      delItemId[0] = Number(
        $tar.parents('.weChat-msg-del-box').attr('data-id')
      );
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
      /*if(tagId==="1"){
             opt['tagId'] = 0;
             } else {
             opt['tagId'] = tagId;
             }*/
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
      //  alert(labelSize);
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
      //如果点击的不是或popover，则隐藏popover
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
        // async: false,
        data: {},
        success: function(msg) {
          if (msg['result'] >= 0) {
            //标签
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
      self.mmymytop();
      //判断是不是首页跳转过来了的
      var url = window.location.search.substr(1);
      if (url.indexOf('signup_way') >= 0) {
        self.queryVolenteer(2);
      } else {
        self.queryVolenteer();
      }
      //回车键绑定搜索
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
        //console.log(groupLabel);
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
            //添加到标签组select
            if (msg['result'] >= 0) {
              var id = msg['data']['id'],
                str = '<option value="' + id + '">' + labelName + '</option>';
              $('#label').append(str);
              $('#label').selectpicker('refresh');
              $('#newModal').modal('hide');
              //                                    self.requireGroupList();
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
          $(window).height() -
            $('.leftBox').height() -
            $('.leftBox').offset().top
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
        // async: false,
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
            count = Math.floor(firstSize / pageSize), // 从服务器获取页面时，页数为0-x，按照三个一页对应请求的页数
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
          $aPin.last().offset().top + Math.floor($aPin.last().height() / 2), //创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
        documentH = $(window).height(); //页面高度
      return lastPinH < documentH ? true : false; //到达指定高度后 返回true，触发waterfall()函数
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
      // 获取地址参数，修改导航标题文字
      var title = decodeURI(UrlSearch.title);
      activityId = parseInt(UrlSearch.activityId);
      // 修改面包屑导航描述文字
      $('[data-id="titleName"]').text(title);
      // 修改自录数据的href
      $('#recordData').prop(
        'href',
        '/zzhadmin/volunteer_loggingData/?activityId=' + activityId
      );
      //年龄优化
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
          // 删除值
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
      //        多选框配置
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
      // 以前代码
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
    //reset清空
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
      //图片删除初始化
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
        var winH = $(window).height(), //页面可视区域高度
          pageH = $(document.body).height(),
          scrollT =
            document.documentElement.scrollTop || document.body.scrollTop, //滚动条top
          aa = (pageH - winH - scrollT) / winH;
        if (aa < 0.25) {
          //0.02是个参数
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
            //随着滚动条发送请求
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
                //count--;
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
    //query搜素
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
        // async: false,
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
    //回到顶部
    mmymytop: function() {
      var imumayitop = eval(
        (function(p, a, c, k, e, r) {
          e = function(c) {
            return (
              (c < a ? '' : e(parseInt(c / a))) +
              ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
            );
          };

          while (c--)
            if (k[c])
              p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
          return p;
        })(
          '8 Z={1v:!!(9.1w&&!9.x),1x:!!9.x,1y:y.z.J("1z/")>-1,10:y.z.J("10")>-1&&y.z.J("1A")==-1,11:!!y.z.1B(/1C.*1D.*1E/)};8 K=Z.11;8 k=d;8 l;4($.q.L){l=0}e{l=M}8 1F=(l==0)?0:1G;8 g=d;8 1H=d;8 12=13 14();6 1I(a){15=13 14();N=(15.16()-12.16());4(17){O=(a)?a+" ":"";O+=(N<1J)?"1K =>":"1L 1M =>";17.1N((O+N))}}4(K){$("#18").m({1O:"1P"});$("#18").m({"1Q-1R":"1S"})}6 19(b,a){r=b.1a("/");r=r[r.P-1].1a(".");1b=r[0]+a;Q 1b}6 1T(a){a="#"+a;$(a)[0].1c=1U+19($(a)[0].1c,".1V")}6 1d(){8 b=0,a=0;4(1W(9.1e)=="1X"){a=9.1e;b=9.1Y}e{4(c.h&&(c.h.A||c.h.7)){a=c.h.7;b=c.h.A}e{4(c.n&&(c.n.A||c.n.7)){a=c.n.7;b=c.n.A}}}Q a}6 1f(a){R=0;1Z(a){20"S":R=0;1g}B=$.q.x?$("s"):$("s, h");B.T({7:R},"1h")}8 C=d;8 j=[0,0,0,1];8 1i=21;8 1j=22;8 U=1k;8 D=d;6 V(){23(i=0;i<j.P;i++){4(j[i]==1){j[i]=0;4(!D){4((i+2)<j.P){j[i+1]=1}e{j[0]=1;D=t}}e{4((i-1)<0){j[1]=1}e{j[i-1]=1;D=d}}1g}}$("#7 .u-2").m({"W-X":"-"+(1j+(i*1i))+"1l 1m",f:"v"});C=Y("V()",U)}6 24(){4(!K){$("#7 1n.u-3").25(6(){4($.q.L){o.E.F[0].p.f="v"}e{$(o.E.F[0]).1o().1p(M,1)}},6(){4(k||g){Q}4($.q.L){o.E.F[0].p.f="w"}e{$(o.E.F[0]).1o().1p(M,0)}});$("#7 1n.u-3").26(6(){g=t;$("#7 .u-2").m({"W-X":"-27 0",f:"v"});B=$.q.x?$("s"):$("s, h");C=Y("V()",U);B.T({7:0},"1h",6(){g=d;4(!k){k=t;1q=$("#7")[0].28+29;$("#7").T({"1r-S":"-="+1q+"1l"},2a,6(){1s()})}})});9.2b=6(){4((!g)&&(!k)){2c=$("h")[0];2d=$("s")[0];4(9.1t){G=9.1t;H=9.2e}e{G=c.n.2f;H=1d()}1u=$("h")[0];I=$("#7")[0];4((1u)&&(I)){4((I.p.f=="w")&&((1)<H)){g=t;$("#7").2g(l,6(){g=d;o.p.f="v"})}4((I.p.f=="v")&&((1)>H)){g=t;$("#7").2h(l,6(){g=d;o.p.f="w"})}}}}}e{Y(6(){9.1f(0,1)},1k)}}6 1s(){$("#7 .u-2").m({"W-X":"-2i 1m",f:"w"});$("#7").m({"1r-S":"-2j",f:"w"});k=d;2k(C)};',
          62,
          145,
          '||||if||function|scrollTop|var|window|||document|false|else|display|scroll_animate|body||rocketFireState|upAnimate|anim_time|css|documentElement|this|style|browser|preNewSrc|html|true|level|block|none|opera|navigator|userAgent|scrollLeft|op|rocketFireTimer|toLeftFireAnimation|parentNode|children|wind_height|wind_scroll|scrollBtn|indexOf|mobileSafari|msie|500|loadTime|logStr|length|return|NewDocumentHeight|top|animate|rocketFireAnimateTime|rocketFireAnimate|background|position|setTimeout|browser_detect|Gecko|MobileSafari|domStart|new|Date|domStop|getTime|console|wrapper|getNewSrc|split|newSrc|src|getScrollY|pageYOffset|scrollTo|break|slow|rocketFireFrameLength|rocketFireFrameStart|100|px|0px|div|stop|fadeTo|thisTop|margin|resetScrollUpBtn|innerHeight|elem|IE|attachEvent|Opera|WebKit|AppleWebKit|KHTML|match|Apple|Mobile|Safari|anim_time_short|350|menuSelected|culculateDomRedy|1000|cache|full|refresh|log|overflow|hidden|min|height|1000px|setImgSrc|project_path|svg|typeof|number|pageXOffset|switch|case|149|298|for|initScrollTop|hover|click|298px|offsetTop|250|300|onscroll|body_elem|window_elem|scrollY|clientHeight|fadeIn|fadeOut|200px|25px|clearTimeout'.split(
            '|'
          ),
          0,
          {}
        )
      );

      function immytop() {
        initScrollTop();
      }
      immytop();
    },
  });
  var msgListView = new View();
});
