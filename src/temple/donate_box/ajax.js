import $ from "jquery";
import "lib/jquery.seeAjax";
var requestKeysOuter = {
  list: {
    page: "pageNumber",
    startDate: "startTime",
    endDate: "endTime"
  }
};
var responseRefactorOuter = {
  state: {
    totalDonate: "priceSum",
    monthDonate: "priceMonthSum",
    dayDonate: "priceDaySum"
  },
  list: {
    data: [{
      nickname: "nickName",
      avatar: "headImg",
      amount: "price",
      time: "addTime"
    }]
  }
};
var preHandleOuter = {
  list: function (data) {
    data.pageNumber -= 1;
    data.pageSize = 20;
  }
};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    typeof res.msg != "undefined" && (res.message = res.msg);
  },
  list: function (res) {
    res.totalPages = Math.ceil((res.total || 1) / 20);
  }
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    state: "state",
    list: "list",
    download: "download"
  },
  url: {
    state: ["/zzhadmin/meritBoxSumGet/", "/src/temple/donate_box/mock/state_server.json", "/src/temple/donate_box/mock/state.json"],
    list: ["/zzhadmin/meritBoxGetList/", "/src/temple/donate_box/mock/list_server.json", "/src/temple/donate_box/mock/list.json"]
  },
  requestKeys: {
    list: [requestKeysOuter.list, requestKeysOuter.list, {
      page: "page",
      startDate: "startDate",
      endDate: "endDate"
    }]
  },
  responseRefactor: {
    state: [responseRefactorOuter.state, responseRefactorOuter.state],
    list: [responseRefactorOuter.list, responseRefactorOuter.list]
  },
  preHandle: {
    list: [preHandleOuter.list, preHandleOuter.list]
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    list: [postHandleOuter.list, postHandleOuter.list]
  }
});
