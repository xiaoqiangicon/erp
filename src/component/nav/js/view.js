import $ from 'jquery';
import seeView from 'see-view';
import api from './api';
import initNotice from './util/init_notice';

const $window = $(window);

seeView({
  events: {
    // 点击展开菜单
    'click [data-menu-item-id]': 'onClickMenuItemId',
    'click [data-notice-item-id]': 'onClickNoticeItem',
    'click [data-notice-item-read]': 'onClickNoticeItemRead',
    'click #board-btn': 'onClickBoardBtn',
    'click #notice-btn-box': 'onClickNoticeSwitch',
    'click #notice-close': 'onClickNoticeSwitch',
  },
  // 点击跳转数据看板;
  onClickBoardBtn: e => {
    let templeName = window.localStorage.templeName;
    window.open(encodeURI(`/zzhadmin/panelDataHtml?templeName=${templeName}`));
  },
  // 点击显示/隐藏 侧栏推送通知
  onClickNoticeSwitch: e => {
    let r = $('.component-nav-notice').css('right');
    if (r === '0px') {
      $('.component-nav-notice').animate({ right: '-457px' });
    } else {
      initNotice();
      $('.component-nav-notice').animate({ right: '0px' });
    }
  },
  // 点击跳转通知中心页面
  onClickNoticeItem: e => {
    const $this = $(e.currentTarget);
    const id = $this.attr('data-notice-item-id');
    location.href = '/common/notice?showId=' + id;
  },
  // 点击更新通知为已读
  onClickNoticeItemRead: e => {
    e.stopPropagation();
    const $this = $(e.currentTarget);
    const id = $this.attr('data-notice-item-read');
    api.updateNoticeRead({ id }).then(res => {
      if (res.result === 0) {
        let total = parseInt($('#notice-unread-num>span').text());
        $('#notice-unread-num>span').text(total - 1);
        $this
          .parent()
          .parent()
          .remove();
      } else {
        alert(res.msg || '通知标记为已读失败！');
      }
    });
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
