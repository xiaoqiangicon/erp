/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', './function', './data', './view'], function($, func, data) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });
  // 初始化编辑器
  data.editor = UE.getEditor('input-intro', {
    initialFrameWidth: 700,
    initialFrameHeight: 400,
  });
  data.editor.addListener('ready', function(editor) {
    func.init();
  });
});
