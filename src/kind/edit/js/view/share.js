import $ from "jquery";
import seeView from "see-view";
seeView({
  events: {
    "click [data-share-item-delete]": "onClickShareItemDelete"
  },
  onClickShareItemDelete: e => {
    $(e.target).parent().remove();
    $("#share-icon-add").removeClass("hide");
  }
});
