const $ = require('jquery');
const seeView = require('see-view').default;

seeView({
  events: {
    // 点击删除封面
    'click [data-share-item-delete]': 'onClickShareItemDelete',
  },
  // 点击删除封面
  onClickShareItemDelete: e => {
    $(e.target)
      .parent()
      .remove();
    $('#share-icon-add').removeClass('hide');
  },
});
