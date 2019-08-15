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

import upload from '../../../../../../pro-com/src/upload';

import coverPicItemTpl from '../tpl/main/detail/cover_pic_item';

import checkBeforeSave from '../util/check_before_save';

let coverChoose;

seeView({
  events: {
    'click .push-select': 'onClickSelect',
    'click .upload-pic': 'onClickUploadPic',
    'click .save': 'onClickSave',
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
    const $coverContainer = $('#cover-container');
    $coverContainer.append(
      coverPicItemTpl({
        image:
          'https://pic.zizaihome.com/ad6f04c4-aead-11e9-b39a-00163e0c001e.png',
      })
    );
    coverChoose.show();
  },

  // 保存
  onClickSave(e) {
    const self = this;
    const $this = $(e.target);

    const result = checkBeforeSave();

    if (result.success) return;
    $this.text(`正在${0 ? '更新' : '保存'}中...`);
    zzhHandling.show();

    self.save(result);
  },
  save(result) {
    const self = this;
    seeAjax(
      'updateList',
      {
        content: result.data.content,
        img: result.data.img,
        video: result.data.video,
        isPush: result.data.isPush,
      },
      res => {
        if (!res.success) return;
        self.afterSave();
      }
    );
  },
  afterSave() {
    zzhHandling.hide();
    window.location.reload();
  },
});
