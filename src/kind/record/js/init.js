import $ from 'jquery';
import seeAjax from 'see-ajax';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
import 'bootstrap-datepicker';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min.js';
import commonTpl from 'common/tpl';
import mainTpl from './tpl/main';
import fetchList from './util/request_list';
import './ajax';

seeAjax('main', {}, res => {
  $('body').append(mainTpl(res));

  $('#list-container').html(commonTpl.loading);

  fetchList();

  // 初始化日期选择器
  $('[data-date-input]').datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    forceParse: !1,
  });
});
