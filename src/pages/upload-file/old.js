/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'common/upload_file', 'juicer'], ($, commonUpload) => {
  // 设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  $(document).on('click', '[data-content-row-delete]', e => {
    $(e.target)
      .parent()
      .parent()
      .remove();
  });

  const tplRow = juicer($('#tpl-row').html());

  const $contentBody = $('#content-body');
  commonUpload('#file-upload', url => {
    $contentBody.prepend(tplRow.render({ url }));
  });
});
