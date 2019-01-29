define([
  'jquery',
  'common/function',
  '../../data',
  '../../share',
  '../../../../util/confirm',
  '../../tpl/common',
  '../../tpl/person_saying',
  './util',
  'util/dialog',
  'lib/jquery.seeView',
], function(
  $,
  commonFunc,
  indexData,
  share,
  confirm,
  commonTpl,
  figureTpl,
  util,
  dialog
) {
  $.seeView({
    events: {
      'change [data-edit-com-figure-display-type]': 'changeDisplayType',
      'click [data-edit-com-figure-row-del]': 'clickRowDel',
      'click [data-edit-com-figure-row-edit]': 'clickRowEdit',
      'click [data-edit-com-figure-add]': 'clickAdd',
    },
    changeDisplayType: function(e) {
      var $this = $(e.target);
      var id = parseInt($this.attr('data-edit-com-figure-display-type'));
      var value = parseInt(
        $('[data-edit-com-figure-display-type]:checked').attr('value')
      );
      var $displayComponents = $(
        '[data-container="component-display"][data-type="2"][data-id="' +
          id +
          '"]'
      );

      if (value === 1) $displayComponents.removeClass('com-figure-cell');
      else $displayComponents.addClass('com-figure-cell');
    },
    clickRowDel: function(e) {
      var self = this;
      var $this = $(e.target);
      var id = parseInt($this.attr('data-edit-com-figure-row-del'));
      var com = share.figureComponent.components.find(function(i) {
        return i.id === id;
      });

      confirm('确定要删除吗？', function() {
        self.afterDel(id);
      });

      // if (com.newAdded) {
      //   confirm('确定要删除吗？', function () {
      //     self.afterDel(id);
      //   });
      // }
      // else {
      //   confirm('当前操作会删除服务器上的数据，请谨慎操作。确定要删除吗？', function () {
      //     $.seeAjax.post('delGaoSeng', {id: id}, function (res) {
      //       if (!res.success) {
      //         dialog(res.message || '操作失败，请稍后再试');
      //         return;
      //       }
      //       self.afterDel(id);
      //     });
      //   });
      // }
    },
    afterDel: function(id) {
      var components = share.figureComponent.components;
      share.figureComponent.components = components.filter(function(i) {
        return i.id !== id;
      });
      util.render();
    },
    clickRowEdit: function(e) {
      var $this = $(e.target);
      var id = parseInt($this.attr('data-edit-com-figure-row-edit'));

      share.editFigureId = id;

      var com = share.figureComponent.components.find(function(i) {
        return i.id === id;
      });

      $('#edit-pop-figure-title').text('编辑法师信息');
      $('[data-edit-pop-figure-avatar-row]').remove();
      $('#edit-pop-figure-add-avatar-box')
        .addClass('hide')
        .before(figureTpl.avatarRow.render({ image: com.avatar }));
      $('#edit-pop-figure-input-name').val(com.name);
      $('#edit-pop-figure-input-honor-name').val(com.honorName);
      $('#edit-pop-figure-input-description').val(com.description);
      $('#edit-pop-figure-input-description-count').text(
        com.description.length
      );
      $('#edit-pop-figure').show();
    },
    clickAdd: function(e) {
      share.editFigureId = 0;

      $('#edit-pop-figure-title').text('添加法师信息');
      $('[data-edit-pop-figure-avatar-row]').remove();
      $('#edit-pop-figure-add-avatar-box').removeClass('hide');
      $('#edit-pop-figure-input-name').val('');
      $('#edit-pop-figure-input-honor-name').val('');
      $('#edit-pop-figure-input-description').val('');
      $('#edit-pop-figure-input-description-count').text(0);
      $('#edit-pop-figure').show();
    },
  });
});
