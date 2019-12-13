import 'bootstrap/dist/css/bootstrap.css';
import Pagination from '..';
window.pagination1 = new Pagination('#page-1', {
  totalPages: 20,
  onChange: function(page) {
    window.pagination1.render();
  },
});
window.pagination1.render();
window.pagination2 = new Pagination('#page-2', {
  totalPages: 20,
  currentPage: 7,
  showGoTo: !0,
  showDesc: !0,
  perPage: 50,
  totalCount: 999,
  onChange: function(page) {
    window.pagination2.render();
  },
});
window.pagination2.render();
