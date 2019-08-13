import seeAjax from 'see-ajax';

const postHandle = res => {
  res.data.list.forEach((item, i) => {
    item.img = item.img.split(',');
  });
  res.data.list.forEach((item, i) => {
    item.video = item.video.split(',');
  });
};

seeAjax.config('scheduleList', {
  url: [
    '/zzhadmin/charityScheduleList/',
    '/src/kind/publish/data/schedule_list_server.json',
    '/src/kind/edit/data/schedule_list.json',
  ],
  postHandle: [postHandle, postHandle],
});
