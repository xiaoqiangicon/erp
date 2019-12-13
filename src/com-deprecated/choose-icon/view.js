import seeView from 'see-view';
import $ from 'jquery';
import data from './data';
import revertWinScroll from './util/revert_win_scroll';
seeView({
  events: {
    'click [data-zzh-choose-icon-cell]': 'onClickCell',
    'click [data-zzh-choose-icon]': 'onClickContainer',
    'click [data-zzh-choose-icon-submit]': 'onClickSubmit',
  },
  onClickCell: e => {
    let $this = $(e.currentTarget);
    let $chooseIcon = $this.parents('[data-zzh-choose-icon]');
    let id = parseInt($chooseIcon.attr('data-zzh-choose-icon'));
    let option = data.options[id];
    if (option.multiSelect) $this.toggleClass('active');
    else {
      $chooseIcon
        .find('[data-zzh-choose-icon-cell].active')
        .removeClass('active');
      $this.addClass('active');
    }
  },
  onClickContainer: e => {
    let $this = $(e.target);
    let close =
      $this.attr('data-popup-close') ||
      $this.attr('data-popup-backdrop') ||
      $this.parent().attr('data-popup-close');
    if (close) {
      let $chooseIcon = $this.parents('[data-zzh-choose-icon]');
      let id = parseInt($chooseIcon.attr('data-zzh-choose-icon'));
      $chooseIcon.hide();
      $chooseIcon
        .find('[data-zzh-choose-icon-cell].active')
        .removeClass('active');
      revertWinScroll();
    }
  },
  onClickSubmit: e => {
    let self = this;
    let $this = $(e.target);
    let $chooseIcon = $this.parents('[data-zzh-choose-icon]');
    let id = parseInt($chooseIcon.attr('data-zzh-choose-icon'));
    let $imagesCells = $chooseIcon.find('[data-zzh-choose-icon-cell].active');
    let images = [];
    $imagesCells.map(function() {
      let $this = $(this);
      images.push({
        id: parseInt($this.attr('data-image-id')),
        src: $this.attr('data-image-src'),
      });
    });
    let option = data.options[id];
    images.length && option.onSubmit && option.onSubmit(images);
    revertWinScroll();
    $imagesCells.removeClass('active');
    $chooseIcon.hide();
  },
});
