import $ from 'jquery';
import config from './config';
import Toast from 'old/toast';
import 'old/backbone';
import juicer from 'juicer';
import 'old/bootstrap-select.min';
import 'old/jquery.pagination';
import 'old/jquery.watermark.min';
var View = Backbone.View.extend({
  el: 'body',
  events: {
    'click .submit_msg ': 'countPeople',
    'click #sureSend ': 'confSubmit',
    'click #groupSend': 'groupSend',
    'click #phoneSend': 'phoneSend',
  },
  remainingText: function() {
    $.ajax({
      type: 'GET',
      url: 'text.json',
      dataType: 'JSON',
      success: function(data) {
        $('.remainingText').text(data);
      },
      error: function() {
        Toast('网络服务出错，请稍候再试', 0);
      },
    });
  },
  getGroups: function(selector) {
    $.ajax({
      type: 'GET',
      url: '/zzhadmin/tagList/',
      dataType: 'JSON',
      success: function(res) {
        var template = juicer(config.template.component.group);
        var HTMLtemplate = template.render(res);
        $(selector).html(HTMLtemplate);
        $(selector).selectpicker('refresh');
      },
      error: function() {
        Toast('网络服务出错，请稍候再试', 0);
      },
    });
  },
  countPeople: function() {
    var trueContent = $('#textCtn').val(),
      contact_person = '',
      contact_tel = '';
    var constitutionName = $.trim($('.countFirstLetter').text());
    constitutionName = '【' + constitutionName + '】';
    var msgContent = constitutionName + trueContent,
      singleMsgNumber = parseInt(msgContent.length / 70) + 1,
      sendMethod = '';
    if ($('#phoneSend').attr('checked') === 'checked') {
      sendMethod = 'phone';
    } else {
      sendMethod = 'group';
    }
    if (trueContent) {
      if (sendMethod === 'phone') {
        var phoneInput = $('#phoneInput').val(),
          phoneArr = phoneInput.split('\n'),
          phoneArrLen = phoneArr.length;
        if (phoneArrLen > 0) {
          var verifyPhone = phoneArr.reduce(function(a, b) {
            return a && b.length === 11;
          }, true);
          if (verifyPhone) {
            var curMsgNumber = parseInt($('.remainingText').text());
            var msgNumber = singleMsgNumber * phoneArrLen;
            if (curMsgNumber < msgNumber) {
              $('#insufficient').modal();
            } else {
              $('#numHint .peopleCnt').text(
                phoneArrLen + '个人，消耗' + msgNumber + '条短信'
              );
              $('#countPeople').modal();
            }
          } else {
            Toast('存在不正确的手机号，请更正', 2);
          }
        } else {
          Toast('请输入手机号', 2);
        }
      } else {
        var selectedGroup = $('#groupId').val(),
          selectedGroupLen = selectedGroup.length;
        if (selectedGroupLen) {
          var curMsgNumber = parseInt($('.remainingText').text()),
            msgNumber = singleMsgNumber * selectedGroupLen;
          if (curMsgNumber < msgNumber) {
            $('#insufficient').modal();
          } else {
            $('#numHint .peopleCnt').text(selectedGroupLen + '组义工，');
            $('#countPeople').modal();
          }
        } else {
          Toast('请选择要群发的分组', 2);
        }
      }
    } else {
      Toast('请输入要群发的内容', 2);
    }
  },
  confSubmit: function() {
    var trueContent = $('#textCtn').val(),
      contact_person = '',
      contact_tel = '';
    var constitutionName = '【' + $.trim($('.countFirstLetter').text()) + '】',
      msgContent = constitutionName + trueContent,
      sendMethod = '';
    if ($('#phoneSend').attr('checked') === 'checked') {
      sendMethod = 'phone';
    } else {
      sendMethod = 'group';
    }
    var opt = {};
    opt['content'] = msgContent;
    opt['contact'] = contact_person;
    opt['phone'] = contact_tel;
    if (sendMethod === 'phone') {
      var phoneInput = $('#phoneInput').val(),
        phoneArr = phoneInput.split('\n');
      opt['mobiles'] = phoneArr;
    } else {
      var selectedGroup = $('#groupId').val();
      opt['tagIds'] = selectedGroup;
    }
    $.ajax({
      type: 'POST',
      url: '/zzhadmin/volunteer_sendSMS/',
      data: opt,
      datatype: 'JSON',
      success: function(msg) {
        $('#countPeople').modal('hide');
        $('.newModal').modal('hide');
        $('#paySuccess').modal();
        $.ajax({
          type: 'GET',
          url: '/zzhadmin/volunteer_getSmsCount',
          dataType: 'JSON',
          success: function(submsg) {
            $('.remainingText').text(submsg.data.msgCnt);
          },
          error: function(submsg) {
            Toast(submsg.msg, 0);
          },
        });
      },
      error: function(msg) {
        Toast('网络服务出错，请稍候再试', 0);
        $('#countPeople').modal('hide');
      },
    });
  },
  groupSend: function(e) {
    $('#phoneSend').removeAttr('checked');
    $('#groupSend').attr('checked', 'checked');
    $('[data-id="phoneInput"]').addClass('hide');
    $('[data-id="phoneTip"]').addClass('hide');
    $('[data-id="groupSelect"]').removeClass('hide');
    $('[data-id="groupTip"]').removeClass('hide');
  },
  phoneSend: function(e) {
    $('#groupSend').removeAttr('checked');
    $('#phoneSend').attr('checked', 'checked');
    $('[data-id="phoneInput"]').removeClass('hide');
    $('[data-id="phoneTip"]').removeClass('hide');
    $('[data-id="groupSelect"]').addClass('hide');
    $('[data-id="groupTip"]').addClass('hide');
  },
  initialize: function() {
    var self = this;
    $('.selectpicker').selectpicker({
      noneSelectedText: '未选择',
    });
    $.ajax({
      type: 'GET',
      url: '/zzhadmin/volunteer_getSmsCount',
      dataType: 'JSON',
      success: function(msg) {
        $('.remainingText').text(msg.data.msgCnt);
      },
      error: function(msg) {
        Toast('网络服务出错，请稍候再试', 0);
      },
    });
    $('#page').page({
      firstBtnText: '首页',
      lastBtnText: '尾页',
      prevBtnText: '上一页',
      nextBtnText: '下一页',
      pageSize: 5,
      showInfo: true,
      showJump: true,
      jumpBtnText: '跳转',
      showPageSizes: true,
      infoFormat: '共{total}条',
      remote: {
        url: '/zzhadmin/volunteer_getSMS/',
        params: {
          query: 'test',
        },
        success: function(result, pageIndex) {
          var temp = juicer(config.template.component.text_list);
          var html = temp.render(result);
          $('#textList').html(html);
        },
      },
    });
    var arrLen = [];
    arrLen[0] =
      $('.m-pagination-page').attr('style') == 'display: none;'
        ? 0
        : $('.m-pagination-page').outerWidth(true);
    arrLen[1] =
      $('.m-pagination-size').attr('style') == 'display: none;'
        ? 0
        : $('.m-pagination-size').outerWidth(true);
    arrLen[2] =
      $('.m-pagination-jump').attr('style') == 'display: none;'
        ? 0
        : $('.m-pagination-jump').outerWidth(true);
    arrLen[3] =
      $('.m-pagination-info').attr('style') == 'display: none;'
        ? 0
        : $('.m-pagination-info').outerWidth(true);
    var len = arrLen.length,
      length = 0;
    for (var i = 0; i < len; i++) {
      length += parseInt(arrLen[i]);
    }
    length += 10;
    $('.paginationFooter').css('width', length);
    $('.newModal').on('show.bs.modal', function(e) {
      $('#textCtn').val('');
      $('.countFirstLetter').text(localStorage['templeName']);
      var countFirstLetter = $('.countFirstLetter').text().length;
      countFirstLetter = parseInt(countFirstLetter) + 2;
      $('.countLetter').text(countFirstLetter);
      self.getGroups('#groupId');
    });
    $('#textCtn').keyup(function() {
      var strLength = $(this).val().length;
      strLength = parseInt(strLength);
      var countFirstLetter = $('.countFirstLetter').text().length;
      countFirstLetter = parseInt(countFirstLetter) + 2;
      $('.countLetter').text(strLength + countFirstLetter);
    });
  },
});
var msgListView = new View();
