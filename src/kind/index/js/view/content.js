const $ = require('jquery');
const seeView = require('see-view').default;
const seeAjax = require('see-ajax').default;

import '../../../../../old-com/choose-image/src/css/index.css';
import '../../../../../old-com/choose-icon/src/css/index.css';
import ChooseImage from '../../../../../old-com/choose-image/src';
import zzhHandling from '../../../../../old-com/handling/src';
import 'component/choose_image_config';

import zzhUtil from '../../../../../old-com/util/src';

import coverPicItemTpl from '../tpl/main/detail/cover_pic_item';

import checkBeforeSave from '../util/check_before_save';

let coverChoose;

seeView({
  events: {
    'click .push-select': 'onClickSelect',
    'click .upload-pic': 'onClickUploadPic',
    'click .save': 'onClickSave',
    // 首页切换发布进展/发布记录
    'click .header-item': 'onClickHeaderItem',
    // 点击关闭发布弹窗
    'click #close-publish': 'onClickPublish',
  },

  onClickPublish: e => {
    $('.publish-mask').hide();
  },

  // 选择推送还是不推送
  onClickSelect: e => {
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
