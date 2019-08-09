const $ = require('jquery');
const seeView = require('see-view').default;

require('component/upload_config');

require('../../../../../old-com/upload/src/css/index.css');
require('../../../../../old-com/pagination/src/index.less');
require('less/pagination.less');
require('@fancyapps/fancybox/dist/jquery.fancybox.css');
require('../../../../../old-com/choose-image/src/css/index.css');
require('../../../../../old-com/choose-icon/src/css/index.css');
const ChooseImage = require('../../../../../old-com/choose-image/src');
const ChooseIcon = require('../../../../../old-com/choose-icon/src');

require('component/choose_image_config');
require('component/choose_icon_config');

const coverItemTpl = require('../tpl/main/detail/cover_item');
const shareItemTpl = require('../tpl/main/detail/share_item');

let coverChoose;
let shareChoose;
let payChoose;

let $currentPayItemAdd;

seeView({
  events: {
    // 点击添加封面
    'click #cover-add': 'onClickCoverAdd',
    // 点击添加分享图标
    'click #share-icon-add': 'onClickShareIconAdd',
    // 点击添加支付选择项图标
    'click [data-pay-item-add]': 'onClickPayItemAdd',
  },
  // 点击添加封面
  onClickCoverAdd: e => {
    if (!coverChoose) {
      coverChoose = new ChooseImage({
        onSubmit: items => {
          const existLength = $('[data-cover-item]').length;
          const remainLength = 3 - existLength;
          const $coverContainer = $('#cover-container');
          const $coverAdd = $('#cover-add');
          items.forEach((item, index) => {
            index < remainLength &&
              $coverContainer.append(coverItemTpl({ image: item.src }));
          });

          items.length + existLength >= 3 && $coverAdd.addClass('hide');
        },
      });
    }

    coverChoose.show();
  },
  // 点击添加分享图标
  onClickShareIconAdd: e => {
    if (!shareChoose) {
      shareChoose = new ChooseIcon({
        multiSelect: !1,
        onSubmit: items => {
          const $shareIconContainer = $('#share-icon-container');
          const $shareIconAdd = $('#share-icon-add');
          $shareIconContainer.append(shareItemTpl({ image: items[0].src }));
          $shareIconAdd.addClass('hide');
        },
      });
    }

    shareChoose.show();
  },
  // 点击添加支付选择项图标
  onClickPayItemAdd: e => {
    $currentPayItemAdd = $(e.target);
    if (!payChoose) {
      payChoose = new ChooseImage({
        multiSelect: !1,
        onSubmit: items => {
          const $container = $currentPayItemAdd.parents(
            '[data-pay-item-icon-container]'
          );

          $container.find('[data-pay-item-image]').attr({ src: items[0].src });
          $container.find('[data-pay-item-add]').addClass('hide');
          $container.find('[data-pay-item-icon]').removeClass('hide');
        },
      });
    }

    payChoose.show();
  },
});
