import 'component/nav';
import '@senntyou/shortcut.css';
import '@zzh/pagination/dist/pagination.css';
import '@zzh/promotion/dist/promotion.css';
import 'tippy.js/dist/tippy.css';
import 'toastr/build/toastr.css';
import 'less/common.less';
import 'less/pagination.less';
import './index.less';

// import $ from 'jquery';
import 'tippy.js';
import { requestInfo, requestManList, requestVerifyList } from './util';
import './ajax';
import './view';

requestInfo();
requestVerifyList();
requestManList();

// setTimeout(() => {
//   $('[data-content-tab="2"]').trigger('click');
// }, 500);
