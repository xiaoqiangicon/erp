import 'component/nav';
import '@senntyou/shortcut.css';
import 'toastr/build/toastr.css';
import '@zzh/handling/dist/handling.css';
import '@zzh/promotion/dist/promotion.css';
import 'less/common.less';
import 'less/bootstrap.less';
import './index.less';

import $ from 'jquery';
import seeAjax from 'see-ajax';
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

seeAjax('info', {}, res => {
  if (!res.data) res.data = {};

  $('#content-1').show();
  $('#content-2').show();
  $(`[data-radio="receive"][data-value="${typeof res.data.receive !== 'undefined' ? res.data.receive : 1}"]`).addClass(
    'active'
  );
  $(`[data-radio="verify"][data-value="${typeof res.data.verify !== 'undefined' ? res.data.verify : 1}"]`).addClass(
    'active'
  );
  share.editor = window.UE.getEditor('editor');
  $('#title').val(res.data.title || '');

  share.editor.ready(() => {
    share.editor.setContent(res.data.intro || '');
  });
});
