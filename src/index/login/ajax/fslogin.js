import seeAjax from 'see-ajax';

seeAjax.config('fsLogin', {
  method: ['post'],
  url: [
    '/loginFeishu/',
    '/src/kind/edit/data/add_server.json',
    '/src/kind/edit/data/add.json',
  ],
});
