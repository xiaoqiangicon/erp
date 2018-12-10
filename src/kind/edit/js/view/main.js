const $ = require('jquery');
const seeView = require('see-view');
const seeAjax = require('see-ajax');
const StoreImage = require('@zzh/store-image');
require('@zzh/handling/dist/handling.css');
const zzhHandling = require('@zzh/handling');

const dialog = require('util/dialog');

const checkBeforeSave = require('../util/check_before_save');
const data = require('../data');

seeView({
  events: {
    // 点击保存
    'click #ok': 'onClickOk',
  },
  // 点击保存
  onClickOk(e) {
    const self = this;
    const $this = $(e.target);
    const handling = !!parseInt($this.attr('data-handling'));

    if (handling) return;

    const result = checkBeforeSave();
    if (!result.success) return;

    $this
      .attr({ 'data-handling': 1 })
      .text(`正在${data.info.isEdit ? '更新' : '保存'}中...`);
    zzhHandling.show();
    new StoreImage(result.data.intro, newContent => {
      result.data.intro = newContent;

      self.save(result.data);
    });
  },
  // 保存
  save(dataToSave) {
    const self = this;
    if (data.info.isEdit)
      seeAjax('edit', dataToSave, res => {
        if (!res.success) {
          dialog(res.message);
          return;
        }

        self.afterSave();
      });
    else
      seeAjax('add', dataToSave, res => {
        if (!res.success) {
          dialog(res.message);
          return;
        }

        self.afterSave();
      });
  },
  // 保存成功之后的处理函数
  afterSave() {
    $('#ok')
      .attr({ 'data-handling': 0 })
      .text(data.info.isEdit ? '更新' : '保存');
    zzhHandling.hide();

    location.href = '/zzhadmin/charityIndex/';
  },
});
