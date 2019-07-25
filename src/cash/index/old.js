/**
 * Created by senntyou on 2016/12/5.
 */
define([
  'jquery',
  './data',
  './ajax',
  './bind',
  './view',
  'jquery.cookie',
], function($, commonData) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  // init
  (function() {
    var i,
      il,
      currentYear = commonData.today.year,
      $selectYearContainer = $('[data-select-year-container]'),
      $paginationContainers = $('#pagination-containers'),
      $paginationContentContainers = $('#pagination-content-containers');
    // 统计数据
    $.seeAjax.get('stat', {}, function(res) {
      res.success &&
        ($.seeBind.setData('total-donate', res.data.total),
        $.seeBind.setData('available-donate', res.data.available),
        $.seeBind.setData('taken-donate', res.data.taken),
        $.seeBind.setData('chanzai-donate', res.data.chanzai));
    });

    // 填充空位, 2016为起始年份
    for (i = currentYear, il = 2016; i >= il; i--) {
      $selectYearContainer.append(
        commonData.tpl.selectYearItem.render({
          year: i,
        })
      );
    }
    $.seeBind.setData('data-selected-year', currentYear);

    // 创建今天的数据容器
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
          page: 1,
          year: currentYear,
        })
      );

    // 今天的月数据
    commonData.requestList();

    // 获取账户信息
    $.seeAjax.get('accountInfo', {}, function(res) {
      if (res.success) {
        commonData.accountData = res.data;
        // 审核失败的原因
        if (commonData.accountStatus === 2 && res.data.reason) {
          $('#dialog-account-no-reason-content').text(res.data.reason);
          $('#dialog-account-no-reason').removeClass('hide');
        }
      }
    });

    // 有禅在转单权限，显示禅在统计
    if (parseInt($.cookie('pw_chanzai_order'))) {
      $('#chanzai-donate-unit').removeClass('hide');
      $('#stat-first-section').addClass('has-four');
    }
  })();
});
