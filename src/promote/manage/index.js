import '../../component/nav';
import '@senntyou/shortcut.css';
import '../../component/pagination/index.less';
import 'tippy.js/dist/tippy.css';
import 'toastr/build/toastr.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
import '../../less/common.less';
import '../../less/bootstrap.less';
import '../../less/pagination.less';
import './index.less';

import $ from 'jquery';
import 'tippy.js';
import 'bootstrap-datepicker';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min';
import './ajax';
import './view';
import { filter, requestItems, requestRecords } from './util';

requestItems();
requestRecords();

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
