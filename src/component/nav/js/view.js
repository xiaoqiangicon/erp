
const $ = require('jquery');
const seeView = require('see-view');
const $window = $(window);

seeView({
    events: {
        // 点击展开菜单
        'click [data-menu-item-id]': 'onClickMenuItemId'
    },
    // 点击展开菜单
    onClickMenuItemId: (e) => {
        e.stopPropagation();

        var $this = $(e.currentTarget);
        var $arrow = $this.find(".arrow");
        var isOpen = !$arrow.hasClass('active'); // 是否是展开操作

        $arrow.toggleClass("active");
        $this.children("> a").toggleClass("active");
        $this.find("span.glyphicon").toggleClass("green");
        $this.find(".component-nav-sub-menu-inner").slideToggle(() => {
            if (!isOpen) return;
            // 如果是展开操作，确定把底部顶出来
            var thisOffsetTop = $this.offset().top;
            var thisHeight = $this.height();
            var winHeight = $window.height();
            var winScrollTop = $window.scrollTop();
            // 需要顶开的距离
            var offsetHeight = thisOffsetTop + thisHeight - winHeight - winScrollTop;
            var timer; // 动画定时器
            var rate = 0;
            var stepRate = 0.05;
            var intervalTime = 20;
            if (offsetHeight > 0) {
                timer = setInterval(() => {
                    rate += stepRate;
                    $window.scrollTop(winScrollTop + offsetHeight * rate);
                    if (rate >= 1) clearInterval(timer);
                }, intervalTime);
            }
        });
    }
});
