/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('update', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/addAndUpdateSupplies/', '/src/cash/supply/mock/update'],
});
