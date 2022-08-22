import './ueditor_config.less';

// 配置 ueditor
window.UEDITOR_HOME_URL =
  location.hostname.split('.')[0] === 'localhost'
    ? 'https://www.zizaihome.com/static/res/ueditor-plus/'
    : '/static/res/ueditor-plus/';
window.UEDITOR_SERVER_URL = '/upload/uploadByUrl';
window.UEDITOR_MUSIC_IFRAME_URL =
  '/static/build/com/ueditor-plugins/self-music-iframe.html';
