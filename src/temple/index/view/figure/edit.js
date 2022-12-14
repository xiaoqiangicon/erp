import $ from 'jquery';
import commonFunc from 'common/function';
import indexData from '../../data';
import share from '../../share';
import confirm from '../../../../util/confirm';
import commonTpl from '../../tpl/common';
import figureTpl from '../../tpl/person_saying';
import util from './util';
import dialog from 'util/dialog';
import seeView from 'see-view';
seeView({
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
      .before(
        figureTpl.avatarRow.render({
          image: com.avatar,
        })
      );
    $('#edit-pop-figure-input-name').val(com.name);
    $('#edit-pop-figure-input-honor-name').val(com.honorName);
    $('#edit-pop-figure-input-description').val(com.description);
    $('#edit-pop-figure-input-description-count').text(com.description.length);
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
