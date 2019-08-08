/**
 * Created by kang on 2017/10/23.
 */

define([
  'jquery',
  'common/function',
  './data',
  './tpl',
  '../../../old-com/pagination/src',
  './ajax',
  'bootstrap-select',
], function($, commonFunc, data, tpl, Pagination) {
  var func = {};
  func.init = function() {
    $('#loading-toast').addClass('hide');
    func.getList(data.getListParams, function(res) {
      func.renderList(res);
    });
  };

  // 请求字幕列表
  func.getList = function(params, callback) {
    $.seeAjax.get('getList', params, function(res) {
      if (res.success) {
        data.getListRes = res;
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 渲染字幕列表
  func.renderList = function(res) {
    var $container = $('#watchword-list-container'),
      htmlStr = '';
    // 渲染数据
    res.data.map(function(item) {
      htmlStr += tpl.tableCell.render(item);
    });
    !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
    $container.html(htmlStr);
    if (res.total) {
      func.createPagination(res.total, data.getListParams.pageNum);
    } else {
      $('#pagination-container').html('');
    }
  };
  // 调用分页器
  func.createPagination = function(totalCount, currentPage) {
    // 总数传0时会生成空的分页器容器代替之前的分页器
    var totalPages = Math.ceil(totalCount / data.getListParams.pageSize),
      pagination = new Pagination($('#pagination-container'), {
        onChange: function(pageToChange) {
          // 回调中调用currentPage获取的是点击前的页数
          data.getListParams.pageNum = pageToChange - 1;
          func.getList(data.getListParams, function(res) {
            func.renderList(res);
          });
        }, // 切换页码回调函数，页面以 1 开始索引
        showDesc: !1, // 是否显示左边（共多少条，每页多少条的信息）
        showGoTo: !1, // 是否显示右边跳转到某一页
        currentPage: currentPage + 1, // 初始化当前页
        totalPages: totalPages, // 总页数
        totalCount: totalCount, // 总条数
        perPage: data.getListParams.pageSize, // 每页条数
      });
    pagination.render();
  };

  // 更新字幕
  func.updateWatchword = function(params, callback) {
    $.seeAjax.post(
      'updateWatchword',
      params,
      function(res) {
        if (res.success) {
          callback && callback(res);
        } else {
          res.message && commonFunc.alert(res.message);
        }
      },
      true
    );
  };
  // 操作字幕：删除，显隐
  func.operateWatchword = function(params, callback) {
    $.seeAjax.post(
      'operateWatchword',
      params,
      function(res) {
        if (res.success) {
          callback && callback(res);
        } else {
          res.message && commonFunc.alert(res.message);
        }
      },
      true
    );
  };

  return func;
});
