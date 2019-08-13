import $ from 'jquery';
import seeView from 'see-view';
import seeAjax from 'see-ajax';
import '../../../../old-com/promotion/less/index.less';
import promotion from '../../../../old-com/promotion/src';
import dialog from 'util/dialog';
import confirm from 'util/confirm';
import * as env from '../../../util/env';
seeView({
  events: {
    'click [data-row-edit]': 'onClickRowEdit',
    'click [data-row-record]': 'onClickRowRecord',
    'click [data-row-promo]': 'onClickRowPromo',
    'click [data-row-delete]': 'onClickRowDelete',
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
});
