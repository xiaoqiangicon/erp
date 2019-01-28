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
      // 点击分页
      'click [data-pagination-index]': 'onClickPaginationIndex',
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
    // 点击分页
    onClickPaginationIndex: function(e) {
      var $this = $(e.target),
        currentPage = parseInt($this.attr('data-current-page')),
        pageIndex = parseInt($this.attr('data-pagination-index')),
        category = parseInt($this.attr('data-category')),
        status = parseInt($this.attr('data-status')),
        searchKey = $this.attr('data-search-key'),
        page =
          pageIndex == -1
            ? currentPage - 1
            : pageIndex == -2
            ? currentPage + 1
            : pageIndex,
        totalPages =
          data.totalPagesRecord[
            'category:' +
              category +
              '|status:' +
              status +
              '|searchKey' +
              searchKey
          ];

      var $parentContentContainer = $(
          '[data-container="condition-content"][data-category="' +
            category +
            '"]' +
            '[data-status="' +
            status +
            '"][data-search-key="' +
            searchKey +
            '"]'
        ),
        $contentContainers = $parentContentContainer.find(
          '[data-container="pagination-content"]'
        ),
        $currentContentContainer = $parentContentContainer.find(
          '[data-container="pagination-content"]' +
            '[data-page-index="' +
            page +
            '"]'
        ),
        $paginationContainer = $(
          '[data-container="pagination"][data-category="' +
            category +
            '"]' +
            '[data-status="' +
            status +
            '"][data-search-key="' +
            searchKey +
            '"]'
        );

      $contentContainers.hide();

      if (!$currentContentContainer.length) {
        $currentContentContainer = $(
          tpl.paginationContentContainer.render({
            pageIndex: page,
          })
        );
        $parentContentContainer.append($currentContentContainer);
        func.requestList(page, category, status, searchKey);
      } else {
        $currentContentContainer.show();
        $paginationContainer.html(
          tpl.pagination.render({
            currentPage: page,
            nextPage: !!totalPages && page >= totalPages ? 0 : page + 1,
            category: category,
            status: status,
            searchKey: searchKey,
          })
        );
      }
    },
    // 点击查询按钮
    onClickSearchSubmit: function(e) {
      var $category = $('#category'),
        category = parseInt($category.attr('data-category')),
        $status = $('#status'),
        status = parseInt($status.attr('data-status')),
        $searchInput = $('#search-input'),
        searchKey = $searchInput.val(),
        $conditionContentContainers = $('[data-container="condition-content"]'),
        $currentConditionContentContainer = $(
          '[data-container="condition-content"][data-category="' +
            category +
            '"]' +
            '[data-status="' +
            status +
            '"][data-search-key="' +
            searchKey +
            '"]'
        ),
        $paginationContainers = $('[data-container="pagination"]'),
        $currentPaginationContainer = $(
          '[data-container="pagination"][data-category="' +
            category +
            '"]' +
            '[data-status="' +
            status +
            '"][data-search-key="' +
            searchKey +
            '"]'
        );

      $conditionContentContainers.hide();
      $paginationContainers.hide();
      if (!$currentConditionContentContainer.length) {
        $currentConditionContentContainer = $(
          tpl.conditionContentContainer.render({
            category: category,
            status: status,
            searchKey: searchKey,
          })
        );
        $('#condition-content-containers').append(
          $currentConditionContentContainer
        );
        $currentPaginationContainer = $(
          tpl.paginationContainer.render({
            category: category,
            status: status,
            searchKey: searchKey,
          })
        );
        $('#pagination-containers').append($currentPaginationContainer);
        func.requestList(1, category, status, searchKey);
      }
      $currentConditionContentContainer.show();
      $currentPaginationContainer.show();
    },
    // 输入框键盘按下
    onKeydownSearchInput: function(e) {
      // enter
      if (e.keyCode == 13) {
        $('#search-submit').trigger('click');
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
      $category
        .attr({
          'data-category': category,
        })
        .text($this.text());
      $('#search-submit').trigger('click');
    },
    // 选择分类
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
      $('#search-submit').trigger('click');
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
        id = parseInt($this.attr('data-article-delete')),
        $currentPaginationContent = $this.parents(
          '[data-container="pagination-content"]'
        ),
        $currentConditionContent = $this.parents(
          '[data-container="condition-content"]'
        ),
        currentPage = parseInt(
          $currentPaginationContent.attr('data-page-index')
        ),
        category = parseInt($currentConditionContent.attr('data-category')),
        status = parseInt($currentConditionContent.attr('data-status')),
        searchKey = $currentConditionContent.attr('data-search-key');

      commonFunc.confirm('确定删除这篇文章吗？', function() {
        $.seeAjax.get('deleteArticle', { id: id }, function() {
          var loadPage = currentPage,
            $currentPagination = $(
              '[data-container="pagination"][data-category="' +
                category +
                '"]' +
                '[data-status="' +
                status +
                '"][data-search-key="' +
                searchKey +
                '"]'
            ),
            noNextPage = !$currentPagination.find(
              '[data-pagination-index="-2"]'
            ).length,
            noPrevPage = !$currentPagination.find(
              '[data-pagination-index="-1"]'
            ).length,
            cellLength = $currentPaginationContent.find('[data-article-cell]')
              .length;

          loadPage =
            noNextPage && cellLength <= 1 && !noPrevPage
              ? currentPage - 1
              : currentPage;

          self.deleteArticleSuccess(id, loadPage, category, status, searchKey);
        });
      });
    },
    // 删除文章成功
    deleteArticleSuccess: function(id, loadPage, category, status, searchKey) {
      var $currentConditionContent;
      var $currentPaginationContent;
      // 删除其他的 condition content 和对应的 分页容器
      $('[data-container="condition-content"]').map(function() {
        var $this = $(this),
          currentCategory = parseInt($this.attr('data-category')),
          currentStatus = parseInt($this.attr('data-status')),
          currentSearchKey = $this.attr('data-search-key');

        if (
          currentCategory != category ||
          currentStatus != status ||
          currentSearchKey != searchKey
        )
          $this.remove();
        else $currentConditionContent = $this;
      });
      $('[data-container="pagination"]').map(function() {
        var $this = $(this),
          currentCategory = parseInt($this.attr('data-category')),
          currentStatus = parseInt($this.attr('data-status')),
          currentSearchKey = $this.attr('data-search-key');

        if (
          currentCategory != category ||
          currentStatus != status ||
          currentSearchKey != searchKey
        )
          $this.remove();
      });

      // 删除当前页之后的所有页
      $currentConditionContent
        .find('[data-container="pagination-content"]')
        .map(function() {
          var $this = $(this),
            page = parseInt($this.attr('data-page-index'));

          if (page > loadPage) $this.remove();
          else if ((page = loadPage)) $currentPaginationContent = $this;
        });

      $currentPaginationContent.html(
        tpl.paginationContentContainerLoading.render({})
      );
      func.requestList(loadPage, category, status, searchKey);
    },
  });
});
