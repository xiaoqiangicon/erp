import $ from 'jquery';
import seeView from 'see-view';
seeView({
  events: {
    'click [data-cover-item-video-delete]': 'onClickCoverItemDelete',
    'click .video-mask': 'onClickItemVideo',
  },
  onClickCoverItemDelete: e => {
    $(e.target)
      .parent()
      .remove();
    e.stopPropagation();
  },
  onClickItemVideo: e => {
    $('.video-show').show();
    $('.video-play').attr(
      'src',
      $(e.target)
        .prev()
        .prev()
        .attr('src')
    );
  },
});
