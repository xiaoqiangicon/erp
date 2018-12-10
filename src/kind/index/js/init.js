
const $ = require('jquery');

const commonTpl = require('common/tpl');

let mainTpl = require('./tpl/main');

$('body').append(mainTpl);

$('#list-container').html(commonTpl.loading);

require('./util/request_list')();