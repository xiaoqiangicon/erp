import $ from 'jquery';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import func from './function';
import './ajax';
import seeView from 'see-view';
seeView({
  events: {
    'click #filter-submit': 'onClickFilterSubmit',
    'click #export': 'onClickExport',
  },
  onClickFilterSubmit: function(e) {
    var $startDate = $('#filter-start-date'),
      startDate = $startDate.val(),
      startDateInt =
        !!startDate &&
        parseInt(
          startDate.slice(0, 4) + startDate.slice(5, 7) + startDate.slice(8, 10)
        ),
      $endDate = $('#filter-end-date'),
      endDate = $endDate.val(),
      endDateInt =
        !!endDate &&
        parseInt(
          endDate.slice(0, 4) + endDate.slice(5, 7) + endDate.slice(8, 10)
        );
    if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
      commonFunc.alert('您选择的起始时间大于了结束时间，请重新选择');
      return;
    }
    data.filter.startDate = startDate;
    data.filter.endDate = endDate;
    func.requestList();
  },
  onClickExport: function(e) {
    var $startDate = $('#filter-start-date'),
      startDate = $startDate.val(),
      startDateInt =
        !!startDate &&
        parseInt(
          startDate.slice(0, 4) + startDate.slice(5, 7) + startDate.slice(8, 10)
        ),
      $endDate = $('#filter-end-date'),
      endDate = $endDate.val(),
      endDateInt =
        !!endDate &&
        parseInt(
          endDate.slice(0, 4) + endDate.slice(5, 7) + endDate.slice(8, 10)
        );
    if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
      fn.alert('您选择的起始时间大于了结束时间，请重新选择');
      return;
    }
    window.open(
      '/zzhadmin/getArticleSuixiExcel/?startTime=' +
        startDate +
        '&endTime=' +
        endDate
    );
  },
});
