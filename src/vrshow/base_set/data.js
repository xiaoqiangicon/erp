/**
 * Created by kang on 2017/10/23.
 */

define(['common/env_data'], function(envData) {
  var data = {
    // 二维码尺寸
    qrcodeSizes: [
      300, // 小
      500, // 中
      1000, // 大
    ],
    templeSetRes: {},
    updateTempleSetParams: {
      giftList: [
        { type: 1, content: '', formType: '' },
        { type: 2, content: '', formType: '' },
        { type: 3, content: '', formType: '' },
        { type: 4, content: '', formType: '' },
      ],
      freeNumber: '',
      musicId: '',
    },
  };

  return data;
});
