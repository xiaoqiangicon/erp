import $ from "jquery";
import seeView from "see-view";
seeView({
  events: {
    "input [data-text-count]": "onInputTextCount",
    "propertychange [data-text-count]": "onInputTextCount",
    "click [data-toggle-active]": "onClickToggleActive"
  },
  onInputTextCount: e => {
    const $this = $(e.target);
    const id = $this.attr("data-text-count");
    $(`[data-text-count-show="${id}"]`).text($this.val().length);
  },
  onClickToggleActive: e => {
    $(e.currentTarget).toggleClass("active");
  }
});
