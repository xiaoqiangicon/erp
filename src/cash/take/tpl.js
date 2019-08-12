import $ from "jquery";
import "juicer";
var tpl = {
  unit: juicer($("#tpl-unit").html()),
  detail: juicer($("#tpl-detail").html()),
  popupReceiptsRow: juicer($("#tpl-popup-receipts-row").html())
};
export default tpl;
