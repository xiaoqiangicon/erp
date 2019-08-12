import $ from "jquery";
import _ from "underscore";
import Swiper from "swiper";
import browser from "util/browser";
import "../common/brand";
var option = {
  paginationClickable: !0,
  autoplay: 2000,
  autoplayDisableOnInteraction: !1,
  followFinger: !1,
  allowTouchMove: !1,
  loop: !0,
  simulateTouch: !1
};
var option1 = _.clone(option);
option1.pagination = "#swiper-pagination-1";
var swiper1 = new Swiper("#swiper-1", option1);
var option2 = _.clone(option);
option2.pagination = "#swiper-pagination-2";
var swiper2 = new Swiper("#swiper-2", option2);
var option3 = _.clone(option);
option3.pagination = "#swiper-pagination-3";
var swiper3 = new Swiper("#swiper-3", option3);
var option4 = _.clone(option);
option4.pagination = "#swiper-pagination-4";
var swiper4 = new Swiper("#swiper-4", option4);
$("#nav-category").click(function (e) {
  $("#nav").toggleClass("show-category");
  $("body").toggleClass("overflow-hidden");
});
