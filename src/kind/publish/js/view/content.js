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
    'click .header-item': 'onClickHeaderItem',
    'click .push-select': 'onClickSelect',
    'click .upload-pic': 'onClickUploadPic',
    'click .save': 'onClickSave',
  },
  // 发布进展/发布动态
  onClickHeaderItem: e => {
    $(e.target)
      .addClass('header-item-active')
      .siblings()
      .removeClass('header-item-active');
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
  // 保存
  onClickSave(e) {
    const self = this;
    const $this = $(e.target);

    const result = checkBeforeSave();
    if (!result.success) return;
    $this.text(`正在${0 ? '更新' : '保存'}中...`);
    zzhHandling.show();
    new StoreImage(
      'result.data.intro',
      newContent => {
        zzhHandling.setText('保存数据');
        self.save();
      },
      (uploaded, total) => {
        zzhHandling.setText(`上传 ${uploaded}/${total}`);
      }
    );
  },
  save(dataToSave) {
    const self = this;
    self.afterSave();
  },
  afterSave() {
    zzhHandling.hide();
  },
});
