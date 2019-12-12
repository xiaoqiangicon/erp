import seeAjax from "see-ajax";
import data from "../data";
let requestKeys = {
  page: "pageNumber"
};
let responseRefactor = {
  totalPages: "totalNumber",
  totalCount: "count",
  data: [{
    image: "url"
  }]
};
let preHandle = req => {
  req.pageNumber -= 1;
  req.pageSize = data.perPage;
};
let postHandle = res => {
  res.success = res.result >= 0;
  res.message = res.msg || "未知错误，请稍后重试";
  !res.totalPages && (res.totalPages = 1);
};
seeAjax.config("zzhChooseImageSystemImages", {
  url: ["/zzhadmin/materialPicsGetList/?type=2", "/src/component/choose-image/mock/system_images_server.json", "/src/component/choose-image/mock/system_images.json"],
  requestKeys: [requestKeys, requestKeys],
  responseRefactor: [responseRefactor, responseRefactor],
  preHandle: [preHandle, preHandle],
  postHandle: [postHandle, postHandle]
});
