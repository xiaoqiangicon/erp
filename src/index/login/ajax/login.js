import seeAjax from 'see-ajax';

seeAjax.config('login', {
  method: ['post'],
  url: [
    '/accounts/login/',
    '/src/kind/edit/data/add_server.json',
    '/src/kind/edit/data/add.json',
  ],
});
