const zzhUtil = require('../../../../../old-com/util/src');
const seeAjax = require('see-ajax').default;

require('../ajax');
const start = require('./start');
const data = require('../data');

// 是编辑页
if (zzhUtil.urlParams.edit) {
  seeAjax('info', { id: zzhUtil.urlParams.id }, res => {
    data.info = res.data;
    data.info.isEdit = !!zzhUtil.urlParams.edit;
    start();
  });
} else {
  start();
}
