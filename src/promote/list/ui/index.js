import '../../../component/nav';
import '@senntyou/shortcut.css';
import '../../../com-deprecated/pagination/index.less';
import '../../../less/common.less';
import '../../../less/bootstrap.less';
import '../../../less/pagination.less';
import '../index.less';

import Pagination from '../../../com-deprecated/pagination';

const page = new Pagination('#page', { totalPages: 20 });

page.render();

const page2 = new Pagination('#page-0-1', { totalPages: 20 });

page2.render();
