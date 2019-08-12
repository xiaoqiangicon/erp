import $ from "jquery";
import "lib/jquery.seeView";
$.seeView({
  events: {
    "click [data-popup-close]": "onClickPopupClose",
    "click .modal": "onClickModal"
  },
  onClickPopupClose: function (e) {
    $(e.target).parents(".modal").hide();
    $("body").removeClass("overflow-hidden");
  },
  onClickModal: function (e) {
    if (e.target === e.currentTarget) {
      $(e.target).hide();
      $("body").removeClass("overflow-hidden");
    }
  }
});
