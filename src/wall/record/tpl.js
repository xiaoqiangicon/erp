import $ from "jquery";
import "juicer";
var tpl = {
  detail: juicer($("#tpl-detail").html()),
  contact: juicer($("#tpl-contact").html()),
  contactUnit: $("#tpl-contact-unit").html(),
  option: juicer($("#tpl-option").html()),
  regionCell: juicer($("#tpl-region-cell").html()),
  hover: juicer($("#tpl-hover").html())
};
export default tpl;
