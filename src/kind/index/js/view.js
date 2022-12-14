import $ from 'jquery';
import seeView from 'see-view';
import seeAjax from 'see-ajax';
import '../../../com-deprecated/promotion/less/index.less';
import promotion from '../../../com-deprecated/promotion';
import dialog from 'util/dialog';
import confirm from 'util/confirm';
import * as env from '../../../util/env';
seeView({
  events: {
    'click [data-row-edit]': 'onClickRowEdit',
    'click [data-row-record]': 'onClickRowRecord',
    'click [data-row-promo]': 'onClickRowPromo',
    'click [data-row-delete]': 'onClickRowDelete',
    // 点击显示更多
    'click [data-row-more]': 'onClickRowMore',
    // 显示隐藏视频
    'click .video-show': 'onClickVideoShow',
    // 显示隐藏发布进展
    'click .publish-mask': 'onClickPublishMask',
  },
  onClickRowEdit: e => {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-row-edit'));
    location.href = `/zzhadmin/charityEditHtml/?edit=1&id=${id}`;
  },
  onClickRowRecord: e => {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-row-record'));
    location.href = `/zzhadmin/charityRecord/?id=${id}`;
  },
  onClickRowPromo: e => {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-row-promo'));
    promotion.show({
      typeText: '日行一善',
      link: `${env.wxProtocol}://${
        env.wxSubDomain
      }.zizaihome.com/charity/getIndexHtml?charityId=${id}${
        env.wxParamSuffix ? `&${env.wxParamSuffix}` : ''
      }`,
    });
  },
  onClickRowDelete: e => {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-row-delete'));
    const deleting = !!parseInt($this.attr('data-deleting'));
    if (deleting) return;
    confirm('您确定要删除这条数据么？', _ => {
      $this.attr({
        'data-deleting': 1,
      });
      seeAjax(
        'delete',
        {
          id,
        },
        res => {
          $this.attr({
            'data-deleting': 0,
          });
          if (!res.success) {
            dialog(res.message);
            return;
          }
          $(`[data-row="${id}"]`).remove();
        }
      );
    });
  },

  // 点击显示更多
  onClickRowMore: e => {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-row-more'), 10);

    $('[data-more-operate]').each(i => {
      let $this = $('[data-more-operate]').eq(i);

      if ($this.attr('data-more-operate') == id) {
        if ($this.hasClass('more-hide')) {
          $('[data-more-operate]').addClass('more-hide');
          $this.removeClass('more-hide');
        } else {
          $('[data-more-operate]').addClass('more-hide');
        }
      }
    });
    e.stopPropagation();
  },

  // 点击隐藏发布进展
  onClickPublishMask: e => {
    if (e.target === e.currentTarget) {
      // 切换选项卡为发布进展
      $('.header-item')
        .eq(0)
        .addClass('header-item-active')
        .siblings()
        .removeClass('header-item-active');
      $('.content').hide();
      $('.content')
        .eq(0)
        .show();

      // 将已输入的发布进展的内容清空
      $('.type-content').val('');
      $('[data-text-count-show="1"]').text('0');
      $('.media').html('');
      $('.push-select').removeClass('push-select-active');
      $('.no-push').addClass('push-select-active');
      $('.publish-mask').hide();
    }
  },

  // 点击隐藏播放视频
  onClickVideoShow: e => {
    if (e.target === e.currentTarget) {
      $(e.target).hide();
    }
  },
});
