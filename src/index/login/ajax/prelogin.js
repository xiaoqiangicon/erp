import seeAjax from 'see-ajax';

seeAjax.config('prelogin', {
  method: ['post'],
  url: [
    '/checkUserLoginTime/',
    '/src/kind/edit/data/add_server.json',
    '/src/kind/edit/data/add.json',
  ],
});
