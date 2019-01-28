/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery'], function($) {
  var data = {
    // 自定义模板数据
    customTemplateData: {
      id: 0,
      name: '自定义',
      image: '/static/images/wall/index/custom_template.png',
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
