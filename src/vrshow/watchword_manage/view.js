/**
 * Created by kang on 2017/10/23.
 */

define([
  'jquery',
  'old/toast',
  './data',
  './tpl',
  './function',
  './ajax',
  'jquery-confirm',
  'lib/jquery.seeView',
], function($, Toast, data, tpl, func) {
  $.seeView({
    events: {
      // 点击添加字幕按钮显示添加字幕Modal
      'click #add-watchword-btn': 'onClickAddWatchwordBtn',
      // 输入发育内容，文本字数提示
      'keyup #watchword': 'textNumTip',
      // 添加字幕Modal提交
      'click #submit-watchword': 'submitWatchword',
      // 点击列表的编辑操作
      'click [data-opt="editor"]': 'onClickOptionEditor',
      // 点击列表的隐藏显示操作
      'click [data-opt="visibility"]': 'onClickOptionVisibility',
      // 点击列表的删除操作
      'click [data-opt="delete"]': 'onClickOptionDelete',
    },
    // 点击添加字幕按钮显示添加字幕Modal
    onClickAddWatchwordBtn: function(e) {
      data.updateWatchwordParams.id = 0;
      var $modal = $('#add-watchword-modal'),
        $buddhistName = $modal.find('.buddhist-name'),
        $watchword = $modal.find('.watchword-textarea'),
        $textNum = $modal.find('.textarea-num');
      // 样式初始化
      $buddhistName.val('');
      $watchword.val('');
      $textNum.html('0/70');
      $modal.find('.modal-title').html('添加字幕');
      $modal.modal('show');
    },
    // 输入字幕内容，文本字数提示
    textNumTip: function(e) {
      var length = $('#watchword').val().length;
      $('.textarea-num').html(length + '/70');
    },
    // 添加字幕Modal提交按钮
    submitWatchword: function(e) {
      // 获取参数
      var $modal = $('#add-watchword-modal'),
        $buddhistName = $modal.find('.buddhist-name'),
        $watchword = $modal.find('.watchword-textarea'),
        name = $buddhistName.val(),
        content = $watchword.val();
      if (name === '') {
        Toast('请填写法师称谓', 2, 3000, false);
        return;
      }
      if (content === '') {
        Toast('请填写字幕内容', 2, 3000, false);
        return;
      }
      data.updateWatchwordParams.name = name;
      data.updateWatchwordParams.content = content;
      func.updateWatchword(data.updateWatchwordParams, function(res) {
        if (data.updateWatchwordParams.id === 0) {
          Toast('添加成功', 1, 3000, false);
          // 添加重新请求数据并重绘
          func.getList({}, function(res) {
            func.renderList(res);
          });
        } else {
          Toast('编辑成功', 1, 3000, false);
          // 仅仅重绘当前行
          var curTr = $('.table-cell-' + data.updateWatchwordParams.id),
            status = parseInt(
              curTr.find('.option-visibility').attr('data-status')
            ),
            htmlStr = '';
          htmlStr = tpl.tableCell.render({
            id: data.updateWatchwordParams.id,
            status: status,
            name: name,
            content: content,
          });
          curTr.replaceWith(htmlStr);
        }
        $modal.modal('hide');
      });
    },
    // 点击列表的编辑操作
    onClickOptionEditor: function(e) {
      var self = this,
        $tar = $(e.target),
        id = parseInt($tar.attr('data-id')),
        $modal = $('#add-watchword-modal'),
        $buddhistName = $modal.find('.buddhist-name'),
        $watchword = $modal.find('.watchword-textarea'),
        $textNum = $modal.find('.textarea-num'),
        curItem = {};
      // 修改id作为编辑与添加的区分
      data.updateWatchwordParams.id = id;
      // 获取当前编辑项的id name pic数据，添加至获取的头像数据前，默认显示
      data.getListRes.data.map(function(item) {
        if (item.id === id) {
          curItem = item;
          // delete curItem.status;
          // delete curItem.content;
        }
      });
      // 样式初始化
      $buddhistName.val(curItem.name);
      $watchword.val(curItem.content);
      self.textNumTip();
      $modal.find('.modal-title').html('编辑字幕');
      $modal.modal('show');
    },
    // 点击列表的隐藏显示操作
    onClickOptionVisibility: function(e) {
      var $tar = $(e.target),
        id = parseInt($tar.attr('data-id')),
        status = parseInt($tar.attr('data-status'));
      status === 0 ? (status = 1) : (status = 0); // 本地 0显示状态对应文本显示反转上传1 1隐藏状态对应文本隐藏个反转上传 0
      func.operateWatchword({ id: id, status: status }, function(res) {
        if (status === 1) {
          $tar.html('显示');
        } else {
          $tar.html('隐藏');
        }
        $tar.attr('data-status', status);
      });
    },
    // 点击列表的删除操作
    onClickOptionDelete: function(e) {
      var $tar = $(e.target),
        id = parseInt($tar.attr('data-id'));

      $.confirm({
        title: false,
        content: '你确定删除吗?',
        buttons: {
          ok: {
            text: '确定',
            action: function() {
              func.operateWatchword({ id: id, status: -1 }, function(res) {
                func.getList(data.getListParams, function(res) {
                  // 停留在当前页
                  func.renderList(res);
                });
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
  });
});
