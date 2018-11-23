import $ from 'jquery';
import seeView from 'see-view';
import seeAjax from 'see-ajax';
import toastr from 'toastr';
import { filter, requestList } from './util';
import { searchTpl } from './tpl';
import dialog from '../../util/dialog';

// 选择的搜索结果
let selectedSearchId = 0;

seeView({
  events: {
    // 点击切换状态
    '!click [data-filter-status]': 'clickFilterStatus',
    // 点击切换上架
    'click [data-row-status]': 'clickRowStatus',
    // 点击添加一个新项目
    '!click #to-add': 'clickToAdd',
    '!click #add-overlay': 'hideAdd',
    '!click #add-close': 'hideAdd',
    '!input #add-input': 'changeAddInput',
    '!propertychange #add-input': 'changeAddInput',
    // 点击选择搜索结果
    'click [data-search-row]': 'clickSearchRow',
    // 确定添加
    '!click #add-ok': 'clickAddOk',
  },
  // 点击切换状态
  clickFilterStatus(e) {
    const $this = $(e.target);

    if ($this.hasClass('active')) return;

    $('[data-filter-status].active').removeClass('active');
    $this.addClass('active');

    filter.status = parseInt($this.attr('data-filter-status'), 10);
    requestList();
  },
  // 点击切换上架
  clickRowStatus(e) {
    const $this = $(e.currentTarget);
    const id = parseInt($this.attr('data-row-status'), 10);
    const online = $this.hasClass('active');

    seeAjax('status', { id, online: online ? 0 : 1 }, res => {
      if (!res.success) {
        dialog(res.message);
        return;
      }

      if (online) {
        $this.removeClass('active');
        toastr.success('下架成功');
      } else {
        $this.addClass('active');
        toastr.success('上架成功');
      }
    });
  },
  // 点击添加一个新项目
  clickToAdd() {
    $('#add-overlay').show();
    $('#add').show();
  },
  hideAdd() {
    $('#add-overlay').hide();
    $('#add').hide();
  },
  changeAddInput(e) {
    const $this = $(e.target);
    const value = $this.val();
    const $hint = $('#add-hint');

    selectedSearchId = 0;
    $('#add-ok').addClass('disabled');

    if (!value) {
      $hint.html('');
      return;
    }

    seeAjax('search', { search: value }, res => {
      if (!res.success || !res.data || !res.data.length) $hint.html('');

      $hint.html(searchTpl(res)).show();
    });
  },
  // 点击选择搜索结果
  clickSearchRow(e) {
    const $this = $(e.currentTarget);

    if ($this.hasClass('disabled')) return;

    const id = parseInt($this.attr('data-search-row'), 10);
    const text = $this.text();

    $('#add-input').val(text);
    selectedSearchId = id;
    $('#add-ok').removeClass('disabled');
    $('#add-hint').hide();
  },
  // 确定添加
  clickAddOk(e) {
    const $this = $(e.target);

    if ($this.hasClass('disabled')) return;

    seeAjax('add', { id: selectedSearchId }, res => {
      if (!res.success) {
        dialog(res.message);
        return;
      }

      $('#add-input').val('');
      selectedSearchId = 0;
      $('#add-ok').addClass('disabled');
      $('#add-hint').hide();
      $('#add-overlay').hide();
      $('#add').hide();
      requestList();
      toastr.success('添加成功');
    });
  },
});
