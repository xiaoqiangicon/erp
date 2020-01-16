import $ from 'jquery';
import seeView from 'see-view';
import zzhUtil from '../../../com-deprecated/util';
import checkStartEndDate from 'util/check_start_end_date';
import dialog from 'util/dialog';
import data from './data';
import requestList from './util/request_list';
seeView({
  events: {
    'click #main-search': 'onClickMainSearch',
    'click #main-export': 'onClickMainExport',
  },
  onClickMainSearch: e => {
    const startDate = $('[data-date-input="1"]').val();
    const endDate = $('[data-date-input="2"]').val();
    if (!checkStartEndDate(startDate, endDate)) {
      dialog('开始时间不能大于结束时间，请重新选择');
      return;
    }
    data.search.startDate = startDate;
    data.search.endDate = endDate;
    requestList();
  },
  onClickMainExport: e => {
    const startDate = $('[data-date-input="1"]').val();
    const endDate = $('[data-date-input="2"]').val();
    if (!checkStartEndDate(startDate, endDate)) {
      dialog('开始时间不能大于结束时间，请重新选择');
      return;
    }
    location.href = `/zzhadmin/charityGetExcel/?charityId=${zzhUtil.urlParams.id}&startTime=${startDate}&endTime=${endDate}`;
  },
});
