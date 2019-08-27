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
    '/src/insurance/manage/mock/get_list.json',
  ],
  refactor: [refactor, refactor],
});
