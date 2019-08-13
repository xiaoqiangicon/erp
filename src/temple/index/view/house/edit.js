import $ from 'jquery';
import commonFunc from 'common/function';
import indexData from '../../data';
import share from '../../share';
import confirm from '../../../../util/confirm';
import commonTpl from '../../tpl/common';
import houseTpl from '../../tpl/house';
import util from './util';
import dialog from 'util/dialog';
import 'lib/jquery.seeView';
$.seeView({
  events: {
    'change [data-edit-com-house-display-type]': 'changeDisplayType',
    'input [data-edit-com-house-title]': 'changeTitle',
    'propertychange [data-edit-com-house-title]': 'changeTitle',
    'click [data-edit-com-house-row-del]': 'clickRowDel',
    'click [data-edit-com-house-row-edit]': 'clickRowEdit',
    'click [data-edit-com-house-add]': 'clickAdd',
  },
  changeDisplayType: function(e) {
    var $this = $(e.target);
    var id = parseInt($this.attr('data-edit-com-house-display-type'));
    var value = parseInt(
      $('[data-edit-com-house-display-type]:checked').attr('value')
    );
    var $displayComponents = $(
      '[data-container="component-display"][data-type="7"][data-id="' +
        id +
        '"]'
    );
    if (value === 1) $displayComponents.removeClass('com-house-cell');
    else $displayComponents.addClass('com-house-cell');
  },
  changeTitle: function(e) {
    var $this = $(e.target);
    $('[data-com-house-title]').text($this.val());
  },
  clickRowDel: function(e) {
    var self = this;
    var $this = $(e.target);
    var id = parseInt($this.attr('data-edit-com-house-row-del'));
    var house = share.houseComponent.houses.find(function(i) {
      return i.id === id;
    });
    confirm('确定要删除吗？', function() {
      self.afterDel(id);
    });
  },
  afterDel: function(id) {
    var houses = share.houseComponent.houses;
    share.houseComponent.houses = houses.filter(function(i) {
      return i.id !== id;
    });
    util.render();
  },
  clickRowEdit: function(e) {
    var $this = $(e.target);
    var id = parseInt($this.attr('data-edit-com-house-row-edit'));
    share.editHouseId = id;
    var house = share.houseComponent.houses.find(function(i) {
      return i.id === id;
    });
    $('#edit-pop-house-title').text('编辑殿堂信息');
    $('[data-edit-pop-house-cover-row]').remove();
    var $addBox = $('#edit-pop-house-add-cover-box');
    house.covers.forEach(function(cover) {
      $addBox.before(
        houseTpl.coverRow.render({
          image: cover,
        })
      );
    });
    $('#edit-pop-house-input-name').val(house.name);
    $('#edit-pop-house-input-intro').val(house.intro);
    $('#edit-pop-house-input-intro-count').text(house.intro.length);
    $('#edit-pop-house').show();
  },
  clickAdd: function(e) {
    share.editHouseId = 0;
    $('#edit-pop-house-title').text('添加殿堂信息');
    $('[data-edit-pop-house-cover-row]').remove();
    $('#edit-pop-house-input-name').val('');
    $('#edit-pop-house-input-intro').val('');
    $('#edit-pop-house-input-intro-count').text(0);
    $('#edit-pop-house').show();
  },
});
