/**
 * Created by kang on 2017/11/20.
 */

define([
  'jquery',
  'old/toast',
  './data',
  './tpl',
  './function',
  '../../../old-com/promotion/src',
  './ajax',
  'jquery-confirm',
  'lib/jquery.seeView',
  '@zzh/jquery-qrcode',
], function($, Toast, data, tpl, func, Promotion) {
  $.seeView({
    events: {
      // 点击简介导航
      'click [data-ele="summary-tab"]': 'onClickSummaryTab',
      // 点击广告位导航
      'click [data-ele="link-tab"]': 'onClickLinkTab',
      // 简介pane 点击添加按钮
      'click #add-summary-btn': 'onClickSummaryAddBtn',
      // 广告位pane 点击添加按钮
      'click #add-link-btn': 'onClickLinkAddBtn',
      // 广告位pane添加广告位modal 点击保存按钮
      'click #add-link-submit': 'onClickAddLinkSubmit',
      // 广告位pane 编辑广告位modal 点击保存按钮
      'click #edit-link-submit': 'onClickEditLinkSubmit',
      // 广告位pane 编辑广告位modal 点击预览按钮
      'click #edit-link-preview': 'onClickEditLinkPreview',
      // 广告位pane 点击表格的预览操作
      'click #link-tbody [data-opt="preview"]': 'onClickLinkPreview',
      // 广告位pane 点击表格的编辑操作
      'click #link-tbody [data-opt="edit"]': 'onClickLinkEdit',
      // 广告位pane 点击表格的删除操作
      'click #link-tbody [data-opt="delete"]': 'onClickLinkDelete',

      // 简介pane 点击表格的音乐播放
      'click #summary-tbody [data-ele="play-or-pause-btn"]':
        'onClickSummaryPlay',
      // 简介pane 点击表格的预览操作
      'click #summary-tbody [data-opt="preview"]': 'onClickSummaryPreview',
      // 简介pane 点击表格的编辑操作
      'click #summary-tbody [data-opt="edit"]': 'onClickSummaryEdit',
      // 简介pane 点击表格的删除操作
      'click #summary-tbody [data-opt="delete"]': 'onClickSummaryDelete',
    },
    // 点击简介导航
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
    // 点击广告位导航
    onClickLinkTab: function(e) {
      e.preventDefault();
      var $tar = $(e.target),
        index = parseInt($tar.attr('data-index'));
      if (data.currentTabIndex !== index) {
        // data.getLinkListParams.pageNum = 0;
        func.getLinkList(data.getLinkListParams, function(res) {
          func.renderLinkList(res);
          data.currentTabIndex = index;
        });
      }
    },
    // 点击简介添加按钮
    onClickSummaryAddBtn: function(e) {
      // 跳转
      window.location.href = '/zzhadmin/vr_sceneIntroduce/';
    },
    // 点击广告位添加按钮
    onClickLinkAddBtn: function(e) {
      var $modal = $('#add-link-modal'),
        $sceneSelect = $modal.find('[data-ele="scene-select"]'),
        $linkTextarea = $modal.find('[data-ele="link-textarea"]');
      if ($sceneSelect.html() === '') {
        // 第一次加载modal 初始化scene-select
        data.getSceneListParams.type = 1;
        func.getSceneList(data.getSceneListParams, function(res) {
          func.renderSceneSelect(res, $sceneSelect);
        });
      } else {
        $linkTextarea.val('');
      }
      $modal.modal('show');
    },
    // 广告位pane 添加广告位modal 点击保存按钮
    onClickAddLinkSubmit: function(e) {
      var $modal = $('#add-link-modal'),
        $sceneSelect = $modal.find('[data-ele="scene-select"]'),
        $linkTextarea = $modal.find('[data-ele="link-textarea"]'),
        $title = $modal.find('[data-ele="link-title"]'),
        sceneId = parseInt($sceneSelect.val()),
        title = $title.val(),
        url = $linkTextarea.val();
      if (url.indexOf('zizaihome.com') === -1) {
        // 验证是否为自在家上的广告位
        Toast('请输入自在家平台的佛事广告位', 0, 2000, 0);
        return false;
      }
      if (title === '') {
        Toast('请输入标题', 0, 2000, 0);
        return false;
      }
      func.updateLink(
        { id: 0, sceneId: sceneId, title: title, url: url },
        function(res) {
          Toast('添加成功', 1, 1000, 0);
          $modal.modal('hide');
        }
      );
    },
    // 广告位pane 编辑广告位modal 点击保存按钮
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
        // 验证是否为自在家上的广告位
        Toast('请输入自在家平台的佛事广告位', 0, 2000, 0);
        return false;
      }
      if (title === '') {
        Toast('请输入标题', 0, 2000, 0);
        return false;
      }
      func.updateLink(
        { id: id, sceneId: sceneId, title: title, url: url },
        function(res) {
          Toast('修改成功', 1, 1000, 0);
          $modal.modal('hide');
        }
      );
    },
    // 广告位pane 编辑广告位modal 点击预览按钮
    onClickEditLinkPreview: function(e) {
      var self = this,
        $modal = $('#edit-link-modal'),
        $linkTextarea = $modal.find('[data-ele="link-textarea"]'),
        url = $linkTextarea.val();
      if (url.indexOf('zizaihome.com') === -1) {
        // 验证是否为自在家上的广告位
        Toast('请输入自在家平台的佛事广告位', 0, 2000, 0);
        return false;
      }
      self.showPreviewModal(url);
    },
    // 广告位pane 点击表格的预览操作
    onClickLinkPreview: function(e) {
      e.preventDefault();
      var self = this,
        $tar = $(e.target),
        id = parseInt($tar.attr('data-id')),
        url = data.getLinkListData[id].url;
      self.showPreviewModal(url);
    },
    // 广告位pane 点击表格的编辑操作
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
        // 第一次加载modal 初始化scene-select并选中当前项
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
    // 广告位pane 点击表格的删除操作
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
              func.deleteLink({ id: id }, function() {
                func.getLinkList(data.getLinkListParams, function(res) {
                  func.renderLinkList(res);
                });
                Toast('删除成功', 1, 1000, 0);
              });
            },
          },
          cancel: {
            text: '取消',
            action: function() {},
          },
        },
      });
    },

    // 简介pane 点击表格的语音播放
    onClickSummaryPlay: function(e) {
      var $tar = $(e.target),
        $audio = $('[data-ele="summary-audio"]'),
        audio = $audio.get(0),
        $curPlay = $('[data-ele="play-or-pause-btn"][data-status="1"]'),
        id = parseInt($tar.attr('data-id')),
        sound = data.getSceneListData[id].sound,
        curId = parseInt($audio.attr('data-id')),
        status = parseInt($tar.attr('data-status'));
      // 调整播放器广告位 修改广告位会导致播放器时间轴重置故按需修改
      if (curId !== id) {
        $audio.prop('src', sound);
        $audio.attr('data-id', id);
      }
      // 修改存在的其它正在播放按钮的样式
      if ($curPlay.length && $tar !== $curPlay) {
        $curPlay.attr('data-status', 0);
        $curPlay.removeClass('pause').addClass('play');
        audio.pause();
      }
      // 修改当前单击按钮的样式
      if (status) {
        $tar.attr('data-status', 0);
        $tar.removeClass('pause').addClass('play');
      } else {
        $tar.attr('data-status', 1);
        $tar.removeClass('play').addClass('pause');
        audio.play();
      }
    },

    // 简介pane 点击表格的预览操作
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
    // 简介pane 点击表格的编辑操作
    onClickSummaryEdit: function(e) {
      e.preventDefault();
      // 带参跳转
      var $tar = $(e.target),
        id = parseInt($tar.attr('data-id'));
      window.location.href = '/zzhadmin/vr_sceneIntroduce/?id=' + id;
    },
    // 简介pane 点击表格的删除操作
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
              func.deleteScene({ sceneId: id }, function() {
                func.getSceneList(data.getSceneListParams, function(res) {
                  func.renderSceneList(res);
                });
                Toast('删除成功', 1, 1000, 0);
              });
            },
          },
          cancel: {
            text: '取消',
            action: function() {},
          },
        },
      });
    },
    // 公用函数
    // 展示预览modal
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
});
