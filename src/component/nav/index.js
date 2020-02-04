import 'bootstrap/dist/css/bootstrap.css';
import '@senntyou/shortcut.css';
import 'colors.css/css/colors.css';
import 'element-ui/lib/theme-chalk/index.css';
import '../../less/base.less';
import '../../styles/base.less';
import './index.css';
import '../../../pro-com/src/ie-tip';
import 'bootstrap';
import $ from 'jquery';
import data from './js/data';
import init from './js/init';
import './js/view';
import '../../com/report';
$.ajaxSetup({
  cache: !1,
});
$.getJSON(data.url, {}, res => {
  init(res);
});
