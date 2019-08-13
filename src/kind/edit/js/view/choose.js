import $ from 'jquery';
import seeView from 'see-view';
import 'component/upload_config';
import '../../../../../old-com/upload/src/css/index.css';
import '../../../../../old-com/pagination/src/index.less';
import 'less/pagination.less';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';
import '../../../../../old-com/choose-image/src/css/index.css';
import '../../../../../old-com/choose-icon/src/css/index.css';
import ChooseImage from '../../../../../old-com/choose-image/src';
import ChooseIcon from '../../../../../old-com/choose-icon/src';
import 'component/choose_image_config';
import 'component/choose_icon_config';
import coverItemTpl from '../tpl/main/detail/cover_item';
import shareItemTpl from '../tpl/main/detail/share_item';
let coverChoose;
let shareChoose;
let payChoose;
let $currentPayItemAdd;
seeView({
  events: {
    'click #cover-add': 'onClickCoverAdd',
    'click #share-icon-add': 'onClickShareIconAdd',
    'click [data-pay-item-add]': 'onClickPayItemAdd',
  },
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
              $coverContainer.append(
                coverItemTpl({
                  image: item.src,
                })
              );
          });
          items.length + existLength >= 3 && $coverAdd.addClass('hide');
        },
      });
    }
    coverChoose.show();
  },
  onClickShareIconAdd: e => {
    if (!shareChoose) {
      shareChoose = new ChooseIcon({
        multiSelect: !1,
        onSubmit: items => {
          const $shareIconContainer = $('#share-icon-container');
          const $shareIconAdd = $('#share-icon-add');
          $shareIconContainer.append(
            shareItemTpl({
              image: items[0].src,
            })
          );
          $shareIconAdd.addClass('hide');
        },
      });
    }
    shareChoose.show();
  },
  onClickPayItemAdd: e => {
    $currentPayItemAdd = $(e.target);
    if (!payChoose) {
      payChoose = new ChooseImage({
        multiSelect: !1,
        onSubmit: items => {
          const $container = $currentPayItemAdd.parents(
            '[data-pay-item-icon-container]'
          );
          $container.find('[data-pay-item-image]').attr({
            src: items[0].src,
          });
          $container.find('[data-pay-item-add]').addClass('hide');
          $container.find('[data-pay-item-icon]').removeClass('hide');
        },
      });
    }
    payChoose.show();
  },
});
