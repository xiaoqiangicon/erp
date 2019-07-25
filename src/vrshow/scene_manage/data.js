/**
 * Created by kang on 2017/11/20.
 */

define(['common/env_data'], function(envData) {
  var data = {
    currentTabIndex: 0, // 当前pane索引
    getSceneListParams: {
      // 获取列表参数
      type: 2, // 1 只获取场景列表 2获取包括简介和音频的场景列表
    },
    getSceneListRes: {}, // 获取的简介列表数据
    getSceneListData: {}, // 获取的简介列表数据的data 转换为id为键名的键值对格式
    getLinkListParams: {},
    getLinkListRes: {}, // 获取的链接列表数据
    getLinkListData: {}, // 获取到的链接列表数据的data 转换为id为键名的键值对格式
  };

  return data;
});
