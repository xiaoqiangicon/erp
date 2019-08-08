// ie-tip css
require('bootstrap/dist/css/bootstrap.css');
require('@zzh/ie-tip/dist/ie-tip.css');
require('../../less/base.less');
require('./index.css');

// ie-tip js
require('@zzh/ie-tip');
require('bootstrap');

const $ = require('jquery');

const data = require('./js/data');
const init = require('./js/init');
require('./js/view');

require('../../com/report');

// disable cache
$.ajaxSetup({ cache: !1 });

$.getJSON(data.url, {}, res => {
  init(res);
});
