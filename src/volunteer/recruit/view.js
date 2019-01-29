/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  './function',
  'clipboard',
  'component/promotion',
  'jquery-qrcode',
  './ajax',
  'jquery.seeView',
], function($, commonFunc, commonVars, data, tpl, func, Clipboard, Promotion) {
  $.seeView({
    events: {
      // 查看
      'click [data-id="recruitView"]': 'onClickRecruitView',
      // 标题点击查看
      'click .recruit-title-text': 'onClickRecruitView',
      // 推广,显示弹框
      'click [data-id="recruitPopularize"]': 'onClickRecruitPopularize',
      // 点击切换二维码
      // 'click [data-switch-qrcode]': 'onClickSwitchQrcode',
      // 点击弹出框（空白区域或关闭按钮时关闭弹框）
      // 'click [data-popup="recruit-popularizeUrl"]': 'onClickPopup'
    },

    // 点击查看
    onClickRecruitView: function(e) {
      var self = this,
        $tar = $(e.target),
        title = $tar.attr('data-title'),
        activityId = $tar.attr('data-activity-id');
      window.location.href =
        '/zzhadmin/volunteer_index/?activityId=' +
        activityId +
        '&title=' +
        title;
    },
    // 点击推广
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
});
