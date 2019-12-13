import 'component/nav';
import '@senntyou/shortcut.css';
import '../../../component/pagination/index.less';
import 'less/common.less';
import 'less/bootstrap.less';
import 'less/pagination.less';
import '../index.less';

import Pagination from '../../../component/pagination';

const page = new Pagination('#page', { totalPages: 20 });
const page2 = new Pagination('#page-2', { totalPages: 20 });

page.render();
page2.render();
