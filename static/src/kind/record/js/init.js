
const $ = require('jquery');
const seeAjax = require('see-ajax');
require('bootstrap-datepicker/dist/css/bootstrap-datepicker.css');
require('bootstrap-datepicker');
require('bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min.js');

const commonTpl = require('common/tpl');

let mainTpl = require('./tpl/main');
require('./ajax');

seeAjax('main', {}, res => {

    $('body').append(mainTpl(res));

    $('#list-container').html(commonTpl.loading);

    require('./util/request_list')();

    // 初始化日期选择器
    $('[data-date-input]').datepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        autoclose: true,
        forceParse: !1
    });
});