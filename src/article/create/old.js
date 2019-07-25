/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  './data',
  './function',
  './view',
  'bootstrap-datetime-picker',
  'bootstrap-datetime-picker/js/locales/bootstrap-datetimepicker.zh-CN',
], function($, commonFunc, data, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
    error: function() {
      commonFunc.dialog('网络链接错误，请稍后重试');
      $('[data-save="1"]')
        .attr({ 'data-handling': 0 })
        .text(data.saveTypeOriginText[0]);
      $('[data-save="2"]')
        .attr({ 'data-handling': 0 })
        .text(data.saveTypeOriginText[1]);
    },
  });
  // 添加离开窗口的提示
  commonFunc.addCloseWindowHint();

  // 创建编辑器示例
  data.editor = UE.getEditor('input-content', {
    initialFrameWidth: 700,
    initialFrameHeight: 400,
  });
  data.editor.addListener('ready', function(editor) {
    func.init();
  });

  // 初始化日期选择
  $('#input-publish-time').datetimepicker({
    format: 'yyyy-mm-dd hh:ii:ss',
    language: 'zh-CN',
    autoclose: true,
    forceParse: !1,
  });

  // tip
  //if (!window.localStorage['article-create-tip-showed']) {
  //    window.localStorage['article-create-tip-showed'] = 1;
  //    $('#tip-section').show();
  //}
  // 根据产品需求，每个新建佛事都有
  if (data.formatedParams.action == 'add') {
    $('#tip-section').show();
  }
});
