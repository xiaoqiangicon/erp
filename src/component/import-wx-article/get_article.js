import $ from "jquery";
export default function(url, callback) {
  $.post("/zzhadmin/getWeixinArticle/", {
    url
  }, res => {
    callback(res);
  });
};
