/**
 * Created by kang on 2017/11/8.
 */

define([], function() {
  var data = {
    curTab: 0, // 当前tab
    curTagId: 0, // 当前标签名
    allFollowNum: 0, // 全部关注人数

    getListParams: {
      page: 0,
      pageSize: 25,
      // searchText: '',
      // number: '',
      type: 1, // 1按善款金额排序 2 按总捐款次数排序
      // tagId: 0 // 不传字段为全部 0为全部已关注
    },
    getListRes: {}, // 获取的表格数据
    getTagRes: {}, // 获取的标签数据

    getTagHandleData: {}, // 处理后的标签数据 {id: {}}

    lockBlur: false, // blur事件会阻止click事件的!完整!进行
    // 可以使用mousedown代替click 首先触发mousedown 再触发blur 因为mousedown存在异步操作
    // 因此添加开关 点击元素时 禁止执行blur
  };

  return data;
});
