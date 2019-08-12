import $ from "jquery";
var $selectedCount = $("#selected-count");
export default function () {
  $selectedCount.text($("[data-row-select].active").length);
}
