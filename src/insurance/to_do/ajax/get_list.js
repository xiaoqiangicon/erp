/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const refactor = {
  totalCount: 'total',
  data: [{}],
};

seeAjax.config('getList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getConversionOrderList',
    '/src/insurance/to_do/mock/get_list',
  ],
  refactor: [refactor, refactor],
});
