import 'component/nav';
import '@senntyou/shortcut.css';
import '@zzh/pagination/dist/pagination.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
import 'tippy.js/dist/tippy.css';
import 'toastr/build/toastr.css';
import 'less/common.less';
import 'less/bootstrap.less';
import 'less/pagination.less';
import './index.less';

import $ from 'jquery';
import 'tippy.js';
import 'bootstrap-datepicker';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min.js';
import { requestInfo, requestList, filter } from './util';
import './ajax';
import './view';

requestInfo();
requestList();

// 初始化日期选择器
$('#time')
  .datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    forceParse: !1,
  })
  .on('changeDate', () => {
    filter.time = $('#time').val();
    requestList();
  });
