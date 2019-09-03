import seeAjax from 'see-ajax';
import $ from 'jquery';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import func from './function';
import './ajax';
import seeView from 'see-view';
toastr.options.positionClass = 'toast-bottom-full-width';
toastr.options.timeOut = 2000;
seeView({
  events: {
    '!click #action-filter': 'onClickActionFilter',
    'click [data-page-index]': 'onClickPageIndex',
    'click [data-row-detail]': 'onClickRowDetail',
    'click .modal': 'onClickModal',
    'click [data-row-delete]': 'onClickRowDelete',
    '!change #filter-house': 'onChangeFilterHouse',
  },
  onClickActionFilter: function(e) {
    data.ordersFilter.regionId = parseInt($('#filter-region').val()) || 0;
    data.ordersFilter.search = $('#filter-search').val();
    data.ordersFilter.remainDays =
      parseInt($('#filter-remain-days').val()) || '';
    func.requestOrdersList();
  },
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
  onClickRowDetail: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-row-detail'));
    seeAjax(
      'detail',
      {
        id: id,
      },
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
      }
    );
  },
  onClickModal: function(e) {
    if (e.target == e.currentTarget) {
      $(e.target).hide();
      $('body').removeClass('overflow-hidden');
    }
  },
  onClickRowDelete: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-row-delete'));
    commonFunc.confirm('确定删除这条订单吗', function() {
      seeAjax(
        'delete',
        {
          id: id,
        },
        function(res) {
          if (res.success) {
            toastr.success('删除成功');
            self.refreshCurrentPage();
          } else {
            toastr.error(res.message || '删除失败，请稍后再试');
          }
        }
      );
    });
  },
  refreshCurrentPage: function() {
    var currentPage = parseInt(
      $('.pagination-cell.active').attr('data-current-page')
    );
    func.requestOrdersList(currentPage);
  },
  onChangeFilterHouse: function(e) {
    var value = $(e.target).val();
    var $selectRegion = $('#filter-region');
    $selectRegion.find('option').map(function() {
      var $this = $(this),
        name = $this.attr('data-name'),
        id = parseInt($this.val());
      if (!id) return;
      if (!value) {
        $this.addClass('hide');
        return;
      }
      if (name.indexOf(value) === 0) $this.removeClass('hide');
      else $this.addClass('hide');
    });
    $selectRegion.val(0);
  },
});
