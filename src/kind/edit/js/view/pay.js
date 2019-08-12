import $ from "jquery";
import seeView from "see-view";
import payItemTpl from "../tpl/main/detail/pay_item";
seeView({
  events: {
    "click [data-pay-item-icon-delete]": "onClickPayItemIconDelete",
    "click [data-pay-item-delete]": "onClickPayItemDelete",
    "click [data-pay-item-copy]": "onClickPayItemCopy",
    "click #pay-add": "onClickPayAdd"
  },
  onClickPayItemIconDelete: e => {
    const $this = $(e.target);
    const $parent = $this.parent();
    const $grand = $parent.parent();
    $parent.find("[data-pay-item-image]").attr({
      src: ""
    });
    $parent.addClass("hide");
    $grand.find("[data-pay-item-add]").removeClass("hide");
  },
  onClickPayItemDelete: e => {
    $(e.target).parents("[data-pay-item]").remove();
  },
  onClickPayItemCopy: e => {
    const $container = $(e.target).parents("[data-pay-item]");
    const name = $container.find("[data-pay-item-name]").val();
    const price = $container.find("[data-pay-item-price]").val();
    const desc = $container.find("[data-pay-item-desc]").val();
    const icon = $container.find("[data-pay-item-image]").attr("src") || "";
    const $payContainer = $("#pay-container");
    const $el = $(payItemTpl({
      id: 0,
      name,
      price,
      desc,
      icon
    }));
    $payContainer.append($el);
  },
  onClickPayAdd: e => {
    const $payContainer = $("#pay-container");
    const $el = $(payItemTpl({
      id: 0,
      name: "",
      price: "",
      desc: "",
      icon: ""
    }));
    $payContainer.append($el);
  }
});
