import seeAjax from 'see-ajax';

const postHandle = res => {
  res.data.list.forEach((item, i) => {
    if (!item.img) item.img = [];
    else item.img = item.img.split(',');
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
