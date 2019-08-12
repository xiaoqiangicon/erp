import $ from "jquery";
import commonVars from "common/variables";
$.ajaxSetup({
  cache: !1
});
if (parseInt(commonVars.params.edit)) {
  $("[data-next-link]").map(function () {
    var $this = $(this);
    $this.attr({
      href: $this.attr("href") + "&edit=1"
    });
  });
}
