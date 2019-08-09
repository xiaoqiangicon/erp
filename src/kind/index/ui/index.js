require('component/nav');
require('@senntyou/shortcut.css');
require('less/common.less');
require('../index.less');

require('../../../../old-com/pagination/src/index.less');
require('less/pagination.less');
const Pagination = require('../../../../old-com/pagination/src');

const pagination = new Pagination('#pagination-container', {
  totalPages: 20,
});

pagination.render();
