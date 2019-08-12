import $ from "jquery";
import "juicer";
var tpl = {
  row: juicer($("#tpl-row").html())
};
export default tpl;
