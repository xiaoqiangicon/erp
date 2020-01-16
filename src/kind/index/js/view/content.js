const $ = require('jquery');
const seeView = require('see-view').default;

import '../../../../com-deprecated/choose-image/css/index.css';
import '../../../../com-deprecated/choose-icon/css/index.css';
import ChooseImage from '../../../../com-deprecated/choose-image';

import coverPicItemTpl from '../tpl/main/detail/cover_pic_item';

let coverChoose;

seeView({
  events: {
    'click .push-select': 'onClickSelect',
    'click .upload-pic': 'onClickUploadPic',
    // 首页切换发布进展/发布记录
    'click .header-item': 'onClickHeaderItem',
    // 点击关闭发布弹窗
    'click #close-publish': 'onClickClosePublish',
  },

  onClickClosePublish: e => {
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
  },

  // 选择推送还是不推送
  onClickSelect: e => {
    if ($('#remain-time').text() <= 0) return;
    $(e.target)
      .addClass('push-select-active')
      .siblings()
      .removeClass('push-select-active');
  },

  // 上传图片
  onClickUploadPic: e => {
    if (!coverChoose) {
      coverChoose = new ChooseImage({
        onSubmit: items => {
          const $coverContainer = $('#cover-container');
          items.forEach((item, index) => {
            $coverContainer.append(
              coverPicItemTpl({
                image: item.src,
              })
            );
          });
        },
      });
    }
    coverChoose.show();
  },
});
