import $ from "jquery";
import browser from "util/browser";
if (browser.isMobile) {
  var $brandRight = $("#brand-right");
  $brandRight.append($("#brand-menu-2"));
  $brandRight.append($("#brand-copyright"));
}
if (location.hostname.slice(-3) === ".cn") {
  $("#brand-copyright-number").text(1);
}
