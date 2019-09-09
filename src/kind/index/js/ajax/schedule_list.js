import seeAjax from 'see-ajax';

const postHandle = res => {
  let temp = [];

  res.data.list.forEach((item, i) => {
    let result = [];
    var _item = item;

    if (!item.img) item.img = [];
    else {
      temp = item.img.split(',');
      temp.forEach((imgItem, i) => {
        if (
          imgItem.indexOf('img:') === -1 &&
          imgItem.indexOf('video:') === -1
        ) {
          if (_item.video && i < _item.video.split(',').length) {
            result.push({
              type: 1,
              src: _item.video.split(',')[i],
            });
          }
          result.push({
            type: 0,
            src: imgItem,
          });
        } else {
          if (imgItem.indexOf('img:') !== -1) {
            result.push({
              type: 0,
              src: imgItem.slice(4),
            });
          } else {
            result.push({
              type: 1,
              src: imgItem.slice(6),
            });
          }
        }
      });
      item.img = result;
      console.log(result);
    }
  });
  res.data.list.forEach((item, i) => {
    if (!item.video) item.video = [];
    else item.video = item.video.split(',');
  });
};

seeAjax.config('scheduleList', {
  url: [
    '/zzhadmin/charityScheduleList/',
    '/src/kind/index/data/schedule_list_server.json',
    '/src/kind/index/data/schedule_list.json',
  ],
  method: 'post',
  stringify: true,
  postHandle: [postHandle, postHandle],
});
