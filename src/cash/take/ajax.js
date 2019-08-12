import $ from "jquery";
import data from "./data";
import "lib/jquery.seeAjax";
var listPerPage = 20;
var requestKeysOuter = {
  list: {
    startDate: "startTime",
    endDate: "endTime",
    page: "pageNumber",
    status: "type"
  },
  cancel: {
    id: "pickUpId"
  },
  addReceipts: {
    id: "pickUpId",
    images: "pics"
  }
};
var responseRefactorOuter = {
  list: {
    data: [{
      specialCharge: "specialPickUpMoney",
      time: "add_time^",
      money: "price",
      isQuestion: "is_question",
      feedBackImages: "picList",
      receipts: "feedBackPicList",
      createdAt: "add_time^",
      updatedAt: "update_time",
      details: [{
        data: [{
          title: "name",
          money: "price",
          fee: "percentMoney",
          count: "order_num",
          extra: "remarks",
          charge: "counter_fee",
          assistance: "subsidy_counter_fee",
          promoteAmountForZzh: "serviceMoney",
          promoteAmountForUser: "promotionMoney"
        }]
      }]
    }]
  },
  accountInfo: {
    status: "authBankType",
    data: {
      bank: "bankName",
      subBank: "bankBranchName",
      bankCard: "bankCardNumber",
      account: "bankCardUserName",
      licenceImage: "certificatePicUrl",
      idCardImage1: "identityCardPic",
      idCardImage2: "identityCardPic2",
      reason: "examineMessage"
    }
  }
};
var preHandleOuter = {
  list: function (data) {
    data.pageNumber -= 1;
    data.pageSize = listPerPage;
  }
};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    !!res.msg && (res.message = res.msg);
  },
  list: function (res) {
    res.totalPages = Math.ceil(res.cnt / listPerPage);
    res.data.map(function (item) {
      item.typeText = data.typeTexts[item.isQuestion][item.type - 1];
      item.time = item.time.slice(0, 16);
      var totalCount = 0;
      var totalMoney = 0;
      var totalFee = 0;
      var totalCharge = 0;
      var totalAssistance = 0;
      var totalPromoteAmountForZzh = 0;
      var totalPromoteAmountForUser = 0;
      item.feedBackImages.length && (item.feedBackImagesString = item.feedBackImages.join(","));
      item.receipts.length && (item.receiptsString = item.receipts.join(","));
      item.details.map(function (detailItem) {
        var tempMonth = detailItem.month, tempMonthArray = tempMonth.split("-");
        detailItem.year = parseInt(tempMonthArray[0]);
        detailItem.month = parseInt(tempMonthArray[1]);
        detailItem.data.map(function (detailItemMonthItem) {
          totalCount += detailItemMonthItem.count;
          totalMoney += detailItemMonthItem.money;
          totalFee += detailItemMonthItem.fee || 0;
          totalCharge += detailItemMonthItem.charge;
          totalAssistance += detailItemMonthItem.assistance;
          !detailItemMonthItem.promoteAmountForZzh && (detailItemMonthItem.promoteAmountForZzh = 0);
          totalPromoteAmountForZzh += detailItemMonthItem.promoteAmountForZzh;
          !detailItemMonthItem.promoteAmountForUser && (detailItemMonthItem.promoteAmountForUser = 0);
          totalPromoteAmountForUser += detailItemMonthItem.promoteAmountForUser;
        });
      });
      !item.reward && (item.reward = 0);
      !item.specialCharge && (item.specialCharge = 0);
      item.totalCount = totalCount;
      item.totalMoney = parseFloat(totalMoney.toFixed(2));
      item.realTotalMoney = parseFloat((totalMoney + totalAssistance - totalCharge - totalFee - item.reward - item.specialCharge - totalPromoteAmountForZzh - totalPromoteAmountForUser).toFixed(2));
      item.totalFee = parseFloat(totalFee.toFixed(2));
      item.totalCharge = parseFloat(totalCharge.toFixed(2));
      item.totalAssistance = parseFloat(totalAssistance.toFixed(2));
      item.totalPromoteAmountForZzh = parseFloat(totalPromoteAmountForZzh.toFixed(2));
      item.totalPromoteAmountForUser = parseFloat(totalPromoteAmountForUser.toFixed(2));
    });
  }
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    list: "list",
    cancel: "cancel",
    addReceipts: "addReceipts",
    accountInfo: "accountInfo"
  },
  url: {
    list: ["/zzhadmin/pickUpMoneyList/", "/src/cash/take/mock/list_server.json", "/src/cash/take/mock/list.json"],
    cancel: ["/zzhadmin/revokePickUp/", "/src/cash/take/mock/cancel_server.json", "/src/cash/take/mock/cancel.json"],
    addReceipts: ["/zzhadmin/addPickUpFeedBackPic/", "/src/cash/take/mock/add_receipts_server.json", "/src/cash/take/mock/add_receipts.json"],
    accountInfo: ["/zzhadmin/getTempleBank/", "/src/cash/account/edit/mock/info_server.json", "/src/cash/account/edit/mock/info.json"]
  },
  requestKeys: {
    list: [requestKeysOuter.list, requestKeysOuter.list, {
      startDate: "startDate",
      endDate: "endDate",
      page: "page",
      status: "status"
    }],
    cancel: [requestKeysOuter.cancel, requestKeysOuter.cancel, {
      id: "id"
    }],
    addReceipts: [requestKeysOuter.addReceipts, requestKeysOuter.addReceipts, {
      id: "id",
      images: "images"
    }]
  },
  responseRefactor: {
    list: [responseRefactorOuter.list, responseRefactorOuter.list],
    accountInfo: [responseRefactorOuter.accountInfo, responseRefactorOuter.accountInfo]
  },
  preHandle: {
    list: [preHandleOuter.list, preHandleOuter.list]
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    list: [postHandleOuter.list, postHandleOuter.list]
  }
});
