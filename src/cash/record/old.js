import $ from 'jquery';
import commonData from './data';
import './ajax';
import './bind';
import './view';
import 'lib/bootstrap-material-datetimepicker';
import * as seeBind from '../../../../pro-com/src/libs-es5/see-bind';
$.ajaxSetup({
  cache: !1,
});
(function() {
  var defaultExtremeDate,
    $paginationContainers = $('#pagination-containers'),
    $paginationContentContainers = $('#pagination-content-containers');
  $('[data-select-date]').bootstrapMaterialDatePicker({
    time: false,
    lang: 'zh-cn',
    cancelText: '取消',
    okText: '确定',
    clearText: '清除',
    nowText: '现在',
    clearButton: true,
  });
  !!commonData.params.year &&
    ((defaultExtremeDate = commonData.getExtremeDate(
      commonData.params.year,
      commonData.params.month
    )),
    seeBind.setData('data-select-date', defaultExtremeDate.start, {
      index: 1,
    }),
    seeBind.setData('data-select-date', defaultExtremeDate.end, {
      index: 2,
    }));
  $paginationContainers.append(
    commonData.tpl.paginationContainer.render({
      startDate: !!defaultExtremeDate ? defaultExtremeDate.start : '',
      endDate: !!defaultExtremeDate ? defaultExtremeDate.end : '',
    })
  );
  $paginationContentContainers.append(
    commonData.tpl.dateContentContainer.render({
      startDate: !!defaultExtremeDate ? defaultExtremeDate.start : '',
      endDate: !!defaultExtremeDate ? defaultExtremeDate.end : '',
    })
  );
  $paginationContentContainers.find('[data-date-content]').html(
    commonData.tpl.paginationContentContainer.render({
      page: 1,
      startDate: !!defaultExtremeDate ? defaultExtremeDate.start : '',
      endDate: !!defaultExtremeDate ? defaultExtremeDate.end : '',
    })
  );
  !!commonData.params.year
    ? commonData.requestList(
        defaultExtremeDate.start,
        defaultExtremeDate.end,
        1
      )
    : commonData.requestList();
})();
