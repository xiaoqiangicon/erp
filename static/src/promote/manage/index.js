import 'component/nav';
import '@senntyou/shortcut.css';
import '@zzh/pagination/dist/pagination.css';
import 'tippy.js/dist/tippy.css';
import 'toastr/build/toastr.css';
import 'less/common.less';
import 'less/pagination.less';
import './index.less';

import $ from 'jquery';
import seeAjax from 'see-ajax';
import 'tippy.js';
import './ajax';
import './view';
import { requestItems } from './util';
import dialog from '../../util/dialog';

seeAjax('info', {}, res => {
  if (!res.success) {
    dialog(res.message);
    return;
  }

  const { title, statusText, addTime, ended, hasSelection } = res.data;
  $('#display-title').text(title);
  $('#display-status').text(statusText);
  $('#display-add-time').text(addTime);

  const $content1 = $('[data-content="1"]');

  if (ended) $content1.addClass('no-select');
  if (!hasSelection) $content1.addClass('no-selection');

  $('#summary').show();
  $content1.show();

  requestItems();
});
