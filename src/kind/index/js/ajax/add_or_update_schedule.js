import seeAjax from 'see-ajax';

seeAjax.config('updateList', {
  url: [
    '/zzhadmin/charityAddOrUpdateSchedule/',
    '/src/kind/index/data/add_or_update_schedule_server.json',
    '/src/kind/index/data/add_or_update_schedule.json',
  ],
  stringify: true,
  method: 'post',
});
