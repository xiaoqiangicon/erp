import $ from "jquery";
import LunarCalendar from "lunar-calendar";
import "lib/jquery.seeAjax";
var requestKeysOuter = {
  orders: {
    regionId: "wallId",
    remainDays: "endDays",
    search: "searchText",
    page: "pageIndex"
  },
  detail: {
    id: "recordId"
  },
  delete: {
    id: "id"
  }
};
var responseRefactorOuter = {
  regions: {
    data: [{
      memoConfig: "postScript",
      _memoConfig: [{
        type: "input_type",
        tip: "prompt_text",
        length: "font_length"
      }]
    }]
  },
  orders: {
    data: [{
      name: "writeName",
      recordTime: "addTime"
    }]
  },
  detail: {
    data: {
      name: "writeName",
      sequence: "number",
      yangShangRen: "alivePeople",
      wangShengZhe: "deadman"
    }
  }
};
var preHandleOuter = {
  orders: function (req) {
    req.pageSize = 20;
    req.pageIndex -= 1;
    !req.endDays && (req.endDays = 0);
  }
};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
  regions: function (res) {
    res.data && res.data.length && res.data.map(function (item) {
      var nameArray = item.name.split("-");
      nameArray.shift();
      item.shortedName = nameArray.join("-");
    });
  },
  orders: function (res) {
    res.totalPages = res.total ? Math.ceil(res.total / 20) : 1;
    res.data && res.data.length && res.data.map(function (item) {
      var contactNames = [];
      item.contactList && item.contactList.length && item.contactList.map(function (contactItem) {
        contactNames.push(contactItem.name);
      });
      item.contactNames = contactNames.join("<br>");
    });
  },
  detail: function (res) {
    if (res.data.contactList) {
      var contactListArray = res.data.contactList.split(",");
      res.data.contactList = [];
      contactListArray.map(function (item) {
        var itemArray = item.split("|");
        var newItem = {
          name: itemArray[0],
          phone: itemArray[1]
        };
        if (itemArray[2]) {
          var birthData = itemArray[2].split("-");
          var lunar = parseInt(birthData[3]);
          var year = parseInt(birthData[0]);
          var month = parseInt(birthData[1]);
          var day = parseInt(birthData[2]);
          newItem.lunar = lunar;
          if (!lunar) newItem.birth = birthData[0] + "-" + birthData[1] + "-" + birthData[2]; else {
            var lunarData = LunarCalendar.solarToLunar(year, month, day);
            newItem.birth = lunarData.lunarYear + "-" + (lunarData.lunarMonth > 9 ? lunarData.lunarMonth : "0" + lunarData.lunarMonth) + "-" + (lunarData.lunarDay > 9 ? lunarData.lunarDay : "0" + lunarData.lunarDay);
          }
        }
        res.data.contactList.push(newItem);
      });
    } else {
      res.data.contactList = [];
    }
  }
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    houses: "houses",
    regions: "regions",
    orders: "orders",
    detail: "detail",
    delete: "delete"
  },
  url: {
    houses: ["/zzhadmin/buddhaWall_hallList/", "/src/wall/record/mock/houses_server.json", "/src/wall/record/mock/houses.json"],
    regions: ["/zzhadmin/buddhaWallWallList/", "/src/wall/remind/mock/regions_server.json", "/src/wall/remind/mock/regions.json"],
    orders: ["/zzhadmin/buddhaWall_recordList/", "/src/wall/custom/mock/orders_server.json", "/src/wall/custom/mock/orders.json"],
    detail: ["/zzhadmin/buddhaWall_getRecord/", "/src/wall/custom/mock/detail_server.json", "/src/wall/custom/mock/detail.json"],
    delete: ["/zzhadmin/buddhaWall_delrecord/", "/src/wall/custom/mock/delete_server.json", "/src/wall/custom/mock/delete.json"]
  },
  requestKeys: {
    orders: [requestKeysOuter.orders, requestKeysOuter.orders, {
      regionId: "regionId",
      remainDays: "remainDays",
      search: "search",
      page: "page"
    }],
    detail: [requestKeysOuter.detail, requestKeysOuter.detail, {
      id: "id"
    }],
    delete: [requestKeysOuter.delete, requestKeysOuter.delete, {
      id: "id"
    }]
  },
  responseRefactor: {
    regions: [responseRefactorOuter.regions, responseRefactorOuter.regions],
    orders: [responseRefactorOuter.orders, responseRefactorOuter.orders],
    detail: [responseRefactorOuter.detail, responseRefactorOuter.detail]
  },
  preHandle: {
    orders: [preHandleOuter.orders, preHandleOuter.orders]
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    regions: [postHandleOuter.regions, postHandleOuter.regions],
    orders: [postHandleOuter.orders, postHandleOuter.orders],
    detail: [postHandleOuter.detail, postHandleOuter.detail]
  }
});
