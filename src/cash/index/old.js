import seeAjax from 'see-ajax';
import $ from 'jquery';
import commonData from './data';
import './ajax';
import './view';
import 'jquery.cookie';
import {
  renderAvailableDonate,
  renderChanzaiDonate,
  renderSelectedYear,
  renderTakenDonate,
  renderTotalDonate,
} from './render';

$.ajaxSetup({
  cache: !1,
});
(function() {
  var i,
    il,
    currentYear = commonData.today.year,
    $selectYearContainer = $('[data-select-year-container]'),
    $paginationContainers = $('#pagination-containers'),
    $paginationContentContainers = $('#pagination-content-containers');
  seeAjax('stat', {}, function(res) {
    res.success &&
      (renderTotalDonate(res.data.total),
      renderAvailableDonate(res.data.available),
      renderTakenDonate(res.data.taken),
      renderChanzaiDonate(res.data.chanzai));
  });
  for (i = currentYear, il = 2016; i >= il; i--) {
    $selectYearContainer.append(
      commonData.tpl.selectYearItem.render({
        year: i,
      })
    );
  }
  renderSelectedYear(currentYear);
  $paginationContainers.append(
    commonData.tpl.paginationContainer.render({
      year: currentYear,
    })
  );
  $paginationContentContainers.append(
    commonData.tpl.yearContentContainer.render({
      year: currentYear,
    })
  );
  $paginationContentContainers
    .find('[data-year-content="' + currentYear + '"]')
    .html(
      commonData.tpl.paginationContentContainer.render({
        year: currentYear,
      })
    );
  commonData.requestList();
  seeAjax('accountInfo', {}, function(res) {
    if (res.success) {
      commonData.accountData = res.data;
      if (commonData.accountStatus === 2 && res.data.reason) {
        $('#dialog-account-no-reason-content').text(res.data.reason);
        $('#dialog-account-no-reason').removeClass('hide');
      }
    }
  });
  if (parseInt($.cookie('pw_chanzai_order'))) {
    $('#chanzai-donate-unit').removeClass('hide');
    $('#stat-first-section').addClass('has-four');
  }
})();
