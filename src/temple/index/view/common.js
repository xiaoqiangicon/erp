/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  'toastr',
  'common/function',
  '@zzh/promotion',
  'util/confirm',
  'util/dialog',
  '../function',
  '../data',
  'jquery-confirm',
  'lib/jquery.seeView',
], function(
  $,
  toastr,
  commonFunc,
  promotion,
  confirm,
  dialog,
  func,
  indexData
) {
  $.seeView({
    events: {
      // 点击组件，切换活动的组件
      'click [data-container="component-display"]': 'onClickComponentDisplay',
      // 点击编辑组件按钮
      'click [data-action="edit-component"]': 'onClickEditComponent',
      // 点击添加组件按钮
      'click [data-action="add-component"]': 'onClickAddComponent',
      // 点击删除组件按钮
      'click [data-action="delete-component"]': 'onClickDeleteComponent',
      // 输入计数
      'keyup [data-input-count]': 'onKeyUpInInputCount',
      // 删除图片
      'click [data-upload-image-delete]': 'onClickDeleteUploadImage',
      // 点击取消按钮
      'click #cancel-data': 'onClickCancelData',
      // 预览
      'click #preview-data': 'previewData',
      // 点击关闭modal
      'click [data-modal-close]': 'clickModalClose',
    },
    // 点击组件，切换活动的组件
    onClickComponentDisplay: function(e) {
      var self = this,
        $this = $(e.currentTarget),
        id = parseInt($this.attr('data-id').trim()),
        type = parseInt($this.attr('data-type').trim()),
        $editComponent,
        $editContainerParent = $('#design-sidebar');

      // 如果本身已经处于激活状态，返回
      if ($this.hasClass('active')) return !1;

      // 跟新展示组件
      $this.siblings().removeClass('active');
      $this.addClass('active');

      $editComponent = $(
        '[data-container="component-edit"][data-id="' +
          id +
          '"][data-type="' +
          type +
          '"]'
      );
      // 更新编辑组件
      $editComponent.siblings().hide();
      $editComponent.show();

      // 更新编辑容器的位置
      $editContainerParent
        .css({
          'margin-top': $this.position().top + 64,
        })
        .show();
    },
    // 点击编辑组件按钮
    onClickEditComponent: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-id').trim()),
        type = parseInt($this.attr('data-type').trim()),
        $displayComponent = $(
          '[data-container="component-display"][data-id="' +
            id +
            '"][data-type="' +
            type +
            '"]'
        ),
        $editComponent = $(
          '[data-container="component-edit"][data-id="' +
            id +
            '"][data-type="' +
            type +
            '"]:visible'
        ),
        $editContainerParent = $('#design-sidebar');

      // 当前不是激活组件
      !$displayComponent.hasClass('active') &&
        ($displayComponent.siblings().removeClass('active'),
        $displayComponent.addClass('active'));

      // 当前调整编辑组件
      !$editComponent.length &&
        (($editComponent = $(
          '[data-container="component-edit"][data-id="' +
            id +
            '"][data-type="' +
            type +
            '"]'
        )),
        // 更新编辑组件
        $editComponent.siblings().hide(),
        $editComponent.show(),
        // 更新编辑容器的位置
        $editContainerParent
          .css({
            'margin-top': $displayComponent.position().top + 64,
          })
          .show());
    },
    // 点击添加组件按钮
    onClickAddComponent: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-id').trim()),
        type = parseInt($this.attr('data-type').trim()),
        $displayComponent = $(
          '[data-container="component-display"][data-id="' +
            id +
            '"][data-type="' +
            type +
            '"]'
        ),
        $editComponent = $(
          '[data-container="component-edit"][data-id="0"]:visible'
        ),
        $editContainerParent = $('#design-sidebar');

      // 当前不是激活组件
      !$displayComponent.hasClass('active') &&
        ($displayComponent.siblings().removeClass('active'),
        $displayComponent.addClass('active'),
        // 更新编辑容器的位置
        $editContainerParent
          .css({
            'margin-top': $displayComponent.position().top + 64,
          })
          .show());

      // 当前调整编辑组件
      !$editComponent.length &&
        (($editComponent = $('[data-container="component-edit"][data-id="0"]')),
        // 更新编辑组件
        $editComponent.siblings().hide(),
        $editComponent.show());
    },
    // 点击删除组件按钮
    onClickDeleteComponent: function(e) {
      var self = this,
        $this = $(e.target),
        handling = !!parseInt($this.attr('data-handling')),
        id = parseInt($this.attr('data-id').trim()),
        type = parseInt($this.attr('data-type').trim()),
        $displayComponent = $(
          '[data-container="component-display"][data-id="' +
            id +
            '"][data-type="' +
            type +
            '"]'
        ),
        $editComponent = $(
          '[data-container="component-edit"][data-id="' +
            id +
            '"][data-type="' +
            type +
            '"]'
        ),
        isActive = $displayComponent.hasClass('active'),
        sortId = parseInt($displayComponent.attr('data-server-sort-id')),
        isUpdate = !!parseInt($displayComponent.attr('data-is-update'));

      if (handling) return;

      var message = isUpdate
        ? '删除该组件将会同步到服务器，请谨慎操作。确定删除这个组件吗？'
        : '确定删除这个组件吗？';

      confirm(message, function() {
        if (!isUpdate)
          self.removeComponent($displayComponent, $editComponent, isActive);
        else {
          $this.attr({ 'data-handling': 1 });
          $.seeAjax.get('deleteComponent', { id: id, sortId: sortId }, function(
            res
          ) {
            $this.attr({ 'data-handling': 0 });

            if (res.success) {
              toastr.success('删除组件成功');
              self.removeComponent($displayComponent, $editComponent, isActive);
            } else {
              dialog(res.message || res.msg || '操作失败，请重新再试');
            }
          });
        }
      });
    },
    // 移除组件
    removeComponent: function($displayComponent, $editComponent, isActive) {
      var $editContainerParent = $('#design-sidebar');
      var $activeDisplayComponent =
        !isActive && $('[data-container="component-display"].active');

      // 移除展示组件和编辑组件
      $displayComponent.remove();
      $editComponent.remove();
      // 当前是激活组件
      isActive
        ? $editContainerParent.hide()
        : setTimeout(function() {
            $editContainerParent
              .css({
                'margin-top': $activeDisplayComponent.position().top + 64,
              })
              .show();
          }, 0);
    },
    // 输入计数
    onKeyUpInInputCount: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-input-count')),
        type = parseInt($this.attr('data-type')),
        value = $this.val().trim(),
        values = value.split(/\n/g); // 换行符要占两个字节
      $(
        '[data-input-count-display="' + id + '"][data-type="' + type + '"]'
      ).text(value.length + values.length - 1);
    },
    // 删除图片
    onClickDeleteUploadImage: function(e) {
      var $this = $(e.target),
        componentId = parseInt($this.attr('data-upload-image-delete')),
        imageId = parseInt($this.attr('data-image-id')),
        componentType = parseInt($this.attr('data-component-type')),
        sourceType,
        $popupSwipeListCellButton,
        $swipeDisplayImagesCells,
        $swipeDeleteButtons;

      // 寺院介绍
      if (componentType == 1) {
        $(
          '[data-component-id="' +
            componentId +
            '"][data-display-image-id="' +
            imageId +
            '"]'
        ).remove();
        $(
          '[data-file-upload-container="' + componentId + '"][data-type="1"]'
        ).show();
      }
      // 高僧法师说
      else if (componentType == 2) {
        $('[data-person-saying-avatar="' + componentId + '"]').removeAttr(
          'src'
        );
        // 应测试提出的需求，显示上传按钮
        $(
          '[data-file-upload-container="' + componentId + '"][data-type="2"]'
        ).show();
      }
      // 图文组件
      else if (componentType == 3) {
        sourceType = parseInt($this.attr('data-source-type'));
        // 由于后期需求，可以重复添加，故更改实现逻辑
        $swipeDisplayImagesCells = $(
          '[data-swipe-list-cell="' +
            componentId +
            '"]' +
            '[data-image-id="' +
            imageId +
            '"][data-source-type="' +
            sourceType +
            '"]'
        );
        $swipeDeleteButtons = $(
          '[data-upload-image-delete="' +
            componentId +
            '"]' +
            '[data-image-id="' +
            imageId +
            '"][data-source-type="' +
            sourceType +
            '"][data-component-type="3"]'
        );

        $swipeDeleteButtons.map(function(index) {
          if (this == e.target) {
            $($swipeDisplayImagesCells[index]).remove();
          }
        });

        // 原来的代码
        //$('[data-swipe-list-cell="' + componentId + '"][data-image-id="' + imageId + '"]').remove();
        // 更新到弹出框选择的项目
        //$popupSwipeListCellButton = $('[data-swipe-list-selected="1"][data-tab-index="1"][data-component-id="' + componentId + '"][data-image-id="' + imageId + '"]');
        //!!$popupSwipeListCellButton.length && (
        //    $popupSwipeListCellButton.removeClass('active'),
        //        $popupSwipeListCellButton.attr({
        //            'data-swipe-list-selected': 0
        //        }),
        //        $popupSwipeListCellButton.text('选取')
        //);

        func.reshowSwipeList(componentId, sourceType, 2);
      }
      $this.parents('[data-upload-image-container]').remove();
    },
    // 点击取消按钮
    onClickCancelData: function(e) {
      commonFunc.confirm('你确定离开吗?（未保存的修改将不生效）', function() {
        commonFunc.removeCloseWindowHint();
        history.back();
      });
    },
    // 预览
    previewData: function(e) {
      var self = this;
      promotion.show({
        link: indexData.websiteUrl,
      });
    },
    // 点击关闭modal
    clickModalClose: function(e) {
      var $this = $(e.target);
      if (
        $this.attr('data-modal-close') ||
        $this.parent().attr('data-modal-close')
      )
        $this.parents('.modal').hide();
    },
  });
});
