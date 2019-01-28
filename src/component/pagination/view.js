/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', './data', 'lib/jquery.seeView'], ($, data) => {
  $.seeView({
    events: {
      // 点击分页
      'click [data-component-pagination-cell]':
        'onClickComponentPaginationCell',
    },
    // 点击分页
    onClickComponentPaginationCell(e) {
      const $this = $(e.target);

      const id = parseInt($this.attr('data-component-pagination-id'));
      // 组件id

      let page = parseInt($this.attr('data-component-pagination-cell'));
      // 按钮指向页数

      const componentOption = data.componentsOptions[id];

      const currentPage = componentOption.currentPage;

      const totalPages = componentOption.totalPages;

      const $paginationInput = $(
        `[data-component-pagination-input][data-component-pagination-id="${id}"]`
      );

      const paginationInput = parseInt($paginationInput.val()); // 跳到某一页的输入

      // 如果当前已经处于激活状态，或者禁用，返回
      if ($this.hasClass('active') || $this.hasClass('disabled')) return !1;

      if (page == -1) {
        // 上一页
        page = currentPage - 1;
      } else if (page == -2) {
        // 下一页
        page = currentPage + 1;
      } else if (page == -3) {
        // 跳到某一页
        // 没有值，直接返回
        if (
          !paginationInput ||
          paginationInput < 0 ||
          paginationInput > totalPages ||
          paginationInput == currentPage
        ) {
          $paginationInput.val('');
          return;
        }
        page = paginationInput;
      }

      componentOption.pendingPage = page;
      componentOption.onChange(page);
    },
  });
});
