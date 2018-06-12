
const $ = require('jquery');
const seeView = require('see-view');

seeView({
    events: {
        'click [data-ue-pl-video-close]': 'onClickClose',
        'click [data-ue-pl-video]': 'onClickMain',
        'click [data-ue-pl-video-ok]': 'onClickOk'
    },
    onClickClose: e => {
        $(e.target).parents('[data-ue-pl-video]').hide();
    },
    onClickMain: e => {
        if (e.target === e.currentTarget) $(e.target).hide();
    },
    onClickOk: e => {
        let $this = $(e.target);
        let $input = $this.parents('[data-ue-pl-video]').find('[data-ue-pl-video-input]');
        let id = parseInt($this.attr('data-ue-pl-video-ok'));
        let code = $input.val();
    }
});
