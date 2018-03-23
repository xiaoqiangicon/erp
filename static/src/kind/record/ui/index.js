
require('component/nav');
require('@zzh/common.css');
require('less/common.less');
require('../index.less');

require('@zzh/pagination/dist/pagination.css');
require('less/pagination.less');
const Pagination = require('@zzh/pagination');

let pagination = new Pagination('#pagination-container', {
    totalPages: 20
});

pagination.render();