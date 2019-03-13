/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {};

seeFetch.config('print', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/printAppointOrder',
    '/src/buddhist/order_manage/mock/success.json',
  ],
  req: [req, req],
});
