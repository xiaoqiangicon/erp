import seeAjax from 'see-ajax';
import seeView from 'see-view';
import $ from 'jquery';
import upload from '../../../com-deprecated/upload';
import data from '../data';
import requestList from '../util/request_list';
import revertWinScroll from '../util/revert_win_scroll';
import checkSelected from '../util/check_selected';
import addPopupTpl from '../tpl/add_popup';
import uploadImageCellTpl from '../tpl/upload_image_cell';
import progressTpl from '../tpl/progress';
seeView({
  events: {
    'click [data-zzh-choose-image-tab-1]': 'onClickTab1',
    'click [data-zzh-choose-image-cell]': 'onClickCell',
    'click [data-zzh-choose-image-add]': 'onClickAdd',
    'click [data-zzh-choose-image]': 'onClickContainer',
    'click [data-zzh-choose-image-submit]': 'onClickSubmit',
  },
  onClickTab1: e => {
    let $this = $(e.target);
    let $chooseImage = $this.parents('[data-zzh-choose-image]');
    let id = parseInt($chooseImage.attr('data-zzh-choose-image'));
    let $activeTab = $chooseImage.find('[data-zzh-choose-image-tab-1].active');
    let activeTab = parseInt($activeTab.attr('data-zzh-choose-image-tab-1'));
    if ($this.hasClass('active')) return;
    $activeTab.removeClass('active');
    $this.addClass('active');
    let $deleteContainer = $chooseImage.find(
      '[data-zzh-choose-image-to-manage-container]'
    );
    if (activeTab === 2) $deleteContainer.show();
    else $deleteContainer.hide();
    requestList(id);
  },
  onClickCell: e => {
    let $this = $(e.currentTarget);
    let $chooseImage = $this.parents('[data-zzh-choose-image]');
    let inDeleteMode = $chooseImage.hasClass('in-delete-mode');
    let id = parseInt($chooseImage.attr('data-zzh-choose-image'));
    let option = data.options[id];
    if (inDeleteMode) {
      $this.toggleClass('delete-active');
      checkSelected($chooseImage);
    } else {
      if (option.multiSelect) $this.toggleClass('active');
      else {
        $chooseImage
          .find('[data-zzh-choose-image-cell].active')
          .removeClass('active');
        $this.addClass('active');
      }
    }
  },
  onClickAdd: function(e) {
    let self = this;
    let $this = $(e.target);
    let $chooseImage = $this.parents('[data-zzh-choose-image]');
    let id = parseInt($chooseImage.attr('data-zzh-choose-image'));
    let option = data.options[id];
    let $addPopup = $(`[data-zzh-choose-image-add-popup="${id}"]`);
    if ($addPopup.length) $addPopup.show();
    else {
      $addPopup = $(
        addPopupTpl({
          id: id,
          multiUpload: option.multiUpload,
        })
      );
      $addPopup.appendTo('body');
      $addPopup.show();
      self.afterAddPopup($addPopup, id, option);
    }
  },
  afterAddPopup: ($addPopup, id, option) => {
    upload(
      $addPopup.find('[data-zzh-choose-image-upload-button-inner]')[0],
      (url, e, data) => {
        $addPopup.find('[data-zzh-choose-image-progress-container]').remove();
        let $uploadEl = $(e.target).parents(
          '[data-zzh-choose-image-upload-button]'
        );
        let $imageCell = $(
          uploadImageCellTpl({
            image: url + '?imageMogr/auto-orient',
          })
        );
        $uploadEl.before($imageCell);
      },
      (e, data) => {
        let progress = parseInt((data.loaded / data.total) * 100, 10),
          $progressBar = $addPopup.find('[data-zzh-choose-image-progress-bar]'),
          $progressBarContainer = $addPopup.find(
            '[data-zzh-choose-image-progress-container]'
          );
        if (!$progressBar.length) {
          let $uploadEl = $(e.target).parents(
            '[data-zzh-choose-image-upload-button]'
          );
          $progressBarContainer = $(progressTpl);
          $uploadEl.before($progressBarContainer);
          $progressBar = $progressBarContainer.find(
            '[data-zzh-choose-image-progress-bar]'
          );
        }
        $progressBar.css({
          width: progress + '%',
        });
      },
      {
        multiple: !!option.multiUpload,
      }
    );
  },
  onClickContainer: e => {
    let $this = $(e.target);
    let close =
      $this.attr('data-popup-close') ||
      $this.attr('data-popup-backdrop') ||
      $this.parent().attr('data-popup-close');
    if (close) {
      let $chooseImage = $this.parents('[data-zzh-choose-image]');
      let id = parseInt($chooseImage.attr('data-zzh-choose-image'));
      $chooseImage.hide();
      $chooseImage
        .find('[data-zzh-choose-image-cell].active')
        .removeClass('active');
      revertWinScroll();
    }
  },
  onClickSubmit: e => {
    let $this = $(e.target);
    let $chooseImage = $this.parents('[data-zzh-choose-image]');
    let id = parseInt($chooseImage.attr('data-zzh-choose-image'));
    let $imagesCells = $chooseImage.find('[data-zzh-choose-image-cell].active');
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
    $chooseImage.hide();
  },
});
