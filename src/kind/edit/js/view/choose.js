import $ from 'jquery';
import seeView from 'see-view';
import 'component/upload_config';
import '../../../../com-deprecated/upload/css/index.css';
import '../../../../com-deprecated/pagination/index.less';
import 'less/pagination.less';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';
import '../../../../com-deprecated/choose-image/css/index.css';
import '../../../../com-deprecated/choose-icon/css/index.css';
import ChooseImage from '../../../../com-deprecated/choose-image';
import ChooseIcon from '../../../../com-deprecated/choose-icon';
import coverItemTpl from '../tpl/main/detail/cover_item';
import shareItemTpl from '../tpl/main/detail/share_item';
let coverChoose;
let shareChoose;
let indexChoose;
let resChoose;
let payChoose;
let $currentPayItemAdd;
seeView({
  events: {
    'click #cover-add': 'onClickCoverAdd',
    'click #share-icon-add': 'onClickShareIconAdd',
    'click #index-img-add': 'onClickIndexImgAdd',
    'click [data-index-img-delete]': 'onClickIndexDelete',
    'click [data-res-img-delete]': 'onClickResDelete',
    'click #res-img-add': 'onClickResImgAdd',
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
      shareChoose = new ChooseImage({
        multiSelect: !1,
        onSubmit: items => {
          const $shareIconContainer = $('#share-icon-container');
          const $shareIconAdd = $('#share-icon-add');
          $shareIconContainer.append(
            shareItemTpl({
              image: items[0].src,
              sort: 2, // 0:????????????1??????????????????2????????????
            })
          );
          $shareIconAdd.addClass('hide');
        },
      });
    }
    shareChoose.show();
  },
  onClickIndexImgAdd: e => {
    if (!indexChoose) {
      indexChoose = new ChooseImage({
        multiSelect: !1,
        onSubmit: items => {
          const $indexImgContainer = $('#index-img-container');
          const $indexImgAdd = $('#index-img-add');
          $indexImgContainer.append(
            shareItemTpl({
              image: items[0].src,
              sort: 0,
            })
          );
          $indexImgAdd.addClass('hide');
        },
      });
    }
    indexChoose.show();
  },
  onClickResImgAdd: e => {
    if (!resChoose) {
      resChoose = new ChooseImage({
        multiSelect: !1,
        onSubmit: items => {
          const $indexImgContainer = $('#res-img-container');
          const $indexImgAdd = $('#res-img-add');
          $indexImgContainer.append(
            shareItemTpl({
              image: items[0].src,
              sort: 1,
            })
          );
          $indexImgAdd.addClass('hide');
        },
      });
    }
    resChoose.show();
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
