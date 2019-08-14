const $ = require('jquery');
const seeView = require('see-view').default;
const seeAjax = require('see-ajax').default;

import StoreImage from '../../../../../old-com/store-image/src';
import '../../../../../old-com/choose-image/src/css/index.css';
import '../../../../../old-com/choose-icon/src/css/index.css';
import ChooseImage from '../../../../../old-com/choose-image/src';
import zzhHandling from '../../../../../old-com/handling/src';
import ChooseIcon from '../../../../../old-com/choose-icon/src';
import 'component/choose_image_config';
import 'component/choose_icon_config';

import checkBeforeSave from '../util/check_before_save';

let coverChoose;

seeView({
  events: {
    'click .record-push-select': 'onClickSelect',
  },

  // 选择推送还是不推送
  onClickSelect: e => {
    $(e.target)
      .addClass('record-push-select-active')
      .siblings()
      .removeClass('record-push-select-active');
  },
});
