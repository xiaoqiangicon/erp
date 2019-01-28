/**
 * Created by senntyou on 2017/3/29.
 */
define([
  'jquery',
  'orchids',
  'toastr',
  'common/function',
  '../tpl',
  '../data',
  '../util',
  'lib/jquery.seeView',
], function($, orchids, toastr, fn, tpl, data, util) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;

  var upload;
  var $receiptsContent = $('#dialog-receipts-content');

  $.seeView({
    events: {
      // 点击删除一个图片项目
      'click [data-popup-receipts-row-delete]': 'onClickPopupReceiptsRowDelete',
      // 点击确定添加收据
      '!click #dialog-receipts-ok': 'onClickDialogReceiptsOk',
    },
    // 点击删除一个图片项目
    onClickPopupReceiptsRowDelete: function(e) {
      $(e.target)
        .parent()
        .remove();
    },
    // 点击确定添加收据
    onClickDialogReceiptsOk: function(e) {
      var self = this,
        $images = $('[data-popup-receipts-row]');

      if (!$images.length) {
        fn.dialog('请至少上传一张收据照片');
        return;
      }

      var images = [];
      $images.map(function() {
        images.push($(this).attr('data-image'));
      });

      fn.confirm(
        '请确认您上传的收据照片是否正确，确认之后则不能更改',
        function() {
          $.seeAjax.post(
            'addReceipts',
            { id: data.currentHandleId, images: JSON.stringify(images) },
            function(res) {
              if (res.success) {
                toastr.success('上传收据照片成功');
                setTimeout(function() {
                  self.afterSave(images);
                }, 200);
              }
            }
          );
        }
      );
    },
    afterSave: function(images) {
      // 隐藏对话框
      $('#dialog-receipts').hide();
      util.enableBodyScroll();

      // 列表数据
      var item = data.listItems[data.currentHandleId];
      item.type = 5;
      item.typeText = data.typeTexts[0][item.type - 1];
      item.receipts = images;
      item.receiptsString = images.join(',');

      // 列表UI
      $('[data-unit-type][data-id="' + data.currentHandleId + '"]')
        .removeClass('red')
        .text(item.typeText);
      $('[data-unit-upload-receipts="' + data.currentHandleId + '"]')
        .removeAttr('data-unit-upload-receipts')
        .removeAttr('data-receipts')
        .attr({ 'data-show-images': item.receiptsString })
        .text('收据照片');

      // 隐藏orchids detail, 如果有
      orchids.back();
    },
  });
});
