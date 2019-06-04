/**
 * Created by senntyou on 2017/8/3.
 */

define(['common/env_data'], function(envData) {
  var data = {
    // 用于记录总页数，因为后台并不返回这个字段，所以只能每次在接口返回后更新这个
    totalPagesRecord: {
      // key: 'date:' + startDate + ':' + endDate
    },
    // temple id
    templeId: window.localStorage['templeid'],
    // 分享地址
    shareLink:
      'https://wx.zizaihome.com/website/meritBoxAuth?templeId=' +
      window.localStorage['templeid'] +
      (!!envData.envParamMark ? '&' + envData.envParamMark : ''),
    // 二维码尺寸
    qrcodeSizes: [
      300, // 小
      500, // 中
      1000, // 大
    ],
    filter: {
      startDate: '',
      endDate: '',
    },
    pagination: undefined,
  };

  return data;
});
