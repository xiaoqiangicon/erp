import 'component/nav';
import '@senntyou/shortcut.css';
import 'toastr/build/toastr.css';
import 'less/common.less';
import 'less/bootstrap.less';
import './index.less';

import 'component/ueditor_config';
import '@zzh/ueditor/src/ueditor.config';
import '@zzh/ueditor';

import 'component/ueditor_plugins/xiu_mi';
import 'component/ueditor_plugins/import_wx_article';
import 'component/ueditor_plugins/video';
import 'component/ueditor_plugins/choose_image';
import 'component/ueditor_plugins/choose_image_multi';
import './ajax';
import './view';
import share from './share';

share.editor = window.UE.getEditor('editor');

share.editor.ready(() => {
  // todo
});
