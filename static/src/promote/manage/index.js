import 'component/nav';
import '@senntyou/shortcut.css';
import '@zzh/pagination/dist/pagination.css';
import 'tippy.js/dist/tippy.css';
import 'toastr/build/toastr.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
import 'less/common.less';
import 'less/pagination.less';
import './index.less';

import $ from 'jquery';
import seeAjax from 'see-ajax';
import 'tippy.js';
import 'bootstrap-datepicker';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min.js';
import './ajax';
import './view';
import { filter, requestItems, requestRecords } from './util';
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
  requestRecords();
});

// 初始化日期选择器
$('#filter-time')
  .datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    forceParse: !1,
  })
  .on('changeDate', () => {
    filter.time = $('#filter-time').val();
    requestRecords();
  });

// setTimeout(() => {$('[data-content-tab="2"]').trigger('click')}, 500);
