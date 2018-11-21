/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

seeAjax.config('items', {
  url: ['', '', '/static/src/promote/manage/mock/items'],
  post: [
    undefined,
    undefined,
    res => {
      res.data.forEach(item => {
        item.priceText = item.price;
        item.noNeedPay = !1;
        if (item.priceType === 2) {
          item.priceText = '无需支付';
          item.noNeedPay = !0;
        } else if (item.priceType === 3) item.priceText = '随喜';

        item.chargeText = item.charge;
        if (!item.hasCharge) item.chargeText = '-';
        else if (item.chargeType === 2) item.chargeText = `支付价格*${item.charge}%`;

        item.profitText = item.profit;
        if (item.profitType === 2) item.profitText = `支付价格*${item.profit}%`;
      });
    },
  ],
});
