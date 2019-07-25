/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  './function',
  'clipboard',
  '../../lib/jquery.qrcode.min',
  './ajax',
  'lib/jquery.seeView',
], function($, commonFunc, commonVars, data, tpl, func, Clipboard) {
  $.seeView({
    events: {
      // 点击查询按钮
      'click #search-submit': 'onClickSearchSubmit',
      // 输入框键盘按下
      'keydown #search-input': 'onKeydownSearchInput',
      // 点击弹出框
      'click [data-popup]': 'onClickPopup',
      // 点击推广按钮
      'click [data-article-view]': 'onClickArticleView',
      // 点击切换二维码
      'click [data-switch-qrcode]': 'onClickSwitchQrcode',
      // 选择分类
      'click [data-select-category]': 'onClickSelectCategory',
      // 选择状态
      'click [data-select-status]': 'onClickSelectStatus',
      // 更新
      'click [data-article-edit]': 'onClickArticleEdit',
      // 复制
      'click [data-article-copy]': 'onClickArticleCopy',
      // 删除
      'click [data-article-delete]': 'onClickArticleDelete',
    },
    // 点击查询按钮
    onClickSearchSubmit: function(e) {
      data.filter.searchKey = $('#search-input').val();
      func.requestList();
    },
    // 输入框键盘按下
    onKeydownSearchInput: function(e) {
      // enter
      if (e.keyCode == 13) {
        this.onClickSearchSubmit();
      }
    },
    // 点击弹出框
    onClickPopup: function(e) {
      var $this = $(e.target),
        close =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-overlay');

      if (close) {
        $(e.currentTarget).hide();
      }
    },
    // 点击推广按钮
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
        // 添加复制
        new Clipboard($viewPopup.find('[data-clipboard-target]')[0]);
        // 二维码
        $viewPopup.find('[data-qrcode-container]').qrcode({
          width: data.qrcodeSizes[0],
          height: data.qrcodeSizes[0],
          text: url,
        });
      } else {
        $viewPopup.show();
      }
    },
    // 点击切换二维码
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
    // 选择分类
    onClickSelectCategory: function(e) {
      var $this = $(e.target),
        category = parseInt($this.attr('data-select-category')),
        $category = $('#category'),
        currentCategory = parseInt($category.attr('data-category'));

      if (category == currentCategory) return;
      $category.attr({ 'data-category': category }).text($this.text());
      data.filter.category = category;
      func.requestList();
    },
    // 选择分类
    onClickSelectStatus: function(e) {
      var $this = $(e.target),
        status = parseInt($this.attr('data-select-status')),
        $status = $('#status'),
        currentStatus = parseInt($status.attr('data-status'));

      if (status == currentStatus) return;
      $status.attr({ 'data-status': status }).text($this.text());
      data.filter.status = status;
      func.requestList();
    },
    // 更新
    onClickArticleEdit: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-article-edit')),
        status = parseInt($this.attr('data-status'));

      location.href = data.updateLink + id + '&status=' + status;
    },
    // 复制
    onClickArticleCopy: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-article-copy'));

      location.href = data.copyLink + id;
    },
    // 删除
    onClickArticleDelete: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-article-delete'));

      commonFunc.confirm('确定删除这篇文章吗？', function() {
        $.seeAjax.get('deleteArticle', { id: id }, function() {
          self.refreshCurrentPage();
        });
      });
    },
    // 重新请求当前页
    refreshCurrentPage: function() {
      func.requestList(data.pagination.option.currentPage, !1);
    },
  });
});
