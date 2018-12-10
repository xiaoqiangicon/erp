const $ = require('jquery');
const seeView = require('see-view').default;

const dialog = require('../../../util/dialog');

const data = require('./data');

const regExp = /^<iframe .*<\/iframe>$/i;

seeView({
  events: {
    'click [data-ue-pl-video-close]': 'onClickClose',
    'click [data-ue-pl-video]': 'onClickMain',
    'click [data-ue-pl-video-ok]': 'onClickOk',
  },
  onClickClose: e => {
    $(e.target)
      .parents('[data-ue-pl-video]')
      .hide();
  },
  onClickMain: e => {
    if (e.target === e.currentTarget) $(e.target).hide();
  },
  onClickOk: e => {
    const $this = $(e.target);
    const $main = $this.parents('[data-ue-pl-video]');
    const $input = $main.find('[data-ue-pl-video-input]');
    const id = parseInt($this.attr('data-ue-pl-video-ok'));
    const code = $input.val();

    if (!code) {
      dialog('请先填入需要插入的代码');
      return;
    }

    if (!regExp.test(code)) {
      dialog('填入的代码需要是如下模式：&lt;iframe ......&gt;&lt;/iframe&gt;');
      return;
    }

    const extract = / src=['"]([^'"]+)['"]/gi;
    const result = extract.exec(code);

    if (!result) {
      dialog('填入的代码提取不到视频地址，请确认后重试');
      return;
    }

    const insert = `<iframe frameborder="0" width="100%" height="240" src="${
      result[1]
    }" allowfullscreen></iframe>`;

    const options = data.optionsCollection[id];

    options.onSubmit && options.onSubmit(insert);

    $input.val('');
    $main.hide();
  },
});
