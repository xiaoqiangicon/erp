import seeAjax from 'see-ajax';
import $ from 'jquery';
import _ from 'underscore';
import commonTpl from 'common/tpl';
import Pagination from 'com-deprecated/pagination';
import tpl from './tpl';
import data from './data';
import { urlParams } from '../../../pro-com/src/utils';
import * as orchids from 'orchids';
import './ajax';
var func = {};
var pagination;
var $contentBody = $('#content-body');
var $paginationContainer = $('#pagination-container');
func.init = function() {
  func.requestList();
};
func.requestList = function(page, init) {
  !page && (page = 1);
  typeof init == 'undefined' && (init = !0);
  $contentBody.html(commonTpl.loading);
  init && $paginationContainer.html('');
  var params = _.clone(data.filter);
  params.page = page;
  seeAjax('list', params, function(res) {
    if (res.success && res.data.length) {
      func.renderList(res.data);
      if (urlParams.id) {
        orchids.startPage(
          'detail',
          {
            id: urlParams.id,
          },
          {
            beforeAppInitialized: !0,
          }
        );
      }
      if (urlParams.cashTakeLoading) {
        orchids.startPage(
          'detail',
          {
            id: res.data[0].id,
          },
          {
            beforeAppInitialized: !0,
          }
        );
      }
      init && func.initPagination(res.totalPages);
    } else {
      $contentBody.html(commonTpl.noData);
    }
  });
};
func.renderList = function(items) {
  $contentBody.html('');
  items.map(function(item) {
    data.listItems[item.id] = item;
    $contentBody.append(tpl.unit.render(item));
  });
};
func.initPagination = function(totalPages) {
  pagination = new Pagination('#pagination-container', {
    totalPages: totalPages,
    onChange: function(page) {
      func.requestList(page, !1);
      pagination.render();
    },
  });
  pagination.render();
};
export default func;
