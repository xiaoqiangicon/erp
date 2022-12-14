import $ from 'jquery';
import commonData from './data';
import './ajax';
import './view';
import 'lib/bootstrap-material-datetimepicker';

$.ajaxSetup({
  cache: !1,
});

var defaultExtremeDate = {},
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
if (commonData.params.year) {
  defaultExtremeDate = commonData.getExtremeDate(
    commonData.params.year,
    commonData.params.month
  );
}
$('[data-select-date="1"]').val(defaultExtremeDate.start || '');
$('[data-select-date="2"]').val(defaultExtremeDate.end || '');
$paginationContainers.append(
  commonData.tpl.paginationContainer.render({
    startDate: defaultExtremeDate.start || '',
    endDate: defaultExtremeDate.end || '',
  })
);
$paginationContentContainers.append(
  commonData.tpl.dateContentContainer.render({
    startDate: defaultExtremeDate.start || '',
    endDate: defaultExtremeDate.end || '',
  })
);
$paginationContentContainers.find('[data-date-content]').html(
  commonData.tpl.paginationContentContainer.render({
    page: 1,
    startDate: defaultExtremeDate.start || '',
    endDate: defaultExtremeDate.end || '',
  })
);
!!commonData.params.year
  ? commonData.requestList(
      defaultExtremeDate.start || '',
      defaultExtremeDate.end || '',
      1
    )
  : commonData.requestList();
