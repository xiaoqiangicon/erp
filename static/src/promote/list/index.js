import 'component/nav';
import '@senntyou/shortcut.css';
import '@zzh/pagination/dist/pagination.css';
import 'tippy.js/dist/tippy.css';
import 'toastr/build/toastr.css';
import 'less/common.less';
import 'less/pagination.less';
import './index.less';

import 'tippy.js';
import { requestList } from './util';
import './ajax';
import './view';

requestList();
