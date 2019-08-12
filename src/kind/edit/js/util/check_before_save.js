import $ from "jquery";
import dialog from "util/dialog";
import data from "../data";
export default _ => {
  const result = {
    success: !1,
    data: {}
  };
  const title = $("#input-title").val().trim();
  if (!title) {
    dialog("善行标题不能为空");
    return result;
  }
  result.data.title = title;
  const $covers = $("[data-cover-item-image]");
  if (!$covers.length) {
    dialog("封面图片不能为空");
    return result;
  }
  const covers = [];
  $covers.map(function () {
    covers.push($(this).attr("src"));
  });
  result.data.covers = covers;
  const intro = data.editor.getContent();
  if (!intro.length) {
    dialog("详情内容不能为空");
    return result;
  }
  result.data.intro = intro;
  const payItems = [];
  const $payItem = $("[data-pay-item]");
  const $payName = $("[data-pay-item-name]");
  const $payPrice = $("[data-pay-item-price]");
  const $payDesc = $("[data-pay-item-desc]");
  const $payImage = $("[data-pay-item-image]");
  if (!$payItem.length) {
    dialog("支付类型不能为空");
    return result;
  }
  let payItemHasError = !1;
  let payItemErrorMsg = "";
  $payItem.map(index => {
    const name = $($payName[index]).val() || "";
    const price = parseFloat($($payPrice[index]).val()) || 0;
    const desc = $($payDesc[index]).val() || "";
    const icon = $($payImage[index]).attr("src") || "";
    if (!name) {
      payItemHasError = !0;
      payItemErrorMsg = `第${index + 1}个支付选择项名称不能为空`;
      return !1;
    }
    if (price <= 0) {
      payItemHasError = !0;
      payItemErrorMsg = `第${index + 1}个支付选择项金额不能为空、0或负数`;
      return !1;
    }
    if (!icon) {
      payItemHasError = !0;
      payItemErrorMsg = `第${index + 1}个支付选择项图片不能为空`;
      return !1;
    }
    payItems.push({
      id: parseInt($($payItem[index]).attr("data-pay-item")) || 0,
      name,
      price,
      desc,
      icon
    });
  });
  if (payItemHasError) {
    dialog(payItemErrorMsg);
    return result;
  }
  result.data.payItems = payItems;
  result.data.shareTitle = $("#input-share-title").val().trim() || "";
  result.data.shareDesc = $("#input-share-desc").val().trim() || "";
  result.data.shareIcon = $("[data-share-item-image]").attr("src") || "";
  result.data.showPeopleCountWhenShare = $("#show-people-count-when-share").hasClass("active") ? 1 : 0;
  result.success = !0;
  return result;
};
