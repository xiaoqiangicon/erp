import 'component/nav';
import '@senntyou/shortcut.css';
import '../../../../old-com/pagination/src/index.less';
import 'less/common.less';
import 'less/bootstrap.less';
import 'less/pagination.less';
import '../index.less';

import Pagination from '../../../../old-com/pagination/src';

const page = new Pagination('#page', { totalPages: 20 });

page.render();
