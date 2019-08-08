import 'component/nav';
import '@senntyou/shortcut.css';
import '../../../old-com/pagination/src/index.less';
import '../../../old-com/promotion/less/index.less';
import 'tippy.js/dist/tippy.css';
import 'toastr/build/toastr.css';
import 'less/common.less';
import 'less/bootstrap.less';
import 'less/pagination.less';
import './index.less';

// import $ from 'jquery';
import seeAjax from 'see-ajax';
import 'tippy.js';
import { requestManList, requestVerifyList } from './util';
import './ajax';
import './view';
import share from './share';

requestVerifyList();
requestManList();

seeAjax('info', {}, res => {
  if (res.data && res.data.promoteUrl) share.promoteUrl = res.data.promoteUrl;
});

// setTimeout(() => {
//   $('[data-content-tab="2"]').trigger('click');
// }, 500);
