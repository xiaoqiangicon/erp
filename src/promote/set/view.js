import $ from 'jquery';
import seeView from 'see-view';
import seeAjax from 'see-ajax';
import * as handling from '../../../../pro-com/src/handling';
import promotion from '../../com-deprecated/promotion';
import StoreImage from '../../com-deprecated/store-image';
import share from './share';
// import toastr from 'toastr';
import dialog from '../../util/dialog';
import alert from '../../util/alert';
import { defaultDetail, defaultTitle } from './util';

seeView({
  events: {
    // 点击单选
    '!click [data-radio]': 'clickRadio',
    // 点击确定
    '!click #ok': 'clickOk',
    // 点击去招募
    '!click #to-promote': 'clickToPromote',
  },
  // 点击单选
  clickRadio(e) {
    const $this = $(e.currentTarget);

    if ($this.hasClass('active')) return;

    const name = $this.attr('data-radio');
    $(`[data-radio="${name}"].active`).removeClass('active');
    $this.addClass('active');
  },
  // 点击确定
  clickOk() {
    const receive = parseInt(
      $('[data-radio="receive"].active').attr('data-value'),
      10
    );
    const verify = parseInt(
      $('[data-radio="verify"].active').attr('data-value'),
      10
    );
    const title = $('#title').val() || defaultTitle;
    const intro = share.editor.getContent() || defaultDetail;

    handling.show();

    // eslint-disable-next-line no-new
    new StoreImage(intro, newIntro => {
      seeAjax('update', { receive, verify, title, intro: newIntro }, res => {
        handling.hide();

        if (!res.success) {
          dialog(res.message);
          return;
        }

        alert('保存成功', () => {
          window.location.reload();
        });
      });
    });
  },
  // 点击去招募
  clickToPromote() {
    if (!share.promoteUrl) {
      dialog('暂无推广链接，请先注册信息');
      return;
    }

    promotion.show({ link: share.promoteUrl });
  },
});
