import seeAjax from 'see-ajax';
import seeView from 'see-view';
import $ from 'jquery';
import '@fancyapps/fancybox';
import data from '../data';
import requestList from '../util/request_list';
import checkSelected from '../util/check_selected';
seeView({
  events: {
    'click [data-zzh-choose-image-to-manage]': 'onClickToManage',
    'click [data-zzh-choose-image-cancel-manage]': 'onClickCancelManage',
    'click [data-zzh-choose-image-delete-selected]': 'onClickDeleteSelected',
    'change [data-zzh-choose-image-select-all]': 'onChangeSelectAll',
    'click [data-zzh-choose-image-cell-delete]': 'onClickCellDelete',
    'click [data-zzh-choose-image-cell-see]': 'onClickCellSee',
  },
  onClickToManage: e => {
    let $this = $(e.target);
    let $chooseImage = $this.parents('[data-zzh-choose-image]');
    $chooseImage.find('[data-zzh-choose-image-left-part-main]').hide();
    $chooseImage.find('[data-zzh-choose-image-left-part-manage]').show();
    $chooseImage.addClass('in-delete-mode');
    $chooseImage.find('[data-zzh-choose-image-select-all]').prop({
      checked: !1,
    });
    $chooseImage.find('[data-zzh-choose-image-selected-count]').text(0);
    $chooseImage
      .find('[data-zzh-choose-image-cell].active')
      .removeClass('active');
    $chooseImage.find('[data-zzh-choose-image-submit]').addClass('hide');
  },
  onClickCancelManage: e => {
    let $this = $(e.target);
    let $chooseImage = $this.parents('[data-zzh-choose-image]');
    $chooseImage.find('[data-zzh-choose-image-left-part-main]').show();
    $chooseImage.find('[data-zzh-choose-image-left-part-manage]').hide();
    $chooseImage.removeClass('in-delete-mode');
    $chooseImage.find('[data-zzh-choose-image-select-all]').prop({
      checked: !1,
    });
    $chooseImage.find('[data-zzh-choose-image-selected-count]').text(0);
    $chooseImage
      .find('[data-zzh-choose-image-cell].delete-active')
      .removeClass('delete-active');
    $chooseImage.find('[data-zzh-choose-image-submit]').removeClass('hide');
  },
  onClickDeleteSelected: e => {
    let $this = $(e.target);
    let $chooseImage = $this.parents('[data-zzh-choose-image]');
    let id = parseInt($chooseImage.attr('data-zzh-choose-image'));
    let activeTab = parseInt(
      $chooseImage
        .find('[data-zzh-choose-image-tab-1].active')
        .attr('data-zzh-choose-image-tab-1')
    );
    let $imagesCells = $chooseImage.find(
      '[data-zzh-choose-image-cell].delete-active'
    );
    let ids = [];
    if (activeTab === 2) {
      let fn = window.zzhChooseImageCanNotDelete || alert;
      fn('系统图片不能删除哦');
      return;
    }
    if (!$imagesCells.length) {
      let fn = window.zzhChooseImageSelectedEmpty || alert;
      fn('请先选取图片，再操作哦');
      return;
    }
    $imagesCells.map(function() {
      let $this = $(this);
      ids.push(parseInt($this.attr('data-image-id')));
    });
    let fn = window.zzhChooseImageDeleteConfirm || data.deleteConfirm;
    fn('确定要删除吗', _ => {
      seeAjax(
        'zzhChooseImageDelete',
        {
          ids: JSON.stringify(ids),
        },
        res => {
          if (res.success) {
            if (
              $imagesCells.length ===
              $chooseImage.find('[data-zzh-choose-image-cell]').length
            )
              requestList(id);
            else $imagesCells.remove();
            let fn = window.zzhChooseImageDeleteSuccessful;
            fn && fn('删除成功');
            $chooseImage.find('[data-zzh-choose-image-select-all]').prop({
              checked: !1,
            });
            $chooseImage.find('[data-zzh-choose-image-selected-count]').text(0);
          }
        }
      );
    });
  },
  onChangeSelectAll: e => {
    let $this = $(e.target);
    let selected = $this.prop('checked');
    let $chooseImage = $this.parents('[data-zzh-choose-image]');
    let $cells = $chooseImage.find('[data-zzh-choose-image-cell]');
    if (selected) $cells.addClass('delete-active');
    else $cells.removeClass('delete-active');
    checkSelected($chooseImage);
  },
  onClickCellDelete: e => {
    e.stopPropagation();
    let $this = $(e.target);
    let $imageCell = $this.parents('[data-zzh-choose-image-cell]');
    let imageId = parseInt($imageCell.attr('data-image-id'));
    let $chooseImage = $this.parents('[data-zzh-choose-image]');
    let id = parseInt($chooseImage.attr('data-zzh-choose-image'));
    let fn = window.zzhChooseImageDeleteConfirm || data.deleteConfirm;
    fn('确定要删除吗', _ => {
      seeAjax(
        'zzhChooseImageDelete',
        {
          ids: JSON.stringify([imageId]),
        },
        res => {
          if (res.success) {
            if ($chooseImage.find('[data-zzh-choose-image-cell]').length <= 1) {
              $chooseImage.find('[data-zzh-choose-image-select-all]').prop({
                checked: !1,
              });
              $chooseImage
                .find('[data-zzh-choose-image-selected-count]')
                .text(0);
              requestList(id);
            } else {
              $imageCell.remove();
              checkSelected($chooseImage);
            }
            let fn = window.zzhChooseImageDeleteSuccessful;
            fn && fn('删除成功');
          }
        }
      );
    });
  },
  onClickCellSee: e => {
    e.stopPropagation();
    let $this = $(e.target);
    let $imageCell = $this.parents('[data-zzh-choose-image-cell]');
    let image = $imageCell.attr('data-image-src');
    $.fancybox.open(
      [
        {
          src: image,
        },
      ],
      {
        thumbs: {
          autoStart: true,
        },
        lang: 'zh-cn',
        i18n: {
          en: {
            CLOSE: 'Close',
            NEXT: 'Next',
            PREV: 'Previous',
            ERROR:
              'The requested content cannot be loaded. <br/> Please try again later.',
            PLAY_START: 'Start slideshow',
            PLAY_STOP: 'Pause slideshow',
            FULL_SCREEN: 'Full screen',
            THUMBS: 'Thumbnails',
            DOWNLOAD: 'Download',
            SHARE: 'Share',
            ZOOM: 'Zoom',
          },
          'zh-cn': {
            CLOSE: '关闭',
            NEXT: '下一页',
            PREV: '上一页',
            ERROR: '不能加载正在请求的内容. <br/> 请稍后重试.',
            PLAY_START: '开始展示',
            PLAY_STOP: '暂停展示',
            FULL_SCREEN: '全屏',
            THUMBS: '缩略图',
            DOWNLOAD: '下载',
            SHARE: '分享',
            ZOOM: '缩放',
          },
        },
      }
    );
  },
});
