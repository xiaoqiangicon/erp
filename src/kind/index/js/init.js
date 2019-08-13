import $ from 'jquery';

import commonTpl from 'common/tpl';

import requestList from './util/request_list';

import mainTpl from './tpl/main';

$('body').append(mainTpl);

$('#list-container').html(commonTpl.loading);
$(document).click(() => {
  $('[data-more-operate]').addClass('more-hide');
});

requestList();
