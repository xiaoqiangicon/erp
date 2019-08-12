/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const $ = require('jquery');
const seeView = require('see-view').default;
const seeAjax = require('see-ajax').default;
require('@zzh/promotion/dist/promotion.css');
const promotion = require('@zzh/promotion');

const dialog = require('util/dialog');
const confirm = require('util/confirm');
const env = require('util/env');

seeView({
  events: {
    // 点击编辑一行数据
    'click [data-row-edit]': 'onClickRowEdit',
    // 点击跳到详情页
    'click [data-row-record]': 'onClickRowRecord',
    // 点击推广
    'click [data-row-promo]': 'onClickRowPromo',
    // 点击推广
    'click [data-row-delete]': 'onClickRowDelete',
    // 点击显示更多
    'click [data-row-more]': 'onClickRowMore',
  },
  // 点击编辑一行数据
  onClickRowEdit: e => {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-row-edit'));

    location.href = `/zzhadmin/charityEditHtml/?edit=1&id=${id}`;
  },
  // 点击跳到详情页
  onClickRowRecord: e => {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-row-record'));

    location.href = `/zzhadmin/charityRecord/?id=${id}`;
  },
  // 点击推广
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
  // 点击推广
  onClickRowDelete: e => {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-row-delete'));
    const deleting = !!parseInt($this.attr('data-deleting'));

    if (deleting) return;

    confirm('您确定要删除这条数据么？', _ => {
      $this.attr({ 'data-deleting': 1 });
      seeAjax('delete', { id }, res => {
        $this.attr({ 'data-deleting': 0 });

        if (!res.success) {
          dialog(res.message);
          return;
        }

        $(`[data-row="${id}"]`).remove();
      });
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
});
