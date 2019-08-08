// ie-tip css
require('bootstrap/dist/css/bootstrap.css');
require('../../../old-com/ie-tip/src/css/index.css');
require('../../less/base.less');
require('./index.css');

// ie-tip js
require('../../../old-com/ie-tip/src');
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
