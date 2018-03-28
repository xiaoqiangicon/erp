
const $ = require('jquery');
const seeView = require('see-view');

let checkBeforeSave = require('../util/check_before_save');

seeView({
    events: {
        // 点击保存
        'click #ok': 'onClickOk'
    },
    // 点击保存
    onClickOk: e => {
        let $this = $(e.target);
        let handling = !!parseInt($this.attr('data-handling'));

        if (handling) return;

        let result = checkBeforeSave();
        if (!result.success) return;
    }
});