import zzhUtil from '../../../../com-deprecated/util';
import seeAjax from 'see-ajax';
import '../ajax';
import start from './start';
import data from '../data';
if (zzhUtil.urlParams.edit) {
  seeAjax(
    'info',
    {
      id: zzhUtil.urlParams.id,
    },
    res => {
      data.info = res.data;
      data.info.isEdit = !!zzhUtil.urlParams.edit;
      start();
    }
  );
} else {
  start();
}
