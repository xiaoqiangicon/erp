const $ = require('jquery');
const seeView = require('see-view').default;

import '../../../../component/choose-image/css/index.css';
import '../../../../component/choose-icon/css/index.css';

seeView({
  events: {
    'click .record-push-select': 'onClickSelect',
  },

  // 选择推送还是不推送
  onClickSelect: e => {
    if (
      $(e.target)
        .parent()
        .parent()
        .siblings()
        .eq(0)
        .find('.record-item-header-left')
        .eq(0)
        .find('.ispush')
        .eq(0)
        .attr('record-data-ispush')
    ) {
      return;
    }
    if ($('#remain-time').text() <= 0) return;
    $(e.target)
      .addClass('record-push-select-active')
      .siblings()
      .removeClass('record-push-select-active');
  },
});
