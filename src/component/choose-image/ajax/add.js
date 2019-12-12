import seeAjax from "see-ajax";
let requestKeys = {
  images: "picUrlList"
};
let postHandle = res => {
  res.success = res.result >= 0;
  res.message = res.msg || "未知错误，请稍后重试";
};
seeAjax.config("zzhChooseImageAdd", {
  method: ["post"],
  url: ["/zzhadmin/materialPicAdd/", "/src/component/choose-image/mock/add_server.json", "/src/component/choose-image/mock/add.json"],
  requestKeys: [requestKeys, requestKeys],
  postHandle: [postHandle, postHandle]
});
