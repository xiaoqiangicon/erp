import $ from 'jquery';
import data from './data';
import seeAjax from 'see-ajax';
var listPerPage = 20;
var requestKeys = {
  list: {
    startDate: 'startTime',
    endDate: 'endTime',
    page: 'pageNumber',
    status: 'type',
  },
  cancel: {
    id: 'pickUpId',
  },
  addReceipts: {
    id: 'pickUpId',
    images: 'pics',
  },
};
var responseRefactor = {
  list: {
    data: [
      {
        specialCharge: 'specialPickUpMoney',
        time: 'add_time',
        money: 'price',
        isQuestion: 'is_question',
        feedBackImages: 'picList',
        receipts: 'feedBackPicList',
        createdAt: 'add_time',
        updatedAt: 'update_time',
        details: [
          {
            data: [
              {
                title: 'name',
                money: 'price',
                fee: 'percentMoney',
                count: 'order_num',
                extra: 'remarks',
                charge: 'counter_fee',
                assistance: 'subsidy_counter_fee',
                promoteAmountForZzh: 'serviceMoney',
                promoteAmountForUser: 'promotionMoney',
              },
            ],
          },
        ],
      },
    ],
  },
  getPickUpDetails: {
    data: [
      {
        details: [
          {
            data: [
              {
                title: 'name',
                money: 'price',
                fee: 'percentMoney',
                count: 'order_num',
                extra: 'remarks',
                charge: 'counter_fee',
                assistance: 'subsidy_counter_fee',
                promoteAmountForZzh: 'serviceMoney',
                promoteAmountForUser: 'promotionMoney',
              },
            ],
          },
        ],
      },
    ],
  },
  accountInfo: {
    status: 'authBankType',
    data: {
      bank: 'bankName',
      subBank: 'bankBranchName',
      bankCard: 'bankCardNumber',
      account: 'bankCardUserName',
      licenceImage: 'certificatePicUrl',
      idCardImage1: 'identityCardPic',
      idCardImage2: 'identityCardPic2',
      reason: 'examineMessage',
    },
  },
};
var preHandle = {
  list: function(data) {
    data.pageNumber -= 1;
    data.pageSize = listPerPage;
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    !!res.msg && (res.message = res.msg);
  },
  list: function(res) {
    res.totalPages = Math.ceil(res.cnt / listPerPage);
    res.data.map(function(item) {
      item.typeText = data.typeTexts[item.isQuestion][item.type - 1];
      item.time = item.time.slice(0, 16);
      var totalCount = 0;
      var totalMoney = 0;
      var totalFee = 0;
      var totalCharge = 0;
      var totalAssistance = 0;
      var totalPromoteAmountForZzh = 0;
      var totalPromoteAmountForUser = 0;
      item.feedBackImages.length &&
        (item.feedBackImagesString = item.feedBackImages.join(','));
      item.receipts.length && (item.receiptsString = item.receipts.join(','));
      item.details.map(function(detailItem) {
        var tempMonth = detailItem.month,
          tempMonthArray = tempMonth.split('-');
        detailItem.year = parseInt(tempMonthArray[0]);
        detailItem.month = parseInt(tempMonthArray[1]) + '月';
        detailItem.data.map(function(detailItemMonthItem) {
          totalCount += detailItemMonthItem.count;
          totalMoney += detailItemMonthItem.money;
          totalFee += detailItemMonthItem.fee || 0;
          totalCharge += detailItemMonthItem.charge;
          totalAssistance += detailItemMonthItem.assistance;
          !detailItemMonthItem.promoteAmountForZzh &&
            (detailItemMonthItem.promoteAmountForZzh = 0);
          totalPromoteAmountForZzh += detailItemMonthItem.promoteAmountForZzh;
          !detailItemMonthItem.promoteAmountForUser &&
            (detailItemMonthItem.promoteAmountForUser = 0);
          totalPromoteAmountForUser += detailItemMonthItem.promoteAmountForUser;
        });
      });
      !item.reward && (item.reward = 0);
      !item.specialCharge && (item.specialCharge = 0);
      item.totalCount = totalCount;
      item.totalMoney = parseFloat(totalMoney.toFixed(2));
      item.realTotalMoney = parseFloat(
        (
          totalMoney +
          totalAssistance -
          totalCharge -
          totalFee -
          item.reward -
          item.specialCharge -
          totalPromoteAmountForZzh -
          totalPromoteAmountForUser
        ).toFixed(2)
      );
      item.totalFee = parseFloat(totalFee.toFixed(2));
      item.totalCharge = parseFloat(totalCharge.toFixed(2));
      item.totalAssistance = parseFloat(totalAssistance.toFixed(2));
      item.totalPromoteAmountForZzh = parseFloat(
        totalPromoteAmountForZzh.toFixed(2)
      );
      item.totalPromoteAmountForUser = parseFloat(
        totalPromoteAmountForUser.toFixed(2)
      );
    });
  },
  getPickUpDetails: function(res) {
    res.data.map(function(item) {
      item.details.map(function(detailItem) {
        var tempMonth = detailItem.month,
          tempMonthArray = tempMonth.split('-');
        if (
          tempMonth.length === 1 &&
          !isNaN(parseInt(tempMonthArray[0])) &&
          !isNaN(Number(tempMonthArray[0])) &&
          !isNaN(Number(tempMonthArray[1]))
        ) {
          detailItem.year = parseInt(tempMonthArray[0]);
          detailItem.month = parseInt(tempMonthArray[1]) + '月';
        }
      });
    });
  },
};
const configs = {
  url: {
    list: [
      '/zzhadmin/pickUpMoneyList/',
      '/src/cash/take/mock/list_server.json',
      '/src/cash/take/mock/list.json',
    ],
    cancel: [
      '/zzhadmin/revokePickUp/',
      '/src/cash/take/mock/cancel_server.json',
      '/src/cash/take/mock/cancel.json',
    ],
    addReceipts: [
      '/zzhadmin/addPickUpFeedBackPic/',
      '/src/cash/take/mock/add_receipts_server.json',
      '/src/cash/take/mock/add_receipts.json',
    ],
    accountInfo: [
      '/zzhadmin/getTempleBank/',
      '/src/cash/account/edit/mock/info_server.json',
      '/src/cash/account/edit/mock/info.json',
    ],
    receiptsInfo: [
      '/zzhadmin/pickUpPrompt/',
      '/src/cash/bill/mock/receipts_info_server.json',
      '/src/cash/bill/mock/receipts_info.json',
    ],
    getPickUpDetails: [
      '/zzhadmin/getPickUpDetails/',
      '/src/cash/take/mock/get_pickup_details_server.json',
      '/src/cash/take/mock/get_pickup_details_server.json',
    ],
  },
  requestKeys: {
    list: [
      requestKeys.list,
      requestKeys.list,
      {
        startDate: 'startDate',
        endDate: 'endDate',
        page: 'page',
        status: 'status',
      },
    ],
    cancel: [
      requestKeys.cancel,
      requestKeys.cancel,
      {
        id: 'id',
      },
    ],
    addReceipts: [
      requestKeys.addReceipts,
      requestKeys.addReceipts,
      {
        id: 'id',
        images: 'images',
      },
    ],
  },
  responseRefactor: {
    list: [responseRefactor.list, responseRefactor.list],
    accountInfo: [responseRefactor.accountInfo, responseRefactor.accountInfo],
  },
  preHandle: {
    list: [preHandle.list, preHandle.list],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    list: [postHandle.list, postHandle.list],
    getPickUpDetails: [
      postHandle.getPickUpDetails,
      postHandle.getPickUpDetails,
    ],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('list', {
  url: configs.url.list,
  requestKeys: configs.requestKeys.list,
  preHandle: configs.preHandle.list,
  responseRefactor: configs.responseRefactor.list,
  postHandle: configs.postHandle.list,
});

seeAjax.config('cancel', {
  url: configs.url.cancel,
  requestKeys: configs.requestKeys.cancel,
  preHandle: configs.preHandle.cancel,
  responseRefactor: configs.responseRefactor.cancel,
  postHandle: configs.postHandle.cancel,
});

seeAjax.config('addReceipts', {
  method: ['post'],
  url: configs.url.addReceipts,
  requestKeys: configs.requestKeys.addReceipts,
  preHandle: configs.preHandle.addReceipts,
  responseRefactor: configs.responseRefactor.addReceipts,
  postHandle: configs.postHandle.addReceipts,
});

seeAjax.config('accountInfo', {
  url: configs.url.accountInfo,
  requestKeys: configs.requestKeys.accountInfo,
  preHandle: configs.preHandle.accountInfo,
  responseRefactor: configs.responseRefactor.accountInfo,
  postHandle: configs.postHandle.accountInfo,
});

// 新增判断当前是否有正在提现账单
seeAjax.config('receiptsInfo', {
  url: configs.url.receiptsInfo,
});

seeAjax.config('getPickUpDetails', {
  url: configs.url.getPickUpDetails,
  responseRefactor: configs.responseRefactor.getPickUpDetails,
  method: 'POST',
  postHandle: configs.postHandle.getPickUpDetails,
});
