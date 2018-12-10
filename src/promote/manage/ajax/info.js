import seeAjax from 'see-ajax';

seeAjax.config('info', {
  url: ['', '/src/promote/manage/mock/info-1.json', '/src/promote/manage/mock/info.json'],
  implement: [
    cb => {
      const item = JSON.parse(window.sessionStorage['promote/list:item']);

      cb({
        result: 1,
        data: {
          title: item.title,
          ended: item.ended,
          addTime: item.addPromotionTime,
          statusText: item.ended === 0 ? '进行中' : '已结束',
        },
      });
    },
  ],
});
