/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery'], function($) {
  var data = {
    // 自定义模板数据
    customTemplateData: {
      id: 0,
      name: '自定义',
      image:
        'https://pic.zizaihome.com/e79d2448-22d8-11e9-9b75-00163e0c001e.png',
      // 不显示类别
      notShowCategory: !0,
    },
    // 窗体宽
    winWidth: $(window).width(),
    // 当前排序更新的ID
    currentSortId: 0,
  };

  return data;
});
