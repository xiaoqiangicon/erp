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
    '/zzhadmin/ceremonyGetList',
    '/src/buddhist/order_manage/mock/get_courier_company_list.json',
  ],
  refactor: [refactor, refactor],
});
