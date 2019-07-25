/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'toastr',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  './function',
  './ajax',
  'lib/jquery.seeView',
], function($, toastr, commonFunc, commonVars, data, tpl, func) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;

  $.seeView({
    events: {
      // 点击过滤
      '!click #action-filter': 'onClickActionFilter',
      // 点击分页
      'click [data-page-index]': 'onClickPageIndex',
      // 点击查看当前行详情
      'click [data-row-detail]': 'onClickRowDetail',
      // 点击模态框
      'click .modal': 'onClickModal',
      // 点击删除行
      'click [data-row-delete]': 'onClickRowDelete',
      // 选择了某个大殿
      '!change #filter-house': 'onChangeFilterHouse',
    },
    // 点击过滤
    onClickActionFilter: function(e) {
      data.ordersFilter.regionId = parseInt($('#filter-region').val()) || 0;
      data.ordersFilter.search = $('#filter-search').val();
      data.ordersFilter.remainDays =
        parseInt($('#filter-remain-days').val()) || '';

      func.requestOrdersList();
    },
    // 点击分页
    onClickPageIndex: function(e) {
      var $this = $(e.target),
        currentPage = parseInt($this.attr('data-current-page')),
        pageIndex = parseInt($this.attr('data-page-index')),
        page =
          pageIndex == -1
            ? currentPage - 1
            : pageIndex == -2
            ? currentPage + 1
            : pageIndex;

      func.requestOrdersList(page);
    },
    // 点击查看当前行详情
    onClickRowDetail: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-row-detail'));

      $.seeAjax.post(
        'detail',
        { id: id },
        function(res) {
          if (res.success) {
            var item = data.listData[id];
            $('#detail-popup-title').text(
              item.buddhaName + ' - ' + item.wallName
            );
            $('#detail-popup-sequence').text(res.data.sequence);
            $('#detail-popup-name').text(res.data.name || '');
            $('#detail-popup-row-name')[res.data.name ? 'show' : 'hide']();
            $('#detail-popup-yang-shang-ren').text(res.data.yangShangRen || '');
            $('#detail-popup-row-yang-shang-ren')[
              res.data.yangShangRen ? 'show' : 'hide'
            ]();
            $('#detail-popup-wang-sheng-zhe').text(res.data.wangShengZhe || '');
            $('#detail-popup-row-wang-sheng-zhe')[
              res.data.wangShengZhe ? 'show' : 'hide'
            ]();
            $('#detail-popup-end-time').text(res.data.endTime);

            var $contact = $('#detail-popup-contact');
            $contact.html('');
            res.data.contactList &&
              res.data.contactList.length &&
              res.data.contactList.map(function(item) {
                $contact.append(tpl.contactCell.render(item));
              });

            $('body').addClass('overflow-hidden');
            $('#detail-popup')
              .show()
              .scrollTop(0);
          } else {
            toastr.error(res.message || '获取订单信息失败，请稍后再试');
          }
        },
        !0
      );
    },
    // 点击模态框
    onClickModal: function(e) {
      if (e.target == e.currentTarget) {
        $(e.target).hide();
        $('body').removeClass('overflow-hidden');
      }
    },
    // 点击删除行
    onClickRowDelete: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-row-delete'));

      commonFunc.confirm('确定删除这条订单吗', function() {
        $.seeAjax.post(
          'delete',
          { id: id },
          function(res) {
            if (res.success) {
              toastr.success('删除成功');
              self.refreshCurrentPage();
            } else {
              toastr.error(res.message || '删除失败，请稍后再试');
            }
          },
          !0
        );
      });
    },
    // 重新请求当前页
    refreshCurrentPage: function() {
      var currentPage = parseInt(
        $('.pagination-cell.active').attr('data-current-page')
      );
      func.requestOrdersList(currentPage);
    },
    // 选择了某个大殿
    onChangeFilterHouse: function(e) {
      var value = $(e.target).val();
      var $selectRegion = $('#filter-region');

      $selectRegion.find('option').map(function() {
        var $this = $(this),
          name = $this.attr('data-name'),
          id = parseInt($this.val());

        // id = 0，是未选择项
        if (!id) return;

        if (!value) {
          $this.addClass('hide');
          return;
        }
        if (name.indexOf(value) === 0) $this.removeClass('hide');
        else $this.addClass('hide');
      });

      // 触发一次未选择
      $selectRegion.val(0);
    },
  });
});
