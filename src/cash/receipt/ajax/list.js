/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {
  res.data.forEach(item => {
    item.price = parseFloat(item.price).toFixed(2);
    if (parseInt(item.status, 10) === 1) {
      item.statusText = '待开发票';
    } else if (parseInt(item.status, 10) === 2) {
      item.statusText = '已取消';
    } else if (parseInt(item.statue, 10) === 0) {
      item.statusText = '已开发票';
    }
  });
};

seeAjax.config('list', {
  method: ['get'],
  stringify: [!0],
  url: ['/zzhadmin/getInvoiceList/', '/src/cash/receipt/mock/list'],
  post: [post, post, post],
});
