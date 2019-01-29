/**
 * Created by Linfe on 2017/6/19.
 */
require([
  'jquery',
  'underscore',
  'old/validator',
  'old/toast',
  './config',
  'old/backbone',
  'old/tags',
  'old/bootstrap-select.min',
  'old/city-picker',
  'juicer',
], function($, _, Validator, Toast, config) {
  $.ajaxSetup({
    cache: false,
  });
  var activityId; // 招募活动id
  var View = Backbone.View.extend({
    el: 'body',
    windowurl: window.location.search.substr(1),
    events: {
      'click .cancel-icon': 'clearInput', // 点击input 最右侧按钮清空信息
      // 'click .popover_bar': 'delMsg',
      'click ': 'elClick', // el 内点击事件
      // 'click .submit_msg': 'submit_msg',
      // 'click .edit': 'editText',
      // 'click .pagination_wrp': 'pageJump',
      // 'click .btn_new': 'newText',
      // 'click .search_bar_icon': 'search',
      'click #submit': 'submit',
      // 'click #showBigImg': 'showBigImg',
      // 'mouseout #bigimg': 'outBigImg'
    },
    id: null,
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
    clearInput: function(e) {
      var $tar = $(e.target);
      $tar.prev().val('');
    },
    elClick: function(e) {
      var $tar1 = $(e.target);
      var $tar2 = $(e.target).parents('.chooseBox');
      if (!$tar1.hasClass('wrap_tags') && !$tar2.length) {
        $('.chooseBox').hide();
      }
    },
    submit: function() {
      var self = this,
        edit = false,
        array = self.windowurl.split('='),
        id = array[array.length - 1];
      if (self.windowurl.indexOf('volunteerId') >= 0) {
        var addURL = '/zzhadmin/updateVolunteerMessage/';
        var edit = true;
      } else {
        var addURL = '/zzhadmin/addVolunteer/';
      }
      var name_feedback = true,
        all_required_feedback = true,
        birth_feedback = true,
        phone_feedback = true,
        confirm_feedback = true;

      //确认按钮
      $('[name="agree"]').each(function(index, ele) {
        if ($(ele).attr('data-id') == 'required') {
          if (!$(ele).prop('checked')) {
            $(ele)
              .nextAll('[data-id="confirmButton_msg"]')
              .html('请点击确认');
            $(ele)
              .nextAll('[data-id="confirmButton_msg"]')
              .parent('')
              .parent('div')
              .addClass('has-error');
            $(ele)
              .nextAll('[data-id="confirmButton_msg"]')
              .show();
            confirm_feedback = false;
            $('body').scrollTop($(ele).offset().top);
            return false;
          } else {
            $(ele)
              .nextAll('[data-id="confirmButton_msg"]')
              .parent('')
              .parent('div')
              .removeClass('has-error');
            $(ele)
              .nextAll('[data-id="confirmButton_msg"]')
              .hide();
          }
        }
      });

      //数据校验 - 手机号
      $('[name="phoneText"]').each(function(index, ele) {
        phone_feedback = Validator.phoneNum(ele.value);
        if (phone_feedback != true) {
          $(ele)
            .nextAll('[data-id="phone_msg"]')
            .html(phone_feedback);
          $(ele)
            .nextAll('[data-id="phone_msg"]')
            .parent('')
            .parent('div')
            .addClass('has-error');
          $(ele)
            .nextAll('[data-id="phone_msg"]')
            .show();
          phone_feedback = false;
          $('body').scrollTop($(ele).offset().top);
          return false;
        } else {
          $(ele)
            .nextAll('[data-id="phone_msg"]')
            .parent('')
            .parent('div')
            .removeClass('has-error');
          $(ele)
            .nextAll('[data-id="phone_msg"]')
            .hide();
        }
      });

      //数据校验 - 出生日期
      $('[name="timeText"]').each(function(index, ele) {
        if ($(ele).attr('data-id') == 'required') {
          birth_feedback = Validator.date(ele.value);
          if (birth_feedback != true) {
            $(ele)
              .nextAll('[data-id="time_msg"]')
              .html(birth_feedback);
            $(ele)
              .nextAll('[data-id="time_msg"]')
              .parent('')
              .parent('div')
              .addClass('has-error');
            $(ele)
              .nextAll('[data-id="time_msg"]')
              .show();
            birth_feedback = false;
            $('body').scrollTop($(ele).offset().top);
            return false;
          } else {
            $(ele)
              .nextAll('[data-id="time_msg"]')
              .parent('')
              .parent('div')
              .removeClass('has-error');
            $(ele)
              .nextAll('[data-id="time_msg"]')
              .hide();
          }
        }
      });

      //数据校验
      $('[data-id="required"]').each(function(index, ele) {
        if (
          $(ele)
            .parent()
            .parent()
            .attr('data-type') == 9
        ) {
          // 下拉选项
          if (
            !$(ele).val() &&
            $(ele) != 0 &&
            typeof $(ele).val() != 'undefined'
          ) {
            // 未选中任何选项时为null
            all_required_feedback = false;
            $(ele)
              .parent()
              .parent()
              .addClass('has-error');
          } else {
            $(ele)
              .parent()
              .parent()
              .removeClass('has-error');
          }
        } else {
          // 姓名&必填的单行文本字段type1&地址type11&时间type8&电话7&数字type6&确认按钮5&多文本2
          name_feedback = Validator.required(ele.value);
          if (name_feedback != true) {
            $(ele)
              .nextAll('[data-id="require_msg"]')
              .html(name_feedback);
            $(ele)
              .nextAll('[data-id="require_msg"]')
              .parent('')
              .parent('div')
              .addClass('has-error');
            $(ele)
              .nextAll('[data-id="require_msg"]')
              .show();
            $('body').scrollTop($(ele).offset().top);
            name_feedback = false;
            all_required_feedback = false;
          } else {
            $(ele)
              .nextAll('[data-id="require_msg"]')
              .parent('')
              .parent('div')
              .removeClass('has-error');
            $(ele)
              .nextAll('[data-id="require_msg"]')
              .hide();
          }
        }
      });

      //从两个地方取地址，取有值得那个
      var a = new Array();
      $('.title .select-item').each(function(index, item) {
        console.log($(this).html());
        a.push($(this).html());
      });
      if (a == false) {
        a = $('.city-picker-span .placeholder')
          .text()
          .split('/');
      }
      var province = $.trim(a[0]);
      var city = $.trim(a[1]);
      var area = $.trim(a[2]);
      if (city == '市' && area == '区') {
        province = '';
        city = '';
        area = '';
      }
      if (
        all_required_feedback &
        birth_feedback &
        phone_feedback &
        confirm_feedback
      ) {
        var optArr = [];
        $('strong').each(function(index, ele) {
          var singleOpt = {};
          singleOpt['activityId'] = activityId;
          singleOpt['input_id'] = $(ele).attr('data-input');
          singleOpt['name'] = $(ele).text();
          if (singleOpt['name'] == '现住址') {
            singleOpt['message'] =
              province +
              ' ' +
              city +
              ' ' +
              area +
              '  ' +
              $('#addressDetails').val();
          } else {
            var getRadio = $(ele)
              .parent()
              .next()
              .find('.checked');
            var getInput = $(ele)
              .parent()
              .next()
              .find('input');
            var getTextarea = $(ele)
              .parent()
              .next()
              .find('textarea');
            var getselect = $(ele)
              .parent()
              .next()
              .find('select');
            if (getInput.length > 0 && getselect.length < 1) {
              if (getInput.attr('name') == 'agree') {
                singleOpt['message'] = $(getInput).prop('checked');
              } else {
                if (getRadio.length > 0) {
                  singleOpt['message'] = $(getRadio).attr('for');
                } else {
                  singleOpt['message'] = $(getInput).val();
                }
              }
            } else if (getTextarea.length > 0) {
              singleOpt['message'] = $(getTextarea).val();
            } else if (getselect.length > 0) {
              singleOpt['message'] = $(getselect).selectpicker('val');
            }
          }
          optArr.push(singleOpt);
        });
        var opt = {};
        opt['data'] = optArr;
        if (edit) {
          opt['volunteerId'] = id;
        }
        opt = JSON.stringify(opt);
        $.ajax({
          type: 'POST',
          url: addURL,
          data: opt,
          success: function(msg) {
            if (msg.result >= 0) {
              if (edit) {
                Toast('修改成功');
              } else {
                Toast(msg.msg);
              }
              //刷新父页面
              window.opener.location.href = window.opener.location.href;
              window.opener.location.reload();
              setTimeout(function() {
                //刷新本页面
                window.location.href = window.opener.location.href;
                window.location.reload();
                $(window).scrollTop(0);
              }, 750);
            } else {
              Toast(msg.msg, 2);
            }
          },
          error: function(msg) {
            Toast('网络服务出错，请稍后再试', 2);
          },
        });
      }
    },
    splitWithSpace: function(data) {
      var arr = [];
      if (typeof data == 'string') {
        arr = data.split('，');
        return arr.join(' ');
      } else {
        return data;
      }
    },
    initialize: function() {
      /*require(["cityPicker"], function () {
             $("#address").citypicker({'province': '广东省', 'city': '深圳市','district':'南山区'});
             });*/
      var self = this,
        allTemplate = '', // 声明全局模板html
        UrlSearch = new self.UrlSearch(); // 获取url参数
      activityId = UrlSearch.activityId;
      $.ajax({
        type: 'get',
        url: '/zzhadmin/getVolunteerInfoInput/',
        data: { activityId: activityId },
        async: false,
        success: function(data) {
          var getList = data.data;
          _.each(getList, function(item, index, list) {
            var getType = item.type;
            switch (getType) {
              case 1:
                var opt = {},
                  template = juicer(config.template.component.singleText);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 2:
                var opt = {},
                  template = juicer(config.template.component.multipleText);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 3:
                if (item.options) {
                  var len = item.options.length;
                  item['len'] = len;
                } else {
                  item.options = ['是', '否'];
                  item['len'] = 2;
                }
                var opt = {},
                  template = juicer(config.template.component.radioButton);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 4:
                var opt = {},
                  template = juicer(config.template.component.checkBoxes);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 5:
                var opt = {},
                  template = juicer(config.template.component.confirmButton);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 6:
                var opt = {},
                  template = juicer(config.template.component.numberText);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 7:
                var opt = {},
                  template = juicer(config.template.component.phoneText);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 8:
                var opt = {},
                  template = juicer(config.template.component.timeText);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 9:
                if (item.options) {
                  var len = item.options.length;
                  item['len'] = len;
                } else {
                  item.options = [];
                  item['len'] = 0;
                }
                var opt = {},
                  template = juicer(config.template.component.dropDownMenu);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 10:
                if (item.options) {
                  var len = item.options.length;
                  item['len'] = len;
                } else {
                  item.options = [];
                  item['len'] = 0;
                }
                var opt = {},
                  template = juicer(config.template.component.labelText);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 11:
                var opt = {},
                  template = juicer(config.template.component.addressText);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              case 12:
                var opt = {},
                  template = juicer(config.template.component.splitLine);
                opt['item'] = item;
                var HTMLtemplate = template.render(opt);
                allTemplate += HTMLtemplate;
                break;
              default:
                break;
            }
            console.log(item);
          });
          var submitButton = juicer(config.template.component.submitButton),
            HTMLtemplate = submitButton.render({});
          allTemplate += HTMLtemplate;
          $('#loggingForm').html(allTemplate);
          self.initSelect();
        },
        error: function(res) {
          Toast('网络服务出错，请稍后再试', 0);
        },
      });
      $('.filter-option').text('未选择');
      //判断是不是查询页跳转过来了的
      $('.radio .checkRadio').on('click', function() {
        $(this).addClass('checked');
        $(this)
          .siblings()
          .removeClass('checked');
      });
      $('#address').citypicker();
      /*编辑信息*/
      if (self.windowurl.indexOf('volunteerId') >= 0) {
        //若是则填充数据
        var array = self.windowurl.split('=');
        var id = array[array.length - 1];
        self.id = id;
        if ($.trim(id)) {
          $.ajax({
            type: 'get',
            url: '/zzhadmin/getVolunteerMessage/',
            data: {
              volunteerId: id,
            },
            async: false,
            success: function(data) {
              console.log(data);
              var res = data.data;
              if (data['result'] >= 0 && res) {
                res.forEach(function(value) {
                  console.log(value);
                  var getName = value.name;
                  switch (getName) {
                    case '现住址':
                      var addressArr = value.message.split(' '),
                        province = addressArr[0],
                        city = addressArr[1],
                        district = addressArr[2],
                        area = addressArr[4];
                      if (province == null || province == '') {
                        province = '请选择';
                      }
                      if (city == null || city == '') {
                        city = '请选择';
                      }
                      if (district == null || district == '') {
                        district = '请选择';
                      }
                      var str = province + ' / ' + city + ' / ' + district;
                      $('.city-picker-span .placeholder')
                        .text(str)
                        .css('color', '#555');
                      $('.city-picker-span').css('padding-left', '14px');
                      $('#address').attr('data-cid', value.id);
                      $('#addressDetails')
                        .val(area)
                        .attr('data-cid', value.id);
                      break;
                    case '同意服务协议':
                      if (value.message) {
                        $('#' + value.input_id).prop('checked', 'checked');
                      }
                      break;
                    default:
                      // 下方渲染从服务器获取的数据,根据input_id填充数据到正确位置
                      var ee = getName;
                      if (
                        $('[data-label=' + value.input_id + ']').length != 0
                      ) {
                        var vm = value.message.replace(/,/g, ' ');
                        $('[data-label=' + value.input_id + ']')
                          .val(vm)
                          .attr('data-cid', value.id);
                      } else if ($('#' + value.input_id).length > 0) {
                        if (
                          $('#' + value.input_id)[0].tagName == 'INPUT' ||
                          $('#' + value.input_id)[0].tagName == 'TEXTAREA'
                        ) {
                          $('#' + value.input_id)
                            .val(value.message)
                            .attr('data-cid', value.id);
                        } else if (
                          $('#' + value.input_id)[0].tagName == 'SELECT'
                        ) {
                          $('#' + value.input_id)
                            .selectpicker('val', value.message)
                            .attr('data-cid', value.id);
                        } else if (
                          $('#' + value.input_id)
                            .parents('.radioLabel')
                            .eq(0).length > 0
                        ) {
                          var radioLabel = $('#' + value.input_id)
                            .attr('data-cid', value.id)
                            .parents('.radioLabel')
                            .next()
                            .find('[for=' + value.message + ']');
                          radioLabel.click();
                        }
                      }
                      break;
                  }
                });
              } else {
                Toast(data.message, 2);
              }
            },
            error: function(msg) {
              Toast('网络服务出错，请稍后再试', 0);
            },
          });
        }
      }

      $('.form_datetime').datepicker({
        keyboardNavigation: false,
        language: 'zh-CN',
        todayHighlight: true,
        forceParse: false,
        autoclose: true,
        clearBtn: false,
        format: 'yyyy-mm-dd',
        endDate: new Date(),
        defaultViewDate: { year: 1985 },
      });

      var form = $('.j')[0];
      $('.wrap_tags').each(function() {
        $(this).click(function() {
          var chooBoxes = $(this).siblings('.chooseBox');
          $('.chooseBox')
            .not(chooBoxes[0])
            .hide();
          chooBoxes.slideToggle('fast');
          var name = $(this).attr('id');
          Douban.init_interest_form(form, name);
        });
      });
      $('#loading-toast').addClass('hide');
    },
    initSelect: function() {
      // 多选框配置 - 初始化
      $('.selectpicker').selectpicker({
        noneSelectedText: '未选择',
      });
      $('.selectpicker').selectpicker('val', '');
    },
  });
  var msgListView = new View();
});
