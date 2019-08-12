import $ from "jquery";
import _ from "underscore";
import toastr from "toastr";
import commonFunc from "common/function";
import commonVars from "common/variables";
import data from "./data";
import tpl from "./tpl";
import func from "./function";
import "./ajax";
import "lib/jquery.seeView";
toastr.options.positionClass = "toast-bottom-full-width";
toastr.options.timeOut = 2000;
$.seeView({
  events: {
    "!change [data-filter]": "onChangeFilter",
    "!click #action-add": "onClickActionAdd",
    "click [data-popup-close]": "onClickPopupClose",
    "click [data-unit-delete]": "onClickUnitDelete",
    "click [data-unit-copy]": "onClickUnitCopy",
    "click [data-unit-edit]": "onClickUnitEdit",
    "click [data-unit-freeze]": "onClickUnitFreeze",
    "click [data-unit-sort]": "onClickUnitSort",
    "!click #sort-popup-ok": "onClickSortPopupOk",
    "!click #create-popup-ok": "onClickCreatePopupOk"
  },
  onChangeFilter: function (e) {
    var $this = $(e.target), filterName = $this.attr("data-filter"), value = $this.val();
    if (filterName === "buddha") {
      value = parseInt(value);
    } else {
      data.filter.buddha = 0;
      var buddhaList = data.placeData[value];
      var $container2 = $("[data-filter-container=\"2\"]");
      var $buddhaFilter = $("[data-filter=\"buddha\"]");
      if (!buddhaList || !buddhaList.length) {
        $container2.addClass("hide");
      } else {
        $container2.removeClass("hide");
        $buddhaFilter.html(tpl.option.render({
          id: 0,
          name: "全部"
        }));
        buddhaList.map(function (item) {
          $buddhaFilter.append(tpl.option.render(item));
        });
        $buddhaFilter.val(0);
      }
    }
    data.filter[filterName] = value;
    func.requestList();
  },
  onClickActionAdd: function (e) {
    this.resetCreatePopup();
    $("#create-popup").show().scrollTop(0);
    $("body").addClass("overflow-hidden");
    data.currentCopyId = 0;
  },
  resetCreatePopup: function () {
    $("#create-popup-name").val("");
    $("#create-popup-rows").val("");
    $("#create-popup-columns").val("");
  },
  onClickPopupClose: function (e) {
    $(e.target).parents(".modal").hide();
    $("body").removeClass("overflow-hidden");
  },
  onClickUnitDelete: function (e) {
    var $this = $(e.target), id = parseInt($this.attr("data-unit-delete"));
    commonFunc.confirm("确定删除这个项目吗", function () {
      $.seeAjax.post("delete", {
        id: id
      }, function (res) {
        if (res.success) {
          $("[data-unit=\"" + id + "\"]").remove();
          toastr.success("删除成功");
        } else {
          toastr.error("删除失败，请稍后再试");
        }
      }, !0);
    });
  },
  onClickUnitCopy: function (e) {
    var self = this, $this = $(e.target), id = parseInt($this.attr("data-unit-copy"));
    if (data.detailData[id]) {
      self.showCreatePopupForCopy(id);
    } else {
      $.seeAjax.post("detail", {
        id: id
      }, function (res) {
        if (res.success) {
          data.detailData[id] = res.data;
          self.showCreatePopupForCopy(id);
        } else {
          commonFunc.dialog("获取区域详细信息失败，请稍后再试");
        }
      }, !0);
    }
  },
  showCreatePopupForCopy: function (id) {
    var unitData = data.listData[id];
    var detailData = data.detailData[id];
    var placeName = unitData.place, dashIndex = unitData.place.indexOf("-");
    dashIndex > -1 && (placeName = unitData.place.slice(dashIndex + 1));
    $("#create-popup-name").val(placeName);
    $("#create-popup-rows").val(unitData.rows);
    $("#create-popup-columns").val(unitData.columns);
    $("#create-popup-code").val(detailData.seats.join("\n"));
    $("#create-popup-type").val(detailData.buddhaId);
    $("#create-popup").show().scrollTop(0);
    $("body").addClass("overflow-hidden");
    data.currentCopyId = id;
  },
  onClickUnitEdit: function (e) {
    var $this = $(e.target), id = parseInt($this.attr("data-unit-edit"));
    location.href = "/zzhadmin/buddhaSetRegion/?id=" + id;
  },
  onClickUnitFreeze: function (e) {
    var $this = $(e.target), id = parseInt($this.attr("data-unit-freeze")), status = parseInt($this.attr("data-status"));
    $.seeAjax.post("freeze", {
      id: id,
      status: 1 - status
    }, function (res) {
      if (res.success) {
        var $status = $("[data-unit-status=\"" + id + "\"]");
        if (status) {
          $this.attr({
            "data-status": 0
          }).text("冻结").removeClass("active");
          $status.text("已激活").addClass("active");
          toastr.success("激活成功");
        } else {
          $this.attr({
            "data-status": 1
          }).text("激活").addClass("active");
          $status.text("未激活").removeClass("active");
          toastr.success("冻结成功");
        }
      } else {
        toastr.error("操作失败，请稍后重新尝试");
      }
    }, !0);
  },
  onClickUnitSort: function (e) {
    var $this = $(e.target), id = parseInt($this.attr("data-unit-sort")), sequence = parseInt($this.attr("data-sequence"));
    data.currentSortId = id;
    $("#sort-popup-input").val(sequence);
    $("#sort-popup").show();
  },
  onClickSortPopupOk: function (e) {
    var sort = parseInt($("#sort-popup-input").val()) || 0;
    $.seeAjax.post("sort", {
      id: data.currentSortId,
      sort: sort
    }, function (res) {
      if (res.success) {
        $("#sort-popup").hide();
        func.requestList();
        toastr.success("更新成功");
      } else {
        toastr.error("更新排序失败，请稍后重试");
      }
    }, !0);
  },
  onClickCreatePopupOk: function (e) {
    var name = $("#create-popup-name").val();
    if (!name) {
      commonFunc.dialog("区域名称不能为空");
      return;
    }
    var rows = parseInt($("#create-popup-rows").val());
    if (!rows) {
      commonFunc.dialog("行数不能为空");
      return;
    }
    var columns = parseInt($("#create-popup-columns").val());
    if (!columns) {
      commonFunc.dialog("列数不能为空");
      return;
    }
    var codeCheckResult = this.checkCreateCode(rows, columns);
    if (!codeCheckResult.success) {
      commonFunc.dialog(codeCheckResult.message);
      return;
    }
    var buddhaId = parseInt($("#create-popup-type").val());
    $.seeAjax.post("create", {
      name: name,
      rows: rows,
      columns: columns,
      code: codeCheckResult.data,
      buddhaId: buddhaId,
      nonSeatCode: data.currentCopyId && data.detailData[data.currentCopyId] ? data.detailData[data.currentCopyId].nonSeatCode : ""
    }, function (res) {
      if (res.success) {
        $("#create-popup").hide();
        $("body").removeClass("overflow-hidden");
        func.requestList();
        toastr.success("保存成功");
      } else {
        toastr.error("保存失败，请稍后重试");
      }
    }, !0);
  },
  checkCreateCode: function (rows, columns) {
    var code = $("#create-popup-code").val();
    if (!code) return {
      success: !1,
      message: "编号不能为空"
    };
    var codeRows = code.split("\n");
    if (codeRows.length != rows) return {
      success: !1,
      message: "行数不对，请确保行数为 " + rows + " 行"
    };
    var i, il, rowItem, rowItemArray, emptyIndex = -1, allArray = [];
    for ((i = 0, il = rows); i < il; i++) {
      rowItem = codeRows[i];
      rowItemArray = rowItem.split("|");
      if (rowItemArray.length != columns) return {
        success: !1,
        message: "第 " + (i + 1) + " 行列数不对，请确保列数为 " + columns + " 列"
      };
      emptyIndex = rowItemArray.indexOf("");
      if (emptyIndex > -1) return {
        success: !1,
        message: "第 " + (i + 1) + " 行 " + (emptyIndex + 1) + " 列数据为空，请修正"
      };
      allArray.push(rowItemArray);
    }
    var flattenArray = _.without(_.flatten(allArray), "_");
    if (_.uniq(flattenArray).length != flattenArray.length) return {
      success: !1,
      message: "有重复编码，请修正"
    };
    return {
      success: !0,
      data: codeRows
    };
  }
});
