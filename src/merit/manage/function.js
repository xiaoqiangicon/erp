import $ from 'jquery';
import commonFunc from 'common/function';
import Data from './data';
import api from './api';
import tpl from './tpl';
import Pagination from '../../../old-com/pagination/src';
import commonVars from 'common/variables';
import './ajax';
import 'bootstrap-select';
var func = {};
func.init = function() {
  $('#loading-toast').addClass('hide');
  $('#filter-select')
    .val(1)
    .selectpicker('refresh');
  api.getList(Data.getListParams, function(res) {
    $('#all-merit-num').html(res.total);
    $('#follow-num').html(res.members || 0);
    func.renderAllTbody(Data.getListRes);
  });
  api.getTag({}, function(res) {
    if (!res.data.length) {
      api.updateTag(
        {
          tagId: 0,
          tagName: '默认分组',
        },
        function(res) {}
      );
    }
  });
};
func.renderAllTbody = function(res) {
  var $ctnr = $('#all-ctnr'),
    $selectNum = $ctnr.find('[data-ele="select-num"]'),
    $table = $('#all-table'),
    $tbody = $('#all-tbody'),
    $pagination = $ctnr.find('[data-ele="pagination-ctnr"]'),
    $selectAll = $table.find('[data-ele="select-all"]'),
    htmlStr = '';
  $selectNum.html(0);
  $selectAll.prop('checked', false);
  res.data.map(function(item) {
    htmlStr += tpl.tableCell.render(item);
  });
  !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
  $tbody.html(htmlStr);
  if (res.total > Data.getListParams.pageSize) {
    func.createPagination(
      $pagination,
      res.total,
      Data.getListParams.pageSize,
      Data.getListParams.page,
      function(page) {
        Data.getListParams.page = page;
        api.getList(Data.getListParams, function(res) {
          func.renderAllTbody(res);
        });
      }
    );
  } else {
    $pagination.html('');
  }
};
func.renderTagList = function(handleData, tagId) {
  var $ctnr = $('#list-ctnr'),
    $curTagName = $('[data-ele="cur-tag-name"]'),
    $activeTag,
    activeTagId,
    htmlStr = '';
  Object.keys(handleData).map(function(id) {
    htmlStr += tpl.tagList.render(handleData[id]);
  });
  !htmlStr && (htmlStr = tpl.noTagList.render({}));
  $ctnr.html(htmlStr);
  var $tagLists = $('[data-ele="tag-list"]');
  if ($tagLists.length) {
    if (typeof tagId !== 'undefined') {
      $activeTag = $('[data-ele="tag-list"][data-id="' + tagId + '"]');
      activeTagId = tagId;
    } else {
      $activeTag = $tagLists.eq(0);
      activeTagId = parseInt($activeTag.attr('data-id'));
    }
    $activeTag.addClass('active');
    $curTagName.html(handleData[activeTagId].name).show();
  } else {
    $curTagName.hide();
  }
};
func.renderTagSelect = function(handleData) {
  var $select = $('[data-ele="tag-select"]'),
    htmlStr = '';
  Object.keys(handleData).map(function(id) {
    htmlStr += tpl.selectOption.render(handleData[id]);
  });
  $select.html(htmlStr);
  $select.selectpicker('refresh');
};
func.renderTagTbody = function(res) {
  var $ctnr = $('#tag-ctnr'),
    $selectNum = $ctnr.find('[data-ele="select-num"]'),
    $table = $('#tag-table'),
    $tbody = $('#tag-tbody'),
    $pagination = $ctnr.find('[data-ele="pagination-ctnr"]'),
    $selectAll = $table.find('[data-ele="select-all"]'),
    htmlStr = '';
  $selectNum.html(0);
  $selectAll.prop('checked', false);
  res.data.map(function(item) {
    htmlStr += tpl.tagTableCell.render(item);
  });
  !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
  $tbody.html(htmlStr);
  if (res.total > Data.getListParams.pageSize) {
    func.createPagination(
      $pagination,
      res.total,
      Data.getListParams.pageSize,
      Data.getListParams.page,
      function(page) {
        Data.getListParams.page = page;
        api.getList(Data.getListParams, function(res) {
          func.renderTagTbody(res);
        });
      }
    );
  } else {
    $pagination.html('');
  }
};
func.createPagination = function(
  $pagination,
  totalCount,
  pageSize,
  currentPage,
  callback
) {
  var totalPages = Math.ceil(totalCount / pageSize),
    pagination = new Pagination($pagination, {
      onChange: function(pageToChange) {
        callback(pageToChange - 1);
      },
      showDesc: 1,
      showGoTo: 1,
      currentPage: currentPage + 1,
      totalPages: totalPages,
      totalCount: totalCount,
      perPage: pageSize,
    });
  pagination.render();
};
export default func;
