/**
 * Created by senntyou on 2017/12/5.
 */

define(['jquery', 'orchids', 'tippy', '../data', '../tpl', '../util'], function(
  $,
  orchids,
  Tippy,
  data,
  tpl,
  util
) {
  orchids.registerPage(
    'detail',
    {
      created: function(param) {
        var self = this;

        self.$el = $(self.el);

        util.disableBodyScroll();
        var item = data.listItems[param.id];
        item.templeName = window.localStorage['templename'];
        self.$el.html(tpl.detail.render(item));

        // 确定元素的高度
        $('#detail-summary-right-unit').css({
          height: $('#detail-summary-left-unit').outerHeight(),
        });

        // 使用了绝对定位，会错位
        // new Tippy('[data-tip]');
      },
      destroyed: function() {
        util.enableBodyScroll();
      },
    },
    {
      backgroundColor: '#f5f5f5',
      direction: 'b2t',
      route: !1,
    }
  );
});
