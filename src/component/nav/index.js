import 'bootstrap/dist/css/bootstrap.css';
import '../../less/base.less';
import './index.less';
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
