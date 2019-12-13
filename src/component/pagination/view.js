import seeView from 'see-view';
import $ from 'jquery';
import data from './data';
seeView({
  events: {
    'click [data-zzh-pagination-cell]': 'onClickZzhPaginationCell',
  },
  onClickZzhPaginationCell: e => {
    var $this = $(e.target),
      id = parseInt($this.attr('data-zzh-pagination-id')),
      page = parseInt($this.attr('data-zzh-pagination-cell')),
      option = data.options[id],
      currentPage = option.currentPage,
      totalPages = option.totalPages,
      $input = $('[data-zzh-pagination-input="' + id + '"]'),
      input = parseInt($input.val());
    if ($this.hasClass('active') || $this.hasClass('disabled')) return !1;
    if (page == -1) {
      page = currentPage - 1;
    } else if (page == -2) {
      page = currentPage + 1;
    } else if (page == -3) {
      if (!input || input < 0 || input > totalPages || input == currentPage) {
        $input.val('');
        return;
      }
      page = input;
    }
    option.pendingPage = page;
    option.onChange(page);
  },
});
