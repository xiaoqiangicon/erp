/**
 * Created by senntyou on 2017/8/23.
 */

define(['jquery', 'juicer'], function($) {
  var tpl = {
    buddhaCell: juicer($('#tpl-buddha-cell').html()),
    tagCell: juicer($('#tpl-tag-cell').html()),
    previewImageCell: juicer($('#tpl-preview-image-cell').html()),
    coverImageCell: juicer($('#tpl-cover-image-cell').html()),
    shareImageCell: juicer($('#tpl-share-image-cell').html()),
    tagPopupCell: juicer($('#tpl-tag-popup-cell').html()),
    printerCell: juicer($('#tpl-printer-cell').html()),
  };

  return tpl;
});
