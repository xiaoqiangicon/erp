/**
 * Created by senntyou on 2016/12/5.
 */
define([
  'jquery',
  './data',
  './ajax',
  './bind',
  './view',
  'lib/bootstrap-material-datetimepicker',
], function($, commonData) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  // init
  (function() {
    var defaultExtremeDate,
      $paginationContainers = $('#pagination-containers'),
      $paginationContentContainers = $('#pagination-content-containers');
    // 时间选取控件
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
      $.seeBind.setData('data-select-date', defaultExtremeDate.start, {
        index: 1,
      }),
      $.seeBind.setData('data-select-date', defaultExtremeDate.end, {
        index: 2,
      }));

    // 创建今天的数据容器
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
});
