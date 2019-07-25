/**
 * Created by kang on 2017/11/21.
 * 添加/编辑简介
 */

define(['common/env_data'], function(envData) {
  var data = {
    imgData: [], // 图片数组[{id src type}]
    getSceneParams: {
      type: 2, // 1获取全部场景列表不含简介等信息 2获取已设置的场景列表包括简介等信息 3获取未设置的场景列表不包含简介等信息
    },
    getSceneData: {},
    updateSetParams: {
      sceneId: '',
      summary: '',
      pic: '',
      sound: '',
    }, // 更新配置
  };

  return data;
});
