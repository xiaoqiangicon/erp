import $ from 'jquery';
import Toast from 'old/toast';
import data from './data';
import tpl from './tpl';
import func from './function';
import Promotion from '../../../old-com/promotion/src';
import './ajax';
import 'jquery-confirm';
import 'lib/jquery.seeView';
import '../../../old-com/jquery-qrcode';
$.seeView({
  events: {
    'click [data-ele="summary-tab"]': 'onClickSummaryTab',
    'click [data-ele="link-tab"]': 'onClickLinkTab',
    'click #add-summary-btn': 'onClickSummaryAddBtn',
    'click #add-link-btn': 'onClickLinkAddBtn',
    'click #add-link-submit': 'onClickAddLinkSubmit',
    'click #edit-link-submit': 'onClickEditLinkSubmit',
    'click #edit-link-preview': 'onClickEditLinkPreview',
    'click #link-tbody [data-opt="preview"]': 'onClickLinkPreview',
    'click #link-tbody [data-opt="edit"]': 'onClickLinkEdit',
    'click #link-tbody [data-opt="delete"]': 'onClickLinkDelete',
    'click #summary-tbody [data-ele="play-or-pause-btn"]': 'onClickSummaryPlay',
    'click #summary-tbody [data-opt="preview"]': 'onClickSummaryPreview',
    'click #summary-tbody [data-opt="edit"]': 'onClickSummaryEdit',
    'click #summary-tbody [data-opt="delete"]': 'onClickSummaryDelete',
  },
  onClickSummaryTab: function(e) {
    e.preventDefault();
    var $tar = $(e.target),
      index = parseInt($tar.attr('data-index'));
    if (data.currentTabIndex !== index) {
      data.getSceneListParams.pageNum = 0;
      func.getSceneList(data.getSceneListParams, function(res) {
        func.renderSceneList(res);
        data.currentTabIndex = index;
      });
    }
  },
  onClickLinkTab: function(e) {
    e.preventDefault();
    var $tar = $(e.target),
      index = parseInt($tar.attr('data-index'));
    if (data.currentTabIndex !== index) {
      func.getLinkList(data.getLinkListParams, function(res) {
        func.renderLinkList(res);
        data.currentTabIndex = index;
      });
    }
  },
  onClickSummaryAddBtn: function(e) {
    window.location.href = '/zzhadmin/vr_sceneIntroduce/';
  },
  onClickLinkAddBtn: function(e) {
    var $modal = $('#add-link-modal'),
      $sceneSelect = $modal.find('[data-ele="scene-select"]'),
      $linkTextarea = $modal.find('[data-ele="link-textarea"]');
    if ($sceneSelect.html() === '') {
      data.getSceneListParams.type = 1;
      func.getSceneList(data.getSceneListParams, function(res) {
        func.renderSceneSelect(res, $sceneSelect);
      });
    } else {
      $linkTextarea.val('');
    }
    $modal.modal('show');
  },
  onClickAddLinkSubmit: function(e) {
    var $modal = $('#add-link-modal'),
      $sceneSelect = $modal.find('[data-ele="scene-select"]'),
      $linkTextarea = $modal.find('[data-ele="link-textarea"]'),
      $title = $modal.find('[data-ele="link-title"]'),
      sceneId = parseInt($sceneSelect.val()),
      title = $title.val(),
      url = $linkTextarea.val();
    if (url.indexOf('zizaihome.com') === -1) {
      Toast('请输入自在家平台的佛事广告位', 0, 2000, 0);
      return false;
    }
    if (title === '') {
      Toast('请输入标题', 0, 2000, 0);
      return false;
    }
    func.updateLink(
      {
        id: 0,
        sceneId: sceneId,
        title: title,
        url: url,
      },
      function(res) {
        Toast('添加成功', 1, 1000, 0);
        $modal.modal('hide');
      }
    );
  },
  onClickEditLinkSubmit: function(e) {
    var $modal = $('#edit-link-modal'),
      id = parseInt($modal.attr('data-id')),
      $sceneSelect = $modal.find('[data-ele="scene-select"]'),
      $linkTextarea = $modal.find('[data-ele="link-textarea"]'),
      $title = $modal.find('[data-ele="link-title"]'),
      sceneId = parseInt($sceneSelect.val()),
      title = $title.val(),
      url = $linkTextarea.val();
    if (url.indexOf('zizaihome.com') === -1) {
      Toast('请输入自在家平台的佛事广告位', 0, 2000, 0);
      return false;
    }
    if (title === '') {
      Toast('请输入标题', 0, 2000, 0);
      return false;
    }
    func.updateLink(
      {
        id: id,
        sceneId: sceneId,
        title: title,
        url: url,
      },
      function(res) {
        Toast('修改成功', 1, 1000, 0);
        $modal.modal('hide');
      }
    );
  },
  onClickEditLinkPreview: function(e) {
    var self = this,
      $modal = $('#edit-link-modal'),
      $linkTextarea = $modal.find('[data-ele="link-textarea"]'),
      url = $linkTextarea.val();
    if (url.indexOf('zizaihome.com') === -1) {
      Toast('请输入自在家平台的佛事广告位', 0, 2000, 0);
      return false;
    }
    self.showPreviewModal(url);
  },
  onClickLinkPreview: function(e) {
    e.preventDefault();
    var self = this,
      $tar = $(e.target),
      id = parseInt($tar.attr('data-id')),
      url = data.getLinkListData[id].url;
    self.showPreviewModal(url);
  },
  onClickLinkEdit: function(e) {
    e.preventDefault();
    var $tar = $(e.target),
      id = parseInt($tar.attr('data-id')),
      $modal = $('#edit-link-modal'),
      $sceneSelect = $modal.find('[data-ele="scene-select"]'),
      $title = $modal.find('[data-ele="link-title"]'),
      $linkTextarea = $modal.find('[data-ele="link-textarea"]');
    $modal.attr('data-id', id);
    if (!$sceneSelect.html()) {
      data.getSceneListParams.type = 1;
      func.getSceneList(data.getSceneListParams, function(res) {
        func.renderSceneSelect(res, $sceneSelect);
        $sceneSelect.selectpicker('val', data.getLinkListData[id].sceneId);
      });
    } else {
      $sceneSelect.selectpicker('val', data.getLinkListData[id].sceneId);
    }
    $title.val(data.getLinkListData[id].title);
    $linkTextarea.html(data.getLinkListData[id].url);
    $modal.modal('show');
  },
  onClickLinkDelete: function(e) {
    e.preventDefault();
    var $tar = $(e.target),
      id = parseInt($tar.attr('data-id'));
    $.confirm({
      title: false,
      content: '确定要删除该广告位吗？',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            func.deleteLink(
              {
                id: id,
              },
              function() {
                func.getLinkList(data.getLinkListParams, function(res) {
                  func.renderLinkList(res);
                });
                Toast('删除成功', 1, 1000, 0);
              }
            );
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  onClickSummaryPlay: function(e) {
    var $tar = $(e.target),
      $audio = $('[data-ele="summary-audio"]'),
      audio = $audio.get(0),
      $curPlay = $('[data-ele="play-or-pause-btn"][data-status="1"]'),
      id = parseInt($tar.attr('data-id')),
      sound = data.getSceneListData[id].sound,
      curId = parseInt($audio.attr('data-id')),
      status = parseInt($tar.attr('data-status'));
    if (curId !== id) {
      $audio.prop('src', sound);
      $audio.attr('data-id', id);
    }
    if ($curPlay.length && $tar !== $curPlay) {
      $curPlay.attr('data-status', 0);
      $curPlay.removeClass('pause').addClass('play');
      audio.pause();
    }
    if (status) {
      $tar.attr('data-status', 0);
      $tar.removeClass('pause').addClass('play');
    } else {
      $tar.attr('data-status', 1);
      $tar.removeClass('play').addClass('pause');
      audio.play();
    }
  },
  onClickSummaryPreview: function(e) {
    e.preventDefault();
    var $curTar = $(e.currentTarget),
      id = parseInt($curTar.attr('data-id')),
      templeId = localStorage.getItem('templeid');
    var url =
      'https://wx.zizaihome.com/vr/devoteIndex?templeId=' +
      templeId +
      '&sceneId=' +
      id;
    Promotion.show({
      link: url,
    });
  },
  onClickSummaryEdit: function(e) {
    e.preventDefault();
    var $tar = $(e.target),
      id = parseInt($tar.attr('data-id'));
    window.location.href = '/zzhadmin/vr_sceneIntroduce/?id=' + id;
  },
  onClickSummaryDelete: function(e) {
    e.preventDefault();
    var $curTar = $(e.currentTarget),
      id = parseInt($curTar.attr('data-id'));
    $.confirm({
      title: false,
      content: '确定要删除该简介吗？',
      buttons: {
        ok: {
          text: '确定',
          action: function() {
            func.deleteScene(
              {
                sceneId: id,
              },
              function() {
                func.getSceneList(data.getSceneListParams, function(res) {
                  func.renderSceneList(res);
                });
                Toast('删除成功', 1, 1000, 0);
              }
            );
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  showPreviewModal: function(url) {
    var $modal = $('#preview-modal'),
      $qrcodeContainer = $('#qrcode-container');
    $qrcodeContainer.html('');
    $qrcodeContainer.qrcode({
      width: 200,
      height: 200,
      text: url,
    });
    $modal.modal('show');
  },
});
