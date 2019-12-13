import 'bootstrap/dist/css/bootstrap.css';
import '@senntyou/shortcut.css';
import promotion from '..';
promotion.show(
  {
    link: 'http://haha.com',
    showPost: !0,
    postTitle: '啊呀呀呀呀呀呀',
    loadPost: (callback, title) => {
      console.log('加载海报图');
      console.log('标题: ' + title);
      callback('/images/chan-zai-648x648.png', 'http://hehe.com');
    },
    maxPostTitle: 30,
  },
  function() {
    console.log('close');
  }
);
