import $ from 'jquery';
import 'jquery-confirm';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import func from './function';
import Clipboard from 'clipboard';
import Promotion from '../../com-deprecated/promotion';
import '../../../../pro-com/src/libs-es5/jquery-qrcode';
import './ajax';
import seeView from 'see-view';
import seeAjax from 'see-ajax';

seeView({
  events: {
    'click [data-id="recruitView"]': 'onClickRecruitView',
    'click .recruit-title-text': 'onClickRecruitView',
    'click [data-id="recruitPopularize"]': 'onClickRecruitPopularize',
    'click [data-id="recruitEdit"]': 'onClickRecruitEdit',
    'click [data-manage-id]': 'onClickManageDel',
    'click #create': 'onClickCreate',
    'click [data-add-manager-id]': 'onClickAddManager',
    'click #close': 'onClickClose',
  },
  onClickCreate: function(e) {
    window.location.href = `/zzhadmin/createTempleActivity`;
  },
  onClickRecruitView: function(e) {
    var self = this,
      $tar = $(e.target),
      title = $tar.attr('data-title'),
      activityId = $tar.attr('data-activity-id');
    window.location.href =
      '/zzhadmin/volunteer_index/?activityId=' + activityId + '&title=' + title;
  },
  onClickAddManager: function(e) {
    var $tar = $(e.target);
    var id = $tar.attr('data-add-manager-id');
    var href = window.location.href;
    var text = '';
    $('#qrcode-mask').show();

    if (href.indexOf('erptest') != -1) {
      text = `https://wxapp1.zizaihome.com/yg/addVolunteerManager?isTest=1&id=${id}`;
    } else if (href.indexOf('erprelease') != -1) {
      text = `https://wxapp2.zizaihome.com/yg/addVolunteerManager?isTest=2&id=${id}`;
    } else {
      text = `https://wx.zizaihome.com/yg/addVolunteerManager?id=${id}`;
    }
    $('#qrcode').qrcode({
      width: 200,
      height: 200,
      text: text,
    });
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
  onClickRecruitEdit(e) {
    var id = $(e.target).attr('data-activity-id');
    window.location.href = `/zzhadmin/createTempleActivity?id=${id}`;
  },
  onClickManageDel(e) {
    var id = $(e.currentTarget).attr('data-manage-id');
    console.log(id);
    $.alert({
      title: false,
      content: '确定要删除吗？',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            seeAjax('del', { manageId: id }, res => {
              if (res.success) {
                window.location.reload();
              }
            });
          },
        },
        cancel: {
          text: '取消',
        },
      },
      theme: 'white',
    });
  },
  onClickClose(e) {
    $('#qrcode').html('');
    $('#qrcode-mask').hide();
  },
});
