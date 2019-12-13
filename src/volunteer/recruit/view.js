import $ from 'jquery';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import func from './function';
import Clipboard from 'clipboard';
import Promotion from '../../com-deprecated/promotion';
import './ajax';
import seeView from 'see-view';
seeView({
  events: {
    'click [data-id="recruitView"]': 'onClickRecruitView',
    'click .recruit-title-text': 'onClickRecruitView',
    'click [data-id="recruitPopularize"]': 'onClickRecruitPopularize',
  },
  onClickRecruitView: function(e) {
    var self = this,
      $tar = $(e.target),
      title = $tar.attr('data-title'),
      activityId = $tar.attr('data-activity-id');
    window.location.href =
      '/zzhadmin/volunteer_index/?activityId=' + activityId + '&title=' + title;
  },
  onClickRecruitPopularize: function(e) {
    var $this = $(e.target),
      title = $this.attr('data-title'),
      url = $this.attr('data-popularizeUrl'),
      $viewPopup = $(
        '[data-popup="' + title + '"][data-type="recruit-popularizeUrl"]'
      );
    Promotion.show(
      {
        title: title,
        typeText: '义工招募',
        link: url,
      },
      function() {}
    );
  },
});
