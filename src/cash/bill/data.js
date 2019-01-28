/**
 * Created by senntyou on 2017/3/29.
 */
define(function() {
  var data = {
    // 状态是否请求过，默认首先请求正在处理的数据
    statusRequested: {
      1: !0,
    },
    //
    saveBillIds: [],
    // slider 实例
    slider: void 0,
    // 当前打赏金额，为 0 表示不打赏
    currentDonateMoney: 0,
    // 统计信息
    stat: {},
  };

  return data;
});
