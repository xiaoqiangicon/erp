import seeAjax from 'see-ajax';
import $ from 'jquery';
import toastr from 'toastr';
import commonFunc from 'common/function';
import promotion from '../../../component/promotion';
import confirm from 'util/confirm';
import dialog from 'util/dialog';
import func from '../function';
import indexData from '../data';
import 'jquery-confirm';
import seeView from 'see-view';
seeView({
  events: {
    'click [data-container="component-display"]': 'onClickComponentDisplay',
    'click [data-action="edit-component"]': 'onClickEditComponent',
    'click [data-action="add-component"]': 'onClickAddComponent',
    'click [data-action="delete-component"]': 'onClickDeleteComponent',
    'keyup [data-input-count]': 'onKeyUpInInputCount',
    'click [data-upload-image-delete]': 'onClickDeleteUploadImage',
    'click #cancel-data': 'onClickCancelData',
    'click #preview-data': 'previewData',
    'click [data-modal-close]': 'clickModalClose',
  },
  onClickComponentDisplay: function(e) {
    var self = this,
      $this = $(e.currentTarget),
      id = parseInt($this.attr('data-id').trim()),
      type = parseInt($this.attr('data-type').trim()),
      $editComponent,
      $editContainerParent = $('#design-sidebar');
    if ($this.hasClass('active')) return !1;
    $this.siblings().removeClass('active');
    $this.addClass('active');
    $editComponent = $(
      '[data-container="component-edit"][data-id="' +
        id +
        '"][data-type="' +
        type +
        '"]'
    );
    $editComponent.siblings().hide();
    $editComponent.show();
    $editContainerParent
      .css({
        'margin-top': $this.position().top + 64,
      })
      .show();
  },
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
    !$displayComponent.hasClass('active') &&
      ($displayComponent.siblings().removeClass('active'),
      $displayComponent.addClass('active'));
    !$editComponent.length &&
      (($editComponent = $(
        '[data-container="component-edit"][data-id="' +
          id +
          '"][data-type="' +
          type +
          '"]'
      )),
      $editComponent.siblings().hide(),
      $editComponent.show(),
      $editContainerParent
        .css({
          'margin-top': $displayComponent.position().top + 64,
        })
        .show());
  },
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
    !$displayComponent.hasClass('active') &&
      ($displayComponent.siblings().removeClass('active'),
      $displayComponent.addClass('active'),
      $editContainerParent
        .css({
          'margin-top': $displayComponent.position().top + 64,
        })
        .show());
    !$editComponent.length &&
      (($editComponent = $('[data-container="component-edit"][data-id="0"]')),
      $editComponent.siblings().hide(),
      $editComponent.show());
  },
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
        $this.attr({
          'data-handling': 1,
        });
        seeAjax(
          'deleteComponent',
          {
            id: id,
            sortId: sortId,
          },
          function(res) {
            $this.attr({
              'data-handling': 0,
            });
            if (res.success) {
              toastr.success('删除组件成功');
              self.removeComponent($displayComponent, $editComponent, isActive);
            } else {
              dialog(res.message || res.msg || '操作失败，请重新再试');
            }
          }
        );
      }
    });
  },
  removeComponent: function($displayComponent, $editComponent, isActive) {
    var $editContainerParent = $('#design-sidebar');
    var $activeDisplayComponent =
      !isActive && $('[data-container="component-display"].active');
    $displayComponent.remove();
    $editComponent.remove();
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
  onKeyUpInInputCount: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-input-count')),
      type = parseInt($this.attr('data-type')),
      value = $this.val().trim(),
      values = value.split(/\n/g);
    $('[data-input-count-display="' + id + '"][data-type="' + type + '"]').text(
      value.length + values.length - 1
    );
  },
  onClickDeleteUploadImage: function(e) {
    var $this = $(e.target),
      componentId = parseInt($this.attr('data-upload-image-delete')),
      imageId = parseInt($this.attr('data-image-id')),
      componentType = parseInt($this.attr('data-component-type')),
      sourceType,
      $popupSwipeListCellButton,
      $swipeDisplayImagesCells,
      $swipeDeleteButtons;
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
    } else if (componentType == 2) {
      $('[data-person-saying-avatar="' + componentId + '"]').removeAttr('src');
      $(
        '[data-file-upload-container="' + componentId + '"][data-type="2"]'
      ).show();
    } else if (componentType == 3) {
      sourceType = parseInt($this.attr('data-source-type'));
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
      func.reshowSwipeList(componentId, sourceType, 2);
    }
    $this.parents('[data-upload-image-container]').remove();
  },
  onClickCancelData: function(e) {
    commonFunc.confirm('你确定离开吗?（未保存的修改将不生效）', function() {
      commonFunc.removeCloseWindowHint();
      history.back();
    });
  },
  previewData: function(e) {
    var self = this;
    promotion.show({
      link: indexData.websiteUrl,
    });
  },
  clickModalClose: function(e) {
    var $this = $(e.target);
    if (
      $this.attr('data-modal-close') ||
      $this.parent().attr('data-modal-close')
    )
      $this.parents('.modal').hide();
  },
});
