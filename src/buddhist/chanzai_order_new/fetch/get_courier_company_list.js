/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const refactor = {
  data: [
    {
      name: 'name',
      value: 'value',
    },
  ],
};

seeFetch.config('getCourierCompanyList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getCourierCompanyList',
    '/src/buddhist/chanzai_order_new/mock/get_courier_company_list.json',
  ],
  refactor: [refactor, refactor],
});
