const $ = require('jquery');

const commonTpl = require('common/tpl');

const mainTpl = require('./tpl/main');

$('body').append(mainTpl);

$('#list-container').html(commonTpl.loading);

require('./util/request_list')();
