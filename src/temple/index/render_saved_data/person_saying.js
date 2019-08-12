import $ from "jquery";
import indexData from "../data";
import commonTpl from "../tpl/common";
import util from "../view/figure/util";
import "jquery-confirm";
function postHandleForPersonSaying($displayComponent, $editContainer, data) {
  if (data.components) data.components.forEach(function (item) {
    item.description = item.description.replace(/<br>/g, "\n");
  });
  $editContainer.find("[data-edit-com-figure-body]").sortable({
    stop: function (e) {
      util.afterSortable();
    }
  });
}
export default postHandleForPersonSaying;
