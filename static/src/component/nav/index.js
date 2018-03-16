
// ie-tip css
require('bootstrap/dist/css/bootstrap.css');
require('@zzh/ie-tip/dist/ie-tip.css');
require('./index.css');

// ie-tip js
require('@zzh/ie-tip');
require('bootstrap');

const $ = require('jquery');

let data = require('./js/data');
let init = require('./js/init');
require('./js/view');

// disable cache
$.ajaxSetup({cache: !1});

$.getJSON(data.url, {}, function (res) {
    init(res);
});