import $ from "jquery";
setTimeout(function () {
  $("input").focus(function () {
    $("#hint").hide();
  });
}, 3000);
