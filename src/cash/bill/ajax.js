import $ from 'jquery';
import commonVars from 'common/variables';
import 'lib/jquery.seeAjax';
var requestKeys = {
  billData: {
    year: 'year',
    status: 'status',
  },
  confirmBills: {
    ids: 'billIdList',
    extra: 'remarks',
    reward: 'reward',
  },
  questionBills: {
    ids: 'billIdList',
    extra: 'remarks',
  },
};
var preHandle = {
  billData: function(data) {
    delete data.year;
    delete data.status;
  },
};
var responseRefactor = {
  billData: {
    monthsData: 'data',
    _monthsData: [
      {
        bills: 'data',
        _bills: [
          {
            title: 'name',
            money: 'price',
            count: 'order_num',
            fee: 'percentMoney',
            charge: 'counter_fee',
            assistance: 'subsidy_counter_fee',
            extra: 'remarks',
            disabled: 'isPromotion',
            promoteAmountForZzh: 'serviceMoney',
            promoteAmountForUser: 'promotionMoney',
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
    },
  },
  receiptsInfo: {
    maxWaitingReceipts: 'maxExpressReceiptNum',
    currentWaitingReceipts: 'noExpressReceiptNum',
    haveOrderInHandling: 'isHavePickUp',
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    !!res.msg && (res.message = res.msg);
  },
  billData: function(res) {
    res.currentPage = 1;
    res.totalPages = 1;
    res.year = commonVars.today.year;
    res.status = 1;
    var totalCount = 0;
    var totalMoney = 0;
    var totalFee = 0;
    var totalCharge = 0;
    var totalAssistance = 0;
    var totalPromoteAmountForZzh = 0;
    var totalPromoteAmountForUser = 0;
    res.monthsData.map(function(item) {
      var tempMonth = item.month,
        tempMonthArray = tempMonth.split('-');
      item.year = parseInt(tempMonthArray[0]);
      item.month = parseInt(tempMonthArray[1]);
      item.bills.map(function(subItem) {
        if (subItem.disabled) return;
        totalCount += subItem.count;
        totalMoney += subItem.money;
        !subItem.fee && (subItem.fee = 0);
        totalFee += subItem.fee;
        totalCharge += subItem.charge;
        totalAssistance += subItem.assistance;
        !subItem.promoteAmountForZzh && (subItem.promoteAmountForZzh = 0);
        totalPromoteAmountForZzh += subItem.promoteAmountForZzh;
        !subItem.promoteAmountForUser && (subItem.promoteAmountForUser = 0);
        totalPromoteAmountForUser += subItem.promoteAmountForUser;
      });
    });
    res.totalCount = totalCount;
    res.totalMoney = parseFloat(totalMoney.toFixed(2));
    res.realTotalMoney = parseFloat(
      (
        totalMoney +
        totalAssistance -
        totalCharge -
        totalFee -
        totalPromoteAmountForZzh -
        totalPromoteAmountForUser
      ).toFixed(2)
    );
    res.totalFee = parseFloat(totalFee.toFixed(2));
    res.totalCharge = parseFloat(totalCharge.toFixed(2));
    res.totalAssistance = parseFloat(totalAssistance.toFixed(2));
    res.totalPromoteAmountForZzh = parseFloat(
      totalPromoteAmountForZzh.toFixed(2)
    );
    res.totalPromoteAmountForUser = parseFloat(
      totalPromoteAmountForUser.toFixed(2)
    );
  },
  stat: function(res) {
    res.data = {};
    res.data.total = res.sumPrice;
    res.data.available = res.canPickUpMoney;
    res.data.taken = res.pickUpMoney;
    res.data.chanzai = res.chanzaiOrderMoney;
  },
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    billData: 'billData',
    confirmBills: 'confirmBills',
    cancelBills: 'cancelBills',
    questionBills: 'questionBills',
    accountInfo: 'accountInfo',
    receiptsInfo: 'receiptsInfo',
    stat: 'stat',
  },
  url: {
    billData: [
      '/zzhadmin/getBillList/',
      '/src/cash/bill/mock/bill_data_server.json',
      '/src/cash/bill/mock/bill_data.json',
    ],
    confirmBills: [
      '/zzhadmin/pickUpMoney/?type=1',
      '/src/cash/bill/mock/confirm_bill_server.json',
      '/src/cash/bill/mock/confirm_bill.json',
    ],
    cancelBills: ['', '', '/src/cash/bill/mock/cancel_bill.json'],
    questionBills: [
      '/zzhadmin/pickUpMoney/?type=2',
      '/src/cash/bill/mock/question_bill_server.json',
      '/src/cash/bill/mock/question_bill.json',
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
    stat: [
      '/zzhadmin/getSumMoney/',
      '/src/cash/index/mock/stat_server.json',
      '/src/cash/index/mock/stat.json',
    ],
  },
  requestKeys: {
    billData: [
      requestKeys.billData,
      requestKeys.billData,
      {
        year: 'year',
        status: 'status',
      },
    ],
    confirmBills: [
      requestKeys.confirmBills,
      requestKeys.confirmBills,
      {
        ids: 'ids',
        extra: 'extra',
        reward: 'reward',
      },
    ],
    cancelBills: [
      void 0,
      void 0,
      {
        ids: 'ids',
      },
    ],
    questionBills: [
      requestKeys.questionBills,
      requestKeys.questionBills,
      {
        ids: 'ids',
        extra: 'extra',
      },
    ],
  },
  responseRefactor: {
    billData: [responseRefactor.billData, responseRefactor.billData],
    accountInfo: [responseRefactor.accountInfo, responseRefactor.accountInfo],
    receiptsInfo: [
      responseRefactor.receiptsInfo,
      responseRefactor.receiptsInfo,
    ],
  },
  preHandle: {
    billData: [preHandle.billData, preHandle.billData],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    billData: [postHandle.billData, postHandle.billData],
    stat: [postHandle.stat, postHandle.stat],
  },
});
