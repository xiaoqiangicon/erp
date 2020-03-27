import $ from 'jquery';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import func from './function';
import Clipboard from 'clipboard';
import '../../../../pro-com/src/libs-es5/jquery-qrcode';
import './ajax';
import seeAjax from 'see-ajax';
import seeView from 'see-view';
seeView({
  events: {
    'click #search-submit': 'onClickSearchSubmit',
    'keydown #search-input': 'onKeydownSearchInput',
    'click [data-popup]': 'onClickPopup',
    'click [data-article-view]': 'onClickArticleView',
    'click [data-switch-qrcode]': 'onClickSwitchQrcode',
    'click [data-select-category]': 'onClickSelectCategory',
    'click [data-select-status]': 'onClickSelectStatus',
    'click [data-article-edit]': 'onClickArticleEdit',
    'click [data-article-copy]': 'onClickArticleCopy',
    'click [data-article-delete]': 'onClickArticleDelete',
    // 排序
    'click #article-visit-count': 'onClickVisitCount',
    'click #article-support': 'onClickSupport',
    'click #article-pay-amount': 'onClickAmount',
  },
  onClickSearchSubmit: function(e) {
    data.filter.searchKey = $('#search-input').val();
    func.requestList();
  },
  onKeydownSearchInput: function(e) {
    if (e.keyCode == 13) {
      this.onClickSearchSubmit();
    }
  },
  onClickPopup: function(e) {
    var $this = $(e.target),
      close =
        !!$this.attr('data-popup-close') || !!$this.attr('data-popup-overlay');
    if (close) {
      $(e.currentTarget).hide();
    }
  },
  onClickArticleView: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-article-view')),
      status = parseInt($this.attr('data-status')),
      url = data.shareLink + id,
      $viewPopup = $('[data-popup="' + id + '"][data-type="article-view"]');
    if (!$viewPopup.length) {
      $viewPopup = $(
        tpl.viewPopup.render({
          id: id,
          link: url,
          status: status,
        })
      );
      $('body').append($viewPopup);
      new Clipboard($viewPopup.find('[data-clipboard-target]')[0]);
      $viewPopup.find('[data-qrcode-container]').qrcode({
        width: data.qrcodeSizes[0],
        height: data.qrcodeSizes[0],
        text: url,
      });
    } else {
      $viewPopup.show();
    }
  },
  onClickSwitchQrcode: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-switch-qrcode')),
      type = parseInt($this.attr('data-type')),
      url = data.shareLink + id,
      $qrcodeContainer = $('[data-qrcode-container="' + id + '"]'),
      activeSwitch = $('[data-switch-qrcode="' + id + '"].active');
    if ($this.hasClass('active')) return;
    activeSwitch.removeClass('active');
    $this.addClass('active');
    $qrcodeContainer.html('');
    $qrcodeContainer.qrcode({
      width: data.qrcodeSizes[type - 1],
      height: data.qrcodeSizes[type - 1],
      text: url,
    });
  },
  onClickSelectCategory: function(e) {
    var $this = $(e.target),
      category = parseInt($this.attr('data-select-category')),
      $category = $('#category'),
      currentCategory = parseInt($category.attr('data-category'));
    if (category == currentCategory) return;
    $category
      .attr({
        'data-category': category,
      })
      .text($this.text());
    data.filter.category = category;
    func.requestList();
  },
  onClickSelectStatus: function(e) {
    var $this = $(e.target),
      status = parseInt($this.attr('data-select-status')),
      $status = $('#status'),
      currentStatus = parseInt($status.attr('data-status'));
    if (status == currentStatus) return;
    $status
      .attr({
        'data-status': status,
      })
      .text($this.text());
    data.filter.status = status;
    func.requestList();
  },
  onClickArticleEdit: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-article-edit')),
      status = parseInt($this.attr('data-status'));
    location.href = data.updateLink + id + '&status=' + status;
  },
  onClickArticleCopy: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-article-copy'));
    location.href = data.copyLink + id;
  },
  onClickArticleDelete: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-article-delete'));
    commonFunc.confirm('确定删除这篇文章吗？', function() {
      seeAjax(
        'deleteArticle',
        {
          id: id,
        },
        function() {
          self.refreshCurrentPage();
        }
      );
    });
  },
  refreshCurrentPage: function() {
    func.requestList(data.pagination.option.currentPage, !1);
  },
  // 排序
  onClickVisitCount: function(e) {
    func.sortAndRenderList($('#article-visit-count'), 'orderView');
  },
  onClickSupport: function(e) {
    func.sortAndRenderList($('#article-support'), 'orderLike');
  },
  onClickAmount: function(e) {
    func.sortAndRenderList($('#article-pay-amount'), 'orderMoney');
  },
});
