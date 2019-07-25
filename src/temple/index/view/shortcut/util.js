/**
 * Created by senntyou on 2017/2/27.
 */
define(function() {
  var util = {};

  util.currentEditSequence = 0; // 当前正在编辑项目的序号，从1还是，如果是新建，此值便是0

  util.inRenderEditItem = !1; // 是否处于正在渲染编辑项目的时候

  return util;
});
