import $ from 'jquery';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import '../ajax';
import seeView from 'see-view';
seeView({
  events: {
    'click [data-popup-close]': 'onClickPopupClose',
    '!click #action-cancel': 'onClickActionCancel',
    'keyup [data-words-count]': 'onKeyupWordsCount',
  },
  onClickPopupClose: function(e) {
    $(e.target)
      .parents('.modal')
      .hide();
    $('body').removeClass('overflow-hidden');
  },
  onClickActionCancel: function(e) {
    commonFunc.confirm('你确定离开吗?（未保存的修改将不生效）', function() {
      history.back();
    });
  },
  onKeyupWordsCount: function(e) {
    var $this = $(e.target),
      id = $this.attr('data-words-count'),
      count = $this.val().length;
    $('[data-words-count-show="' + id + '"]').text(count);
  },
});
