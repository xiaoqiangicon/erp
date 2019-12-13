import '../../component/nav';
import '@senntyou/shortcut.css';
import 'toastr/build/toastr.css';
import '../../com-deprecated/promotion/less/index.less';
import '../../less/common.less';
import '../../less/bootstrap.less';
import './index.less';

import $ from 'jquery';
import seeAjax from 'see-ajax';
import '../../component/ueditor_config';
import '../../../pro-com/src/ueditor/ueditor.config';
import '../../../pro-com/src/ueditor/ueditor.all';

import '../../component/ueditor_plugins/xiu_mi';
import '../../component/ueditor_plugins/import_wx_article';
import '../../component/ueditor_plugins/video';
import '../../component/ueditor_plugins/choose_image';
import '../../component/ueditor_plugins/choose_image_multi';
import './ajax';
import './view';
import share from './share';
import { defaultDetail, defaultTitle } from './util';

$('[data-temple-name]').text(window.localStorage.templeName);

seeAjax('info', {}, res => {
  if (!res.data) res.data = {};

  $('#content-1').show();
  $('#content-2').show();

  const receive = parseInt(res.data.receive, 10);
  $(`[data-radio="receive"][data-value="${receive === 0 ? 0 : 1}"]`).addClass(
    'active'
  );

  const verify = parseInt(res.data.verify, 10);
  $(`[data-radio="verify"][data-value="${verify === 0 ? 0 : 1}"]`).addClass(
    'active'
  );

  share.editor = window.UE.getEditor('editor', {
    initialFrameWidth: 700,
    initialFrameHeight: 400,
  });
  $('#title').val(res.data.title || defaultTitle);

  share.promoteUrl = res.data.promoteUrl;

  share.editor.ready(() => {
    share.editor.setContent(res.data.intro || defaultDetail);
  });
});
