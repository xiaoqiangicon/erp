import $ from 'jquery';
import ChooseIcon from '../../../../com-deprecated/choose-icon';
import commonFunc from 'common/function';
import indexData from '../../data';
import commonTpl from '../../tpl/common';
import shortcutTpl from '../../tpl/shortcut';
import shortcutViewUtil from './util';
import seeView from 'see-view';
var chooseIconInstances = {};
var defaultMatches = {
  1: {
    name: '项目日历',
    image: 'https://pic.zizaihome.com/1e22b945-a97c-4134-a452-38803d4710b1.png',
  },
  3: {
    name: '义工招募',
    image: 'https://pic.zizaihome.com/ff19f684-6df0-423f-9373-ae57703a6999.png',
  },
  4: {
    name: '功德箱',
    image: 'https://pic.zizaihome.com/277160b4-fc4e-4142-a00f-f49a2984f935.png',
  },
  5: {
    name: '寺院文章',
    image: 'https://pic.zizaihome.com/3c2f5f8c-8f80-465d-9d57-9ec023e061a4.png',
  },
};
seeView({
  events: {
    'click [data-shortcut-popup]': 'onClickShortcutPopup',
    'click [data-edit-shortcut-popup-add-btn]': 'onClickPopupAddBtn',
    'click [data-edit-shortcut-popup-image-cell-delete]':
      'onClickPopupImageCellDelete',
    'change [data-edit-shortcut-popup-type]': 'onChangePopupType',
    'click [data-shortcut-popup-select-type]': 'onClickPopupSelectType',
    'click [data-shortcut-popup-select-sub-type]': 'onClickPopupSelectSubType',
    'click [data-edit-shortcut-popup-confirm]': 'onClickPopupConfirm',
  },
  onClickShortcutPopup: function(e) {
    var $this = $(e.target),
      $modal = $this.parents('.modal'),
      close =
        !!$this.attr('data-popup-close') ||
        !!$this.attr('data-popup-backdrop') ||
        !!$this.parent().attr('data-popup-close');
    !!close && $modal.hide();
  },
  onClickPopupAddBtn: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-edit-shortcut-popup-add-btn')),
      chooseIcon = chooseIconInstances[id];
    if (!chooseIcon) {
      chooseIcon = new ChooseIcon({
        type: 2,
        multiSelect: !1,
        onSubmit: function(data) {
          self.afterGetImage(data, id);
        },
      });
      chooseIconInstances[id] = chooseIcon;
    }
    chooseIcon.show();
  },
  afterGetImage: function(data, id) {
    var $image = $('[data-edit-shortcut-popup-image-cell="' + id + '"]'),
      $addEl = $('[data-edit-shortcut-popup-add="' + id + '"]');
    if (!data.length) {
      return;
    }
    !$image.length
      ? (($image = $(
          shortcutTpl.editPopupImageCell.render({
            id: id,
            image: data[0].src,
          })
        )),
        $addEl.before($image))
      : ($image.attr({
          'data-image': data[0].src,
        }),
        $image.find('img').attr({
          src: data[0].src,
        })),
      $addEl.hide();
  },
  onClickPopupImageCellDelete: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-edit-shortcut-popup-image-cell-delete'));
    $('[data-edit-shortcut-popup-image-cell="' + id + '"]').remove();
    $('[data-edit-shortcut-popup-add="' + id + '"]').show();
  },
  onChangePopupType: function(e) {
    var $tempThis = $(e.target),
      id = parseInt($tempThis.attr('data-edit-shortcut-popup-type')),
      $this = $('[data-edit-shortcut-popup-type="' + id + '"]:checked'),
      value = parseInt($this.attr('value'));
    $('[data-edit-shortcut-popup-type-content="' + id + '"]').hide();
    $(
      '[data-edit-shortcut-popup-type-content="' +
        id +
        '"][data-value="' +
        value +
        '"]'
    ).show();
    if (!shortcutViewUtil.inRenderEditItem) {
      var selectedType = parseInt(
        $('[data-shortcut-popup-selected-type="' + id + '"]').attr('data-type')
      );
      var $title = $('[data-edit-shortcut-popup-name="' + id + '"]');
      var $image = $('[data-edit-shortcut-popup-image-cell="' + id + '"]');
      var $add = $('[data-edit-shortcut-popup-add="' + id + '"]');
      if (
        value == 2 &&
        Object.keys(defaultMatches).indexOf(selectedType + '') > -1
      ) {
        $title.val(defaultMatches[selectedType].name);
        if (!$image.length) {
          $add.before(
            shortcutTpl.editPopupImageCell.render({
              id: id,
              image: defaultMatches[selectedType].image,
            })
          );
        } else {
          $image.attr({
            'data-image': defaultMatches[selectedType].image,
          });
          $image.find('img').attr({
            src: defaultMatches[selectedType].image,
          });
        }
        $add.hide();
      } else {
        $title.val('');
        $image.length && $image.remove();
        $add.show();
      }
    }
  },
  onClickPopupSelectType: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-shortcut-popup-select-type')),
      type = parseInt($this.attr('data-type')),
      url = $this.attr('data-url'),
      hasSubType = parseInt($this.attr('data-has-sub-type')),
      name = $this.text();
    var $selected = $('[data-shortcut-popup-selected-type="' + id + '"]'),
      selectedType = parseInt($selected.attr('data-type'));
    if (selectedType == type) return;
    $selected
      .attr({
        'data-type': type,
        'data-url': url,
        'data-has-sub-type': hasSubType,
      })
      .text(name);
    $('[data-shortcut-popup-sub-type-container="' + id + '"]').hide();
    $(
      '[data-shortcut-popup-sub-type-container="' +
        id +
        '"][data-parent-type="' +
        type +
        '"]'
    ).show();
    if (!shortcutViewUtil.inRenderEditItem) {
      var $title = $('[data-edit-shortcut-popup-name="' + id + '"]');
      var $image = $('[data-edit-shortcut-popup-image-cell="' + id + '"]');
      var $add = $('[data-edit-shortcut-popup-add="' + id + '"]');
      if (Object.keys(defaultMatches).indexOf(type + '') > -1) {
        $title.val(defaultMatches[type].name);
        if (!$image.length) {
          $add.before(
            shortcutTpl.editPopupImageCell.render({
              id: id,
              image: defaultMatches[type].image,
            })
          );
        } else {
          $image.attr({
            'data-image': defaultMatches[type].image,
          });
          $image.find('img').attr({
            src: defaultMatches[type].image,
          });
        }
        $add.hide();
      } else {
        $title.val('');
        $image.length && $image.remove();
        $add.show();
      }
    }
  },
  onClickPopupSelectSubType: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-shortcut-popup-select-sub-type')),
      parentType = parseInt($this.attr('data-parent-type')),
      subTypeId = parseInt($this.attr('data-sub-type-id')),
      url = $this.attr('data-url'),
      name = $this.text();
    var $selected = $(
        '[data-shortcut-popup-selected-sub-type="' +
          id +
          '"][data-parent-type="' +
          parentType +
          '"]'
      ),
      selectedId = parseInt($selected.attr('data-sub-type-id'));
    if (selectedId == subTypeId) return;
    $selected
      .attr({
        'data-sub-type-id': subTypeId,
        'data-url': url,
      })
      .text(name);
  },
  onClickPopupConfirm: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-edit-shortcut-popup-confirm'));
    var data = self.checkPopupData(id);
    if (!data.result) {
      commonFunc.dialog(data.message);
      return;
    }
    $('[data-shortcut-popup="' + id + '"]').hide();
    $('[data-edit-shortcut-popup-image-cell="' + id + '"]').remove();
    $('[data-edit-shortcut-popup-add="' + id + '"]').show();
    $('[data-edit-shortcut-popup-name="' + id + '"]').val('');
    $('[data-edit-shortcut-popup-link="' + id + '"]').val('');
    self.afterGetItem(data.data, id);
  },
  checkPopupData: function(id) {
    var data = {
      result: !1,
      message: '',
      data: {},
    };
    var $image = $('[data-edit-shortcut-popup-image-cell="' + id + '"]');
    if (!$image.length) {
      data.message = '图标不能为空，请选择后再保存';
      return data;
    }
    data.data.image = $image.attr('data-image');
    var $name = $('[data-edit-shortcut-popup-name="' + id + '"]'),
      name = $name.val().trim();
    if (!name) {
      data.message = '名称不能为空，请输入后再保存';
      return data;
    }
    data.data.title = name;
    var linkType = parseInt(
      $('[data-edit-shortcut-popup-type="' + id + '"]:checked').attr('value')
    );
    data.data.linkType = linkType;
    if (linkType == 2) {
      var $type = $('[data-shortcut-popup-selected-type="' + id + '"]'),
        type = parseInt($type.attr('data-type')),
        hasSubType = parseInt($type.attr('data-has-sub-type')),
        $subType =
          hasSubType &&
          $(
            '[data-shortcut-popup-selected-sub-type="' +
              id +
              '"][data-parent-type="' +
              type +
              '"]'
          ),
        subTypeId = hasSubType && parseInt($subType.attr('data-sub-type-id'));
      data.data.type = type;
      data.data.subTypeId = hasSubType ? subTypeId : 0;
      data.data.link = !hasSubType
        ? $type.attr('data-url')
        : $subType.attr('data-url');
    } else {
      var $link = $('[data-edit-shortcut-popup-link="' + id + '"]'),
        link = $link.val().trim();
      if (!link) {
        data.message = '链接不能为空，请输入后再保存';
        return data;
      }
      data.data.link = link;
    }
    data.result = !0;
    return data;
  },
  afterGetItem: function(data, id) {
    var self = this;
    if (!shortcutViewUtil.currentEditSequence) {
      var $addEl = $('[data-edit-shortcut-add="' + id + '"]'),
        $displayBody = $('[data-display-shortcut-body="' + id + '"]'),
        existedItemsLength = $('[data-edit-shortcut-cell="' + id + '"]').length;
      !existedItemsLength && $displayBody.html('');
      data.id = id;
      $addEl.before(shortcutTpl.editCell.render(data));
      $displayBody.append(shortcutTpl.displayCell.render(data));
      if (existedItemsLength >= indexData.misc.shortcutItemsLimit - 1)
        $addEl.hide();
    } else {
      var $editEl = $(
        $('[data-edit-shortcut-cell="' + id + '"]')[
          shortcutViewUtil.currentEditSequence - 1
        ]
      );
      var $displayEl = $(
        $('[data-display-shortcut-cell="' + id + '"]')[
          shortcutViewUtil.currentEditSequence - 1
        ]
      );
      $editEl.attr({
        'data-title': data.title,
        'data-image': data.image,
        'data-link': data.link,
        'data-type': data.type || 0,
        'data-link-type': data.linkType,
        'data-sub-type-id': data.subTypeId || 0,
      });
      $editEl.find('[data-edit-shortcut-cell-title]').text(data.title);
      $editEl.find('[data-edit-shortcut-cell-image]').attr({
        src: data.image,
      });
      $displayEl.attr({
        src: data.link,
      });
      $displayEl.find('[data-display-shortcut-cell-title]').text(data.title);
      $displayEl.find('[data-display-shortcut-cell-image]').attr({
        src: data.image,
      });
    }
  },
});
