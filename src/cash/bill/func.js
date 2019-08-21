import seeAjax from 'see-ajax';
import $ from 'jquery';
import tippy from 'tippy.js';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import './ajax';
var func = {};
func.requestBillData = function(year, status) {
  !year && (year = commonVars.today.year);
  !status && (status = 1);
  seeAjax(
    'billData',
    {
      year: year,
      status: status,
    },
    function(res) {
      if (!res.success) return;
      $.seeBind.setData('year-content', res, {
        year: year,
        status: status,
      });
      tippy('[data-tippy-content]');
    }
  );
};
func.resetStatusData = function(status) {
  var currentYear = commonVars.today.year,
    $statusContainer = $('[data-status-container="' + status + '"]');
  $.seeBind.setData('data-selected-year', currentYear, {
    status: status,
  });
  data.statusRequested[status] = !1;
  $statusContainer.html('');
  $statusContainer.append(
    tpl.yearContentContainer.render({
      year: currentYear,
      status: status,
    })
  );
};
export default func;
