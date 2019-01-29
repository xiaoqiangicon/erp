/**
 * Created by kang on 2017/10/23.
 */

define(['common/env_data'], function(envData) {
  var data = {
    getListParams: {
      pageNum: 0,
      pageSize: 20,
    },
    getListRes: {},
    updateWatchwordParams: {
      id: '',
      name: '',
      content: '',
    },
  };

  return data;
});
