import $ from 'jquery';
import seeView from 'see-view';
import seeAjax from 'see-ajax';
import StoreImage from '../../../../../old-com/store-image/src';
import * as zzhHandling from '../../../../../pro-com/src/handling';
import dialog from '../../../../util/dialog';
import checkBeforeSave from '../util/check_before_save';
import data from '../data';
seeView({
  events: {
    'click #ok': 'onClickOk',
  },
  onClickOk(e) {
    const self = this;
    const $this = $(e.target);
    const handling = !!parseInt($this.attr('data-handling'), 10);
    if (handling) return;
    const result = checkBeforeSave();
    console.log(result.data);
    if (!result.success) return;
    $this
      .attr({
        'data-handling': 1,
      })
      .text(`正在${data.info.isEdit ? '更新' : '保存'}中...`);
    zzhHandling.show();
    new StoreImage(
      result.data.intro,
      newContent => {
        result.data.intro = newContent;
        zzhHandling.setText('保存数据');
        self.save(result.data);
      },
      (uploaded, total) => {
        zzhHandling.setText(`上传 ${uploaded}/${total}`);
      }
    );
  },
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
  afterSave() {
    $('#ok')
      .attr({
        'data-handling': 0,
      })
      .text(data.info.isEdit ? '更新' : '保存');
    zzhHandling.hide();
    window.location.href = '/zzhadmin/charityIndex/';
  },
});
