/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery'], function($) {
  var data = {
    // 窗体宽
    winWidth: $(window).width(),
    // 所有的区域集合
    regions: {},
    // 详细信息数据集合
    detailData: {},
    // 单元格数据
    cellData: {},
    // 点击编辑的区域ID
    currentRegionId: 0,
    // 当前的序列号
    currentSequence: '',
    // 当前的行
    currentRow: 0,
    // 当前的列
    currentColumn: 0,
    // 当前线上订单的行
    lastOnlineRow: 0,
    // 当前线上订单的列
    lastOnlineColumn: 0,
    // 当前操作是添加（否的话是编辑）
    currentActionIsAdd: !0,
    // 当前编辑订单是不是线上数据
    currentEditIsOnline: !1,
    // 当前hover popup是否处于固定状态
    hoverPopupFreezing: !1,
    // 位置数组
    seatsArray: {
      // regionId -> []
    },
    // 行数记录
    rowsArray: {
      // regionId -> rows(int)
    },
    // 列数记录
    columnsArray: {
      // regionId -> columns(int)
    },
  };

  return data;
});
