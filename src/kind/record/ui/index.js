import 'component/nav';
import '@senntyou/shortcut.css';
import 'less/common.less';
import 'less/bootstrap.less';
import '../index.less';
import '../../../../old-com/pagination/src/index.less';
import 'less/pagination.less';
import Pagination from '../../../../old-com/pagination/src';
const pagination = new Pagination('#pagination-container', {
  totalPages: 20,
});
pagination.render();
