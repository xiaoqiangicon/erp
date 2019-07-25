/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  'common/function',
  '../../data',
  '../../tpl/common',
  '../../tpl/shortcut',
  './util',
  'lib/jquery.seeView',
], function(
  $,
  commonFunc,
  indexData,
  commonTpl,
  shortcutTpl,
  shortcutViewUtil
) {
  $.seeView({
    events: {
      // 标题改变
      'keyup [data-edit-shortcut-title]': 'onKeyupEditShortcutTitle',
      // 点击添加项目
      'click [data-edit-shortcut-add-btn]': 'onClickEditShortcutAddBtn',
      // 点击删除下项目
      'click [data-edit-shortcut-cell-delete]': 'onClickCellDelete',
      // 点击编辑项目
      'click [data-edit-shortcut-cell-edit]': 'onClickCellEdit',
    },
    // 标题改变
    onKeyupEditShortcutTitle: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-edit-shortcut-title')),
        $title = $('[data-display-shortcut-title="' + id + '"]'),
        value = $this.val().trim();

      $title.text(value);
      !value ? $title.hide() : $title.show();
    },
    // 点击添加项目
    onClickEditShortcutAddBtn: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-edit-shortcut-add-btn')),
        $popup = $('[data-shortcut-popup="' + id + '"]');

      if (!!$popup.length) {
        // 应产品要求，如果存在，先移除
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

      // 顺序设为0，表示是编辑条目
      shortcutViewUtil.currentEditSequence = 0;
    },
    // 点击删除下项目
    onClickCellDelete: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-edit-shortcut-cell-delete'));

      $this.parents('[data-edit-shortcut-cell]').remove();
      self.rearrangeItems(id);
      $('[data-edit-shortcut-add="' + id + '"]').show();
    },
    // 重新排序
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
        // 更换图片尺寸
        $shortcutBody.append(shortcutTpl.displayCell.render(item));
      });
    },
    // 点击编辑项目
    onClickCellEdit: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-edit-shortcut-cell-edit')),
        $parent = $this.parent(),
        sequence = 0, // 当前的li元素所排的顺序，1开始
        $popup = $('[data-shortcut-popup="' + id + '"]');

      // 获取到顺序值
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
    // 渲染弹出框，编辑条目的时候
    renderShortcutPopup: function(editData) {
      if (editData.sequence <= 0) return;

      // 正在渲染编辑数据
      shortcutViewUtil.inRenderEditItem = !0;

      // 设置当前正在编辑条目的顺序
      shortcutViewUtil.currentEditSequence = editData.sequence;
      // 标题
      $('[data-edit-shortcut-popup-name="' + editData.id + '"]').val(
        editData.title
      );
      // 图片
      var $addEl = $('[data-edit-shortcut-popup-add="' + editData.id + '"]');
      var $image = $(
        '[data-edit-shortcut-popup-image-cell="' + editData.id + '"]'
      );
      if ($image.length) {
        $image.attr({ 'data-image': editData.image });
        $image.find('img').attr({ src: editData.image });
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

      // 触发点击一次，因为不确定原来存在的类型是什么，UI是怎么样的
      $(
        '[data-edit-shortcut-popup-type="' +
          editData.id +
          '"][value="' +
          editData.linkType +
          '"]'
      ).trigger('click');

      // 链接
      if (editData.linkType == 1) {
        $('[data-edit-shortcut-popup-link="' + editData.id + '"]').val(
          editData.link
        );
      }
      // 应用
      else {
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

        // 先隐藏所有的子类型容器
        $(
          '[data-shortcut-popup-sub-type-container="' + editData.id + '"]'
        ).hide();

        // 有子类型
        if (hasSubType) {
          // 显示当前子容器
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

      // 正在渲染编辑数据
      shortcutViewUtil.inRenderEditItem = !1;
    },
  });
});
