import seeAjax from 'see-ajax';

seeAjax.config('updateList', {
  url: [
    '/zzhadmin/charityAddOrUpdateSchedule/',
    '/src/kind/publish/data/add_or_update_schedule.json',
    '/src/kind/edit/data/add_or_update_schedule.json',
  ],
});
