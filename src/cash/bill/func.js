/**
 * Created by senntyou on 2017/3/29.
 */
define([
  'jquery',
  'tippy.js',
  'common/variables',
  './data',
  './tpl',
  './ajax',
], function($, tippy, commonVars, data, tpl) {
  var func = {};

  // 请求订单
  func.requestBillData = function(year, status) {
    !year && (year = commonVars.today.year);
    !status && (status = 1);

    $.seeAjax.get('billData', { year: year, status: status }, function(res) {
      if (!res.success) return;

      $.seeBind.setData('year-content', res, { year: year, status: status });
      tippy.default('[data-tippy-content]');
    });
  };

  // 重置所有数据
  func.resetStatusData = function(status) {
    var currentYear = commonVars.today.year,
      $statusContainer = $('[data-status-container="' + status + '"]');

    // 先不设置有疑问账单
    $.seeBind.setData('data-selected-year', currentYear, { status: status });

    data.statusRequested[status] = !1;
    // 创建今天的数据容器
    $statusContainer.html('');
    $statusContainer.append(
      tpl.yearContentContainer.render({
        year: currentYear,
        status: status,
      })
    );
  };

  return func;
});
