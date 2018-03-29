
const $ = require('jquery');
const seeView = require('see-view');
const seeAjax = require('see-ajax');
const StoreImage = require('@zzh/store-image');

const dialog = require('util/dialog');

let checkBeforeSave = require('../util/check_before_save');
let data = require('../data');

seeView({
    events: {
        // 点击保存
        'click #ok': 'onClickOk'
    },
    // 点击保存
    onClickOk: function (e) {
        let self = this;
        let $this = $(e.target);
        let handling = !!parseInt($this.attr('data-handling'));

        if (handling) return;

        let result = checkBeforeSave();
        if (!result.success) return;

        $this.attr({'data-handling': 1}).text(`正在${data.info.isEdit ? '更新' : '保存'}中...`);

        new StoreImage(result.data.intro, newContent => {
            result.data.intro = newContent;

            self.save(result.data);
        });
    },
    // 保存
    save: function (dataToSave) {
        let self = this;
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
    afterSave: function () {
        $('#ok').attr({'data-handling': 0}).text(data.info.isEdit ? '更新' : '保存');

        location.href = '/zzhadmin/charityIndex/';
    }
});