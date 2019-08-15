import $ from 'jquery';
import seeView from 'see-view';
seeView({
  events: {
    'click [data-cover-item-delete]': 'onClickCoverItemDelete',
  },
  onClickCoverItemDelete: e => {
    $(e.target)
      .parent()
      .remove();
  },
});
