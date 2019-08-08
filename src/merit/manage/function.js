/**
 * Created by kang on 2017/11/8.
 */

define([
  'jquery',
  'common/function',
  './data',
  './api',
  './tpl',
  '../../../old-com/pagination/src',
  'common/variables',
  './ajax',
  'bootstrap-select',
], function($, commonFunc, Data, api, tpl, Pagination, commonVars) {
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
    // 保证存在一个默认分组
    api.getTag({}, function(res) {
      if (!res.data.length) {
        api.updateTag({ tagId: 0, tagName: '默认分组' }, function(res) {});
      }
    });
  };

  // 渲染列表数据
  func.renderAllTbody = function(res) {
    // 渲染数据
    var $ctnr = $('#all-ctnr'),
      $selectNum = $ctnr.find('[data-ele="select-num"]'),
      $table = $('#all-table'),
      $tbody = $('#all-tbody'),
      $pagination = $ctnr.find('[data-ele="pagination-ctnr"]'),
      $selectAll = $table.find('[data-ele="select-all"]'),
      htmlStr = '';
    // 初始化
    $selectNum.html(0);
    $selectAll.prop('checked', false);
    // 重绘表格
    res.data.map(function(item) {
      htmlStr += tpl.tableCell.render(item);
    });
    !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
    $tbody.html(htmlStr);
    //生成分页器
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
  // 渲染标签列表
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
        // 传入了tagId则选中对应的tag
        $activeTag = $('[data-ele="tag-list"][data-id="' + tagId + '"]');
        activeTagId = tagId;
      } else {
        // 无则选中第一个
        $activeTag = $tagLists.eq(0);
        activeTagId = parseInt($activeTag.attr('data-id'));
      }
      $activeTag.addClass('active');
      $curTagName.html(handleData[activeTagId].name).show();
    } else {
      $curTagName.hide();
    }
  };
  // 渲染添加到关注分组modal的下拉
  func.renderTagSelect = function(handleData) {
    var $select = $('[data-ele="tag-select"]'),
      htmlStr = '';
    Object.keys(handleData).map(function(id) {
      htmlStr += tpl.selectOption.render(handleData[id]);
    });
    $select.html(htmlStr);
    $select.selectpicker('refresh');
  };
  // 渲染标签容器相关
  func.renderTagTbody = function(res) {
    // 渲染数据
    var $ctnr = $('#tag-ctnr'),
      $selectNum = $ctnr.find('[data-ele="select-num"]'),
      $table = $('#tag-table'),
      $tbody = $('#tag-tbody'),
      $pagination = $ctnr.find('[data-ele="pagination-ctnr"]'),
      $selectAll = $table.find('[data-ele="select-all"]'),
      htmlStr = '';
    // 初始化
    $selectNum.html(0);
    $selectAll.prop('checked', false);
    // 重绘表格
    res.data.map(function(item) {
      htmlStr += tpl.tagTableCell.render(item);
    });
    !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
    $tbody.html(htmlStr);
    //生成分页器
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
  // 生成分页器
  func.createPagination = function(
    $pagination,
    totalCount,
    pageSize,
    currentPage,
    callback
  ) {
    // 总数传0时会生成空的分页器容器代替之前的分页器
    var totalPages = Math.ceil(totalCount / pageSize),
      pagination = new Pagination($pagination, {
        onChange: function(pageToChange) {
          // 回调中调用currentPage获取的是点击前的页数
          callback(pageToChange - 1);
        }, // 切换页码回调函数，页面以 1 开始索引
        showDesc: 1, // 是否显示左边（共多少条，每页多少条的信息）
        showGoTo: 1, // 是否显示右边跳转到某一页
        currentPage: currentPage + 1, // 初始化当前页
        totalPages: totalPages, // 总页数
        totalCount: totalCount, // 总条数
        perPage: pageSize, // 每页条数
      });
    pagination.render();
  };
  return func;
});
