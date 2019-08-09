// 配置 ueditor
window.UEDITOR_HOME_URL =
  location.hostname.split('.')[0] === 'localhost'
    ? '/pro-com/src/ueditor/'
    : '/static/res/ueditor/';
window.UEDITOR_SERVER_URL = '/zzhadmin/uploadPicUEditor/';
window.UEDITOR_MUSIC_IFRAME_URL =
  '/static/dist/html/component/ueditor_plugins/music_iframe.html';
window.UEDITOR_MUSIC_DIALOG_URL =
  '/static/dist/html/component/ueditor_plugins/music.html';
