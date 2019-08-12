const $ = require('jquery');

const commonTpl = require('common/tpl');

const mainTpl = require('./tpl/main');

$('body').append(mainTpl);

$('#list-container').html(commonTpl.loading);
$(document).click(() => {
  $('[data-more-operate]').addClass('more-hide');
});

require('./util/request_list')();
