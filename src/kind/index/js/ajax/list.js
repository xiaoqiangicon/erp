import seeAjax from "see-ajax";
const requestKeys = {
  page: "pageNum"
};
const responseRefactor = {
  data: [{
    title: "name",
    totalMoney: "totalPrice",
    totalPeople: "joinNum"
  }]
};
const preHandle = req => {
  req.pageNum -= 1;
  req.pageSize = 20;
};
const postHandle = res => {
  res.totalPages = Math.ceil((res.total || 0) / 20);
};
seeAjax.config("list", {
  url: ["/zzhadmin/charityList", "/src/kind/index/data/list_server.json", "/src/kind/index/data/list.json"],
  requestKeys: [requestKeys, requestKeys],
  responseRefactor: [responseRefactor, responseRefactor],
  preHandle: [preHandle, preHandle],
  postHandle: [postHandle, postHandle]
});
