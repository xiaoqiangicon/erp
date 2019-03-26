/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const refactor = {
  data: [
    {
      name: 'name',
      value: 'value',
    },
  ],
};

seeAjax.config('getCourierCompanyList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getCourierCompanyList',
    '/src/buddhist/order_manage/mock/get_courier_company_list.json',
  ],
  refactor: [refactor, refactor],
});
