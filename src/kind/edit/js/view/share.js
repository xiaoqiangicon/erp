import $ from 'jquery';
import seeView from 'see-view';
seeView({
  events: {
    'click [data-share-item-delete]': 'onClickShareItemDelete',
  },
  onClickShareItemDelete: e => {
    $(e.target)
      .parent()
      .remove();
    let sort = parseInt($(e.target).attr('data-share-item-delete'), 10);
    if (sort === 0) {
      $('#index-img-add').removeClass('hide');
    }
    if (sort === 1) {
      $('#res-img-add').removeClass('hide');
    }
    if (sort === 2) {
      $('#share-icon-add').removeClass('hide');
    }
  },
});
