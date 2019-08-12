import $ from 'jquery';
import seeView from 'see-view';

const $window = $(window);

seeView({
  events: {
    // 点击展开菜单
    'click [data-menu-item-id]': 'onClickMenuItemId',
  },
  // 点击展开菜单
  onClickMenuItemId: e => {
    e.stopPropagation();

    const $this = $(e.currentTarget);
    const $arrow = $this.find('.arrow');
    const isOpen = !$arrow.hasClass('active'); // 是否是展开操作

    $arrow.toggleClass('active');
    $this.children('> a').toggleClass('active');
    $this.find('span.glyphicon').toggleClass('green');
    $this.find('.component-nav-sub-menu-inner').slideToggle(() => {
      if (!isOpen) return;
      // 如果是展开操作，确定把底部顶出来
      const thisOffsetTop = $this.offset().top;
      const thisHeight = $this.height();
      const winHeight = $window.height();
      const winScrollTop = $window.scrollTop();
      // 需要顶开的距离
      const offsetHeight =
        thisOffsetTop + thisHeight - winHeight - winScrollTop;
      let timer; // 动画定时器
      let rate = 0;
      const stepRate = 0.05;
      const intervalTime = 20;
      if (offsetHeight > 0) {
        timer = setInterval(() => {
          rate += stepRate;
          $window.scrollTop(winScrollTop + offsetHeight * rate);
          if (rate >= 1) clearInterval(timer);
        }, intervalTime);
      }
    });
  },
});
