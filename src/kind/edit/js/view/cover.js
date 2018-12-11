const $ = require('jquery');
const seeView = require('see-view').default;

seeView({
  events: {
    // 点击删除封面
    'click [data-cover-item-delete]': 'onClickCoverItemDelete',
  },
  // 点击删除封面
  onClickCoverItemDelete: e => {
    $(e.target)
      .parent()
      .remove();
    $('#cover-add').removeClass('hide');
  },
});
