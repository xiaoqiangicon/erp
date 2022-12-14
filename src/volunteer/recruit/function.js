import seeAjax from 'see-ajax';
import $ from 'jquery';
import commonFunc from 'common/function';
import data from './data';
import tpl from './tpl';
import Pagination from '../../com-deprecated/pagination';
import './ajax';
var func = {};
func.init = function() {
  func.requestList(1);
};
func.requestList = function(currentPage) {
  typeof currentPage == 'undefined' && (currentPage = 1);
  seeAjax(
    'list',
    {
      page: currentPage,
    },
    function(res) {
      res.success
        ? (function() {
            func.renderList(res, currentPage);
          })()
        : res.message && commonFunc.alert(res.message);
    }
  );
};
func.renderList = function(res, currentPage) {
  var $contentContainer = $('[data-container="condition-content"]'),
    htmlString = '';
  res.data.map(function(item) {
    htmlString += tpl.articleCell.render(item);
  });
  !htmlString && (htmlString = tpl.paginationContentContainerEmpty.render({}));
  $contentContainer.html(htmlString);
  func.renderPagination(currentPage, res.total);
};
func.renderPagination = function(currentPage, totalCount) {
  var pageSize = 25;
  var totalPages = Math.ceil(totalCount / pageSize);
  var pagination = new Pagination($('#pagination-container'), {
    onChange: function(pagetoChange) {
      func.requestList(pagetoChange);
      pagination.render();
    },
    showDesc: !1,
    showGoTo: !1,
    currentPage: currentPage,
    totalPages: totalPages,
    totalCount: totalCount,
    perPage: pageSize,
  });
  pagination.render();
};
export default func;
