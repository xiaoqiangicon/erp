import 'component/nav';
import '@senntyou/shortcut.css';
import 'less/common.less';
import 'less/bootstrap.less';
import '../index.less';
import '../../../com-deprecated/pagination/index.less';
import 'less/pagination.less';
import Pagination from '../../../com-deprecated/pagination';
const pagination = new Pagination('#pagination-container', {
  totalPages: 20,
});
pagination.render();
