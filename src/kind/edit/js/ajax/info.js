import seeAjax from "see-ajax";
const requestKeys = {
  id: "charityId"
};
const responseRefactor = {
  data: {
    title: "name",
    intro: "details",
    payItems: "spec",
    _payItems: [{
      desc: "benison",
      icon: "indexImg"
    }],
    shareTitle: "shareName",
    shareDesc: "shareDetails",
    shareIcon: "shareHeadImg",
    showPeopleCountWhenShare: "isShowJoinNum"
  }
};
const postHandle = res => {
  const covers = [];
  res.data.img && res.data.img.length && res.data.img.forEach(item => {
    covers.push(item.url);
  });
  res.data.covers = covers;
};
seeAjax.config("info", {
  url: ["/zzhadmin/charityGet/", "/src/kind/edit/data/info_server.json", "/src/kind/edit/data/info.json"],
  requestKeys: [requestKeys, requestKeys],
  responseRefactor: [responseRefactor, responseRefactor],
  postHandle: [postHandle, postHandle]
});
