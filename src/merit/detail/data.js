/**
 * Created by kang on 2017/11/8.
 */

define([], function() {
  var data = {
    getListParams: {
      page: 0,
      pageSize: 25,
      id: '',
    },
    getUserInfoParams: {
      id: '',
    },

    getListRes: {},
    getUserInfoRes: {},
    getTagRes: {}, // 获取的标签数据

    getTagHandleData: {}, // 处理后的标签数据 {id: {}}
  };

  return data;
});
