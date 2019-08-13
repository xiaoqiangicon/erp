import $ from 'jquery';
import indexData from '../data';
import commonTpl from '../tpl/common';
import calendarTpl from '../tpl/calendar';
import 'lib/bootstrap-material-datetimepicker';
import 'jquery-confirm';
function postHandleForCalendar($displayComponent, $editContainer, data) {
  var pages = [],
    i,
    il;
  for (i = 0; i < data.totalPages; i++) pages.push(i + 1);
  $editContainer.find('[data-edit-calendar-pagination]').html(
    calendarTpl.editPagination.render({
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      pages: pages,
    })
  );
  $('[data-edit-calendar-select-date]').bootstrapMaterialDatePicker({
    time: false,
    lang: 'zh-cn',
    cancelText: '取消',
    okText: '确定',
    clearText: '清除',
    nowText: '现在',
    minDate: new Date(),
    withLunar: !0,
  });
}
export default postHandleForCalendar;
