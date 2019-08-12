import $ from "jquery";
import _ from "underscore";
import Validator from "old/validator";
import Toast from "old/toast";
import config from "./config";
import "old/backbone";
import "old/tags";
import "old/bootstrap-select.min";
import "old/city-picker";
import "juicer";
$.ajaxSetup({
  cache: false
});
var activityId;
var View = Backbone.View.extend({
  el: "body",
  windowurl: window.location.search.substr(1),
  events: {
    "click .cancel-icon": "clearInput",
    "click ": "elClick",
    "click #submit": "submit"
  },
  id: null,
  UrlSearch: function () {
    var name, value, str = location.href, num = str.indexOf("?");
    str = str.substr(num + 1);
    var arr = str.split("&");
    for (var i = 0; i < arr.length; i++) {
      num = arr[i].indexOf("=");
      if (num > 0) {
        name = arr[i].substring(0, num);
        value = arr[i].substr(num + 1);
        this[name] = value;
      }
    }
  },
  clearInput: function (e) {
    var $tar = $(e.target);
    $tar.prev().val("");
  },
  elClick: function (e) {
    var $tar1 = $(e.target);
    var $tar2 = $(e.target).parents(".chooseBox");
    if (!$tar1.hasClass("wrap_tags") && !$tar2.length) {
      $(".chooseBox").hide();
    }
  },
  submit: function () {
    var self = this, edit = false, array = self.windowurl.split("="), id = array[array.length - 1];
    if (self.windowurl.indexOf("volunteerId") >= 0) {
      var addURL = "/zzhadmin/updateVolunteerMessage/";
      var edit = true;
    } else {
      var addURL = "/zzhadmin/addVolunteer/";
    }
    var name_feedback = true, all_required_feedback = true, birth_feedback = true, phone_feedback = true, confirm_feedback = true;
    $("[name=\"agree\"]").each(function (index, ele) {
      if ($(ele).attr("data-id") == "required") {
        if (!$(ele).prop("checked")) {
          $(ele).nextAll("[data-id=\"confirmButton_msg\"]").html("请点击确认");
          $(ele).nextAll("[data-id=\"confirmButton_msg\"]").parent("").parent("div").addClass("has-error");
          $(ele).nextAll("[data-id=\"confirmButton_msg\"]").show();
          confirm_feedback = false;
          $("body").scrollTop($(ele).offset().top);
          return false;
        } else {
          $(ele).nextAll("[data-id=\"confirmButton_msg\"]").parent("").parent("div").removeClass("has-error");
          $(ele).nextAll("[data-id=\"confirmButton_msg\"]").hide();
        }
      }
    });
    $("[name=\"phoneText\"]").each(function (index, ele) {
      phone_feedback = Validator.phoneNum(ele.value);
      if (phone_feedback != true) {
        $(ele).nextAll("[data-id=\"phone_msg\"]").html(phone_feedback);
        $(ele).nextAll("[data-id=\"phone_msg\"]").parent("").parent("div").addClass("has-error");
        $(ele).nextAll("[data-id=\"phone_msg\"]").show();
        phone_feedback = false;
        $("body").scrollTop($(ele).offset().top);
        return false;
      } else {
        $(ele).nextAll("[data-id=\"phone_msg\"]").parent("").parent("div").removeClass("has-error");
        $(ele).nextAll("[data-id=\"phone_msg\"]").hide();
      }
    });
    $("[name=\"timeText\"]").each(function (index, ele) {
      if ($(ele).attr("data-id") == "required") {
        birth_feedback = Validator.date(ele.value);
        if (birth_feedback != true) {
          $(ele).nextAll("[data-id=\"time_msg\"]").html(birth_feedback);
          $(ele).nextAll("[data-id=\"time_msg\"]").parent("").parent("div").addClass("has-error");
          $(ele).nextAll("[data-id=\"time_msg\"]").show();
          birth_feedback = false;
          $("body").scrollTop($(ele).offset().top);
          return false;
        } else {
          $(ele).nextAll("[data-id=\"time_msg\"]").parent("").parent("div").removeClass("has-error");
          $(ele).nextAll("[data-id=\"time_msg\"]").hide();
        }
      }
    });
    $("[data-id=\"required\"]").each(function (index, ele) {
      if ($(ele).parent().parent().attr("data-type") == 9) {
        if (!$(ele).val() && $(ele) != 0 && typeof $(ele).val() != "undefined") {
          all_required_feedback = false;
          $(ele).parent().parent().addClass("has-error");
        } else {
          $(ele).parent().parent().removeClass("has-error");
        }
      } else {
        name_feedback = Validator.required(ele.value);
        if (name_feedback != true) {
          $(ele).nextAll("[data-id=\"require_msg\"]").html(name_feedback);
          $(ele).nextAll("[data-id=\"require_msg\"]").parent("").parent("div").addClass("has-error");
          $(ele).nextAll("[data-id=\"require_msg\"]").show();
          $("body").scrollTop($(ele).offset().top);
          name_feedback = false;
          all_required_feedback = false;
        } else {
          $(ele).nextAll("[data-id=\"require_msg\"]").parent("").parent("div").removeClass("has-error");
          $(ele).nextAll("[data-id=\"require_msg\"]").hide();
        }
      }
    });
    var a = new Array();
    $(".title .select-item").each(function (index, item) {
      console.log($(this).html());
      a.push($(this).html());
    });
    if (a == false) {
      a = $(".city-picker-span .placeholder").text().split("/");
    }
    var province = $.trim(a[0]);
    var city = $.trim(a[1]);
    var area = $.trim(a[2]);
    if (city == "市" && area == "区") {
      province = "";
      city = "";
      area = "";
    }
    if (all_required_feedback & birth_feedback & phone_feedback & confirm_feedback) {
      var optArr = [];
      $("strong").each(function (index, ele) {
        var singleOpt = {};
        singleOpt["activityId"] = activityId;
        singleOpt["input_id"] = $(ele).attr("data-input");
        singleOpt["name"] = $(ele).text();
        if (singleOpt["name"] == "现住址") {
          singleOpt["message"] = province + " " + city + " " + area + "  " + $("#addressDetails").val();
        } else {
          var getRadio = $(ele).parent().next().find(".checked");
          var getInput = $(ele).parent().next().find("input");
          var getTextarea = $(ele).parent().next().find("textarea");
          var getselect = $(ele).parent().next().find("select");
          if (getInput.length > 0 && getselect.length < 1) {
            if (getInput.attr("name") == "agree") {
              singleOpt["message"] = $(getInput).prop("checked");
            } else {
              if (getRadio.length > 0) {
                singleOpt["message"] = $(getRadio).attr("for");
              } else {
                singleOpt["message"] = $(getInput).val();
              }
            }
          } else if (getTextarea.length > 0) {
            singleOpt["message"] = $(getTextarea).val();
          } else if (getselect.length > 0) {
            singleOpt["message"] = $(getselect).selectpicker("val");
          }
        }
        optArr.push(singleOpt);
      });
      var opt = {};
      opt["data"] = optArr;
      if (edit) {
        opt["volunteerId"] = id;
      }
      opt = JSON.stringify(opt);
      $.ajax({
        type: "POST",
        url: addURL,
        data: opt,
        success: function (msg) {
          if (msg.result >= 0) {
            if (edit) {
              Toast("修改成功");
            } else {
              Toast(msg.msg);
            }
            window.opener.location.href = window.opener.location.href;
            window.opener.location.reload();
            setTimeout(function () {
              window.location.href = window.opener.location.href;
              window.location.reload();
              $(window).scrollTop(0);
            }, 750);
          } else {
            Toast(msg.msg, 2);
          }
        },
        error: function (msg) {
          Toast("网络服务出错，请稍后再试", 2);
        }
      });
    }
  },
  splitWithSpace: function (data) {
    var arr = [];
    if (typeof data == "string") {
      arr = data.split("，");
      return arr.join(" ");
    } else {
      return data;
    }
  },
  initialize: function () {
    var self = this, allTemplate = "", UrlSearch = new self.UrlSearch();
    activityId = UrlSearch.activityId;
    $.ajax({
      type: "get",
      url: "/zzhadmin/getVolunteerInfoInput/",
      data: {
        activityId: activityId
      },
      async: false,
      success: function (data) {
        var getList = data.data;
        _.each(getList, function (item, index, list) {
          var getType = item.type;
          switch (getType) {
            case 1:
              var opt = {}, template = juicer(config.template.component.singleText);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 2:
              var opt = {}, template = juicer(config.template.component.multipleText);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 3:
              if (item.options) {
                var len = item.options.length;
                item["len"] = len;
              } else {
                item.options = ["是", "否"];
                item["len"] = 2;
              }
              var opt = {}, template = juicer(config.template.component.radioButton);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 4:
              var opt = {}, template = juicer(config.template.component.checkBoxes);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 5:
              var opt = {}, template = juicer(config.template.component.confirmButton);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 6:
              var opt = {}, template = juicer(config.template.component.numberText);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 7:
              var opt = {}, template = juicer(config.template.component.phoneText);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 8:
              var opt = {}, template = juicer(config.template.component.timeText);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 9:
              if (item.options) {
                var len = item.options.length;
                item["len"] = len;
              } else {
                item.options = [];
                item["len"] = 0;
              }
              var opt = {}, template = juicer(config.template.component.dropDownMenu);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 10:
              if (item.options) {
                var len = item.options.length;
                item["len"] = len;
              } else {
                item.options = [];
                item["len"] = 0;
              }
              var opt = {}, template = juicer(config.template.component.labelText);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 11:
              var opt = {}, template = juicer(config.template.component.addressText);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            case 12:
              var opt = {}, template = juicer(config.template.component.splitLine);
              opt["item"] = item;
              var HTMLtemplate = template.render(opt);
              allTemplate += HTMLtemplate;
              break;
            default:
              break;
          }
          console.log(item);
        });
        var submitButton = juicer(config.template.component.submitButton), HTMLtemplate = submitButton.render({});
        allTemplate += HTMLtemplate;
        $("#loggingForm").html(allTemplate);
        self.initSelect();
      },
      error: function (res) {
        Toast("网络服务出错，请稍后再试", 0);
      }
    });
    $(".filter-option").text("未选择");
    $(".radio .checkRadio").on("click", function () {
      $(this).addClass("checked");
      $(this).siblings().removeClass("checked");
    });
    $("#address").citypicker();
    if (self.windowurl.indexOf("volunteerId") >= 0) {
      var array = self.windowurl.split("=");
      var id = array[array.length - 1];
      self.id = id;
      if ($.trim(id)) {
        $.ajax({
          type: "get",
          url: "/zzhadmin/getVolunteerMessage/",
          data: {
            volunteerId: id
          },
          async: false,
          success: function (data) {
            console.log(data);
            var res = data.data;
            if (data["result"] >= 0 && res) {
              res.forEach(function (value) {
                console.log(value);
                var getName = value.name;
                switch (getName) {
                  case "现住址":
                    var addressArr = value.message.split(" "), province = addressArr[0], city = addressArr[1], district = addressArr[2], area = addressArr[4];
                    if (province == null || province == "") {
                      province = "请选择";
                    }
                    if (city == null || city == "") {
                      city = "请选择";
                    }
                    if (district == null || district == "") {
                      district = "请选择";
                    }
                    var str = province + " / " + city + " / " + district;
                    $(".city-picker-span .placeholder").text(str).css("color", "#555");
                    $(".city-picker-span").css("padding-left", "14px");
                    $("#address").attr("data-cid", value.id);
                    $("#addressDetails").val(area).attr("data-cid", value.id);
                    break;
                  case "同意服务协议":
                    if (value.message) {
                      $("#" + value.input_id).prop("checked", "checked");
                    }
                    break;
                  default:
                    var ee = getName;
                    if ($("[data-label=" + value.input_id + "]").length != 0) {
                      var vm = value.message.replace(/,/g, " ");
                      $("[data-label=" + value.input_id + "]").val(vm).attr("data-cid", value.id);
                    } else if ($("#" + value.input_id).length > 0) {
                      if ($("#" + value.input_id)[0].tagName == "INPUT" || $("#" + value.input_id)[0].tagName == "TEXTAREA") {
                        $("#" + value.input_id).val(value.message).attr("data-cid", value.id);
                      } else if ($("#" + value.input_id)[0].tagName == "SELECT") {
                        $("#" + value.input_id).selectpicker("val", value.message).attr("data-cid", value.id);
                      } else if ($("#" + value.input_id).parents(".radioLabel").eq(0).length > 0) {
                        var radioLabel = $("#" + value.input_id).attr("data-cid", value.id).parents(".radioLabel").next().find("[for=" + value.message + "]");
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
          error: function (msg) {
            Toast("网络服务出错，请稍后再试", 0);
          }
        });
      }
    }
    $(".form_datetime").datepicker({
      keyboardNavigation: false,
      language: "zh-CN",
      todayHighlight: true,
      forceParse: false,
      autoclose: true,
      clearBtn: false,
      format: "yyyy-mm-dd",
      endDate: new Date(),
      defaultViewDate: {
        year: 1985
      }
    });
    var form = $(".j")[0];
    $(".wrap_tags").each(function () {
      $(this).click(function () {
        var chooBoxes = $(this).siblings(".chooseBox");
        $(".chooseBox").not(chooBoxes[0]).hide();
        chooBoxes.slideToggle("fast");
        var name = $(this).attr("id");
        Douban.init_interest_form(form, name);
      });
    });
    $("#loading-toast").addClass("hide");
  },
  initSelect: function () {
    $(".selectpicker").selectpicker({
      noneSelectedText: "未选择"
    });
    $(".selectpicker").selectpicker("val", "");
  }
});
var msgListView = new View();
