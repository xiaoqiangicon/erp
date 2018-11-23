import $ from 'jquery';
import seeView from 'see-view';
// import seeAjax from 'see-ajax';
// import toastr from 'toastr';

seeView({
  events: {
    // 点击单选
    '!click [data-radio]': 'clickRadio',
  },
  // 点击单选
  clickRadio(e) {
    const $this = $(e.currentTarget);

    if ($this.hasClass('active')) return;

    const name = $this.attr('data-radio');
    $(`[data-radio="${name}"].active`).removeClass('active');
    $this.addClass('active');
  },
});
