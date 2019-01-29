/**
 * Created by senntyou on 2017/2/27.
 */

define([
  'jquery',
  '../data',
  '../tpl/common',
  '../tpl/calendar',
  'lib/bootstrap-material-datetimepicker',
  'jquery-confirm',
], function($, indexData, commonTpl, calendarTpl) {
  // 添加佛历组件后事件添加
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
    // 查询日期输入添加日期选择组件
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

  return postHandleForCalendar;
});
