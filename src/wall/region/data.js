/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery'], function($) {
  var data = {
    // 当前排序更新的ID
    currentSortId: 0,
    // 当前复制源项目的ID，0为新建
    currentCopyId: 0,
    // 记录列表数据
    listData: {},
    // 详细信息数据
    detailData: {},
    // 墙数据
    placeData: {
      // placeName => buddhaList
    },
    // 过滤
    filter: {
      place: '',
      buddha: 0,
    },
  };

  return data;
});
