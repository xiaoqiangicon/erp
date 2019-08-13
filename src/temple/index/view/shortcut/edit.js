import $ from 'jquery';
import commonFunc from 'common/function';
import indexData from '../../data';
import commonTpl from '../../tpl/common';
import shortcutTpl from '../../tpl/shortcut';
import shortcutViewUtil from './util';
import 'lib/jquery.seeView';
$.seeView({
  events: {
    'keyup [data-edit-shortcut-title]': 'onKeyupEditShortcutTitle',
    'click [data-edit-shortcut-add-btn]': 'onClickEditShortcutAddBtn',
    'click [data-edit-shortcut-cell-delete]': 'onClickCellDelete',
    'click [data-edit-shortcut-cell-edit]': 'onClickCellEdit',
  },
  onKeyupEditShortcutTitle: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-edit-shortcut-title')),
      $title = $('[data-display-shortcut-title="' + id + '"]'),
      value = $this.val().trim();
    $title.text(value);
    !value ? $title.hide() : $title.show();
  },
  onClickEditShortcutAddBtn: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-edit-shortcut-add-btn')),
      $popup = $('[data-shortcut-popup="' + id + '"]');
    if (!!$popup.length) {
      $popup.remove();
    }
    $popup = $(
      shortcutTpl.editPopup.render({
        id: id,
        appTypes: indexData.misc.appTypes,
      })
    );
    $popup.appendTo('body');
    $popup.show();
    shortcutViewUtil.currentEditSequence = 0;
  },
  onClickCellDelete: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-edit-shortcut-cell-delete'));
    $this.parents('[data-edit-shortcut-cell]').remove();
    self.rearrangeItems(id);
    $('[data-edit-shortcut-add="' + id + '"]').show();
  },
  rearrangeItems: function(id) {
    var $shortcutBody = $('[data-display-shortcut-body="' + id + '"]'),
      $shortcutCells = $('[data-edit-shortcut-cell="' + id + '"]'),
      items = [];
    $shortcutCells.map(function() {
      var $this = $(this),
        title = $this.attr('data-title'),
        image = $this.attr('data-image'),
        link = $this.attr('data-link');
      items.push({
        title: title,
        image: image,
        link: link,
      });
    });
    $shortcutBody.html('');
    items.map(function(item) {
      $shortcutBody.append(shortcutTpl.displayCell.render(item));
    });
  },
  onClickCellEdit: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-edit-shortcut-cell-edit')),
      $parent = $this.parent(),
      sequence = 0,
      $popup = $('[data-shortcut-popup="' + id + '"]');
    $('[data-edit-shortcut-cell="' + id + '"]').map(function(index) {
      if (this == $parent[0]) sequence = index + 1;
    });
    var title = $parent.attr('data-title'),
      image = $parent.attr('data-image'),
      link = $parent.attr('data-link'),
      type = parseInt($parent.attr('data-type')),
      linkType = parseInt($parent.attr('data-link-type')),
      subTypeId = parseInt($parent.attr('data-sub-type-id'));
    if (!$popup.length) {
      $popup = $(
        shortcutTpl.editPopup.render({
          id: id,
          appTypes: indexData.misc.appTypes,
        })
      );
      $popup.appendTo('body');
    }
    $popup.show();
    self.renderShortcutPopup({
      id: id,
      sequence: sequence,
      title: title,
      image: image,
      link: link,
      type: type,
      linkType: linkType,
      subTypeId: subTypeId,
    });
  },
  renderShortcutPopup: function(editData) {
    if (editData.sequence <= 0) return;
    shortcutViewUtil.inRenderEditItem = !0;
    shortcutViewUtil.currentEditSequence = editData.sequence;
    $('[data-edit-shortcut-popup-name="' + editData.id + '"]').val(
      editData.title
    );
    var $addEl = $('[data-edit-shortcut-popup-add="' + editData.id + '"]');
    var $image = $(
      '[data-edit-shortcut-popup-image-cell="' + editData.id + '"]'
    );
    if ($image.length) {
      $image.attr({
        'data-image': editData.image,
      });
      $image.find('img').attr({
        src: editData.image,
      });
    } else {
      $image = $(
        shortcutTpl.editPopupImageCell.render({
          id: editData.id,
          image: editData.image,
        })
      );
      $addEl.before($image);
    }
    $addEl.hide();
    $(
      '[data-edit-shortcut-popup-type="' +
        editData.id +
        '"][value="' +
        editData.linkType +
        '"]'
    ).trigger('click');
    if (editData.linkType == 1) {
      $('[data-edit-shortcut-popup-link="' + editData.id + '"]').val(
        editData.link
      );
    } else {
      var $selectType = $(
        '[data-shortcut-popup-select-type="' +
          editData.id +
          '"][data-type="' +
          editData.type +
          '"]'
      );
      var $selectedType = $(
        '[data-shortcut-popup-selected-type="' + editData.id + '"]'
      );
      var hasSubType = !!parseInt($selectType.attr('data-has-sub-type'));
      $selectedType
        .attr({
          'data-type': editData.type,
          'data-url': hasSubType ? '' : editData.link,
          'data-has-sub-type': hasSubType ? 1 : 0,
        })
        .text($selectType.text());
      $(
        '[data-shortcut-popup-sub-type-container="' + editData.id + '"]'
      ).hide();
      if (hasSubType) {
        $(
          '[data-shortcut-popup-sub-type-container="' +
            editData.id +
            '"][data-parent-type="' +
            editData.type +
            '"]'
        ).show();
        var $selectSubType = $(
          '[data-shortcut-popup-select-sub-type="' +
            editData.id +
            '"][data-parent-type="' +
            editData.type +
            '"][data-sub-type-id="' +
            editData.subTypeId +
            '"]'
        );
        var $selectedSubType = $(
          '[data-shortcut-popup-selected-sub-type="' +
            editData.id +
            '"][data-parent-type="' +
            editData.type +
            '"]'
        );
        $selectedSubType
          .attr({
            'data-sub-type-id': editData.subTypeId,
            'data-url': editData.link,
          })
          .text($selectSubType.text());
      }
    }
    shortcutViewUtil.inRenderEditItem = !1;
  },
});
