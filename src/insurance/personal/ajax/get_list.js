/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const refactor = {
  data: [{}],
};

seeAjax.config('getList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getConversionOrderList',
    '/src/insurance/personal_list/mock/get_list',
  ],
  refactor: [refactor, refactor],
});
