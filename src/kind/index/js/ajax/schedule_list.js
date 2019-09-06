import seeAjax from 'see-ajax';

const postHandle = res => {
  let temp = [];
  let str = `img:https://pic.zizaihome.com/e199ad38-acd0-11e8-9f77-00163e022fdd.jpg,
  video:https://pic.zizaihome.com/ea39b926-d054-11e9-8073-00163e0c1e1c.jpg,
  img:https://pic.zizaihome.com/e199ad38-acd0-11e8-9f77-00163e022fdd.jpg`;
  // console.log(res.data.list)
  res.data.list.forEach((item, i) => {
    let result = [];
    if (!item.img) item.img = [];
    else {
      temp = item.img.split(',');
      temp.forEach((item, i) => {
        if (item.indexOf('img:') !== -1) {
          result.push({
            type: 0,
            src: item.slice(4),
          });
        } else {
          result.push({
            type: 1,
            src: item.slice(6),
          });
        }
      });
      item.img = result;
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
