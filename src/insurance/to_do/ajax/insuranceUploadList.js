/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('insuranceUploadList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/insuranceUpdateReviewListExcel/',
    '/src/insurance/to_do/mock/insurance_upload_list',
  ],
});
