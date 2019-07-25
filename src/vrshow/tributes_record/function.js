/**
 * Created by kang on 2017/10/25.
 */

define([
  'jquery',
  'common/function',
  './tpl',
  './data',
  '@zzh/pagination',
  './ajax',
], function($, commonFunc, tpl, data, Pagination) {
  var func = {};
  func.init = function() {
    $('#loading-toast').addClass('hide');
    //日期初始化
    $('.input-daterange').datepicker({
      keyboardNavigation: false,
      language: 'zh-CN',
      todayHighlight: true,
      forceParse: false,
      autoclose: true,
      clearBtn: false,
      format: 'yyyy-mm-dd',
      pickerPosition: 'bottom-left',
    });
    $('.input-daterange input').each(function() {
      $(this).datepicker('clearDates');
    });
    func.getCash(data.getCashParams, function(res) {
      func.renderCash(res);
    });
    func.getList(data.getListParams, function(res) {
      func.renderList(res);
    });
  };
  // 获取善款
  func.getCash = function(params, callback) {
    $.seeAjax.get('getCash', params, function(res) {
      if (res.success) {
        data.getCashRes = res;
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 渲染善款
  func.renderCash = function(res) {
    $('#total-cash').html(res.total);
    $('#month-cash').html(res.month);
    $('#day-cash').html(res.day);
  };
  // 获取列表
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
  // 渲染列表
  func.renderList = function(res) {
    var $container = $('#watchword-list-container'),
      htmlStr = '';
    res.data.map(function(item) {
      htmlStr += tpl.tableCell.render(item);
    });
    !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
    $container.html(htmlStr);
    func.createPagination(res);
    // if(res.total){ // 老版接口不存在total则不需要分页器
    //     func.createPagination(res.total,data.currentPage)
    // }else{
    //     $('#pagination-container').html('');
    // }
  };
  // 调用分页器,暂时使用下一页代替，带后台更新接口后替换
  func.createPagination = function(res) {
    var $prevPage = $('#prevPage'),
      $nextPage = $('#nextPage');
    if (data.getListParams.pageNum === 0) {
      $prevPage.addClass('hide');
    } else {
      $prevPage.removeClass('hide');
    }
    if (res.pageNumber !== -1) {
      $nextPage.removeClass('hide');
    } else {
      $nextPage.addClass('hide');
    }
  };

  // func.createPagination = function(totalCount,currentPage) { // 总数传0时会生成空的分页器容器代替之前的分页器
  //     var pageSize = 25,
  //         totalPages = Math.ceil(totalCount/pageSize),
  //         pagination = new Pagination($('#pagination-container'), {
  //             onChange: function(pageToChange){  // 回调中调用currentPage获取的是点击前的页数
  //                 data.getListParams.pageNum = pageToChange - 1;
  //                 func.getList(data.getListParams,function(res){
  //                     func.renderList(res);
  //                 });
  //             }, // 切换页码回调函数，页面以 1 开始索引
  //             showDesc: !1, // 是否显示左边（共多少条，每页多少条的信息）
  //             showGoTo: !1, // 是否显示右边跳转到某一页
  //             currentPage: currentPage + 1, // 初始化当前页
  //             totalPages: totalPages, // 总页数
  //             totalCount: totalCount, // 总条数
  //             perPage: pageSize // 每页条数
  //         });
  //     pagination.render();
  // };

  return func;
});
