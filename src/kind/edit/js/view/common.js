const $ = require('jquery');
const seeView = require('see-view');

seeView({
  events: {
    // 输入值改变
    'input [data-text-count]': 'onInputTextCount',
    'propertychange [data-text-count]': 'onInputTextCount',
    // 点击切换激活状态
    'click [data-toggle-active]': 'onClickToggleActive',
  },
  // 输入值改变
  onInputTextCount: e => {
    const $this = $(e.target);
    const id = $this.attr('data-text-count');
    $(`[data-text-count-show="${id}"]`).text($this.val().length);
  },
  // 点击切换激活状态
  onClickToggleActive: e => {
    $(e.currentTarget).toggleClass('active');
  },
});
