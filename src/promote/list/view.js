import $ from 'jquery';
import seeView from 'see-view';
import seeAjax from 'see-ajax';
import toastr from 'toastr';
import { addFilter, filter, requestAddList, requestList } from './util';
import dialog from '../../util/dialog';
import confirm from '../../util/confirm';
import share from './share';

const $body = $('body');

seeView({
  events: {
    // 点击切换状态
    '!click [data-filter-status]': 'clickFilterStatus',
    // 点击切换上架
    'click [data-row-status]': 'clickRowStatus',
    'click [data-row-manage]': 'clickRowManage',
    'click [data-row-delete]': 'clickRowDelete',
    // 点击添加一个新项目
    '!click #to-add': 'clickToAdd',
    '!click #add-overlay': 'hideAdd',
    '!click #add-close': 'hideAdd',
    '!keyup #add-search-input': 'keyUpAddSearchInput',
    '!click #add-search-ok': 'clickAddSearchOk',
    // 点击选择搜索结果
    'click [data-add-check]': 'clickAddCheck',
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

    if (filter.status === 1) $body.removeClass('no-status-cell');
    else $body.addClass('no-status-cell');

    requestList();
  },
  // 点击切换上架
  clickRowStatus(e) {
    const $this = $(e.currentTarget);
    const id = parseInt($this.attr('data-row-status'), 10);
    const online = $this.hasClass('active');
    const disabled = $this.hasClass('disabled');

    // 不能上架
    if (disabled) {
      dialog('还未设置分成奖励金，不可上架推广');
      return;
    }

    seeAjax('status', { id, online: online ? 0 : 1 }, res => {
      if (!res.success) {
        dialog(res.message);
        return;
      }

      const $deleteSection = $(`[data-row-delete-section="${id}"]`);

      if (online) {
        $this.removeClass('active');
        toastr.success('下架成功');
        $deleteSection.removeClass('dp-none');
      } else {
        $this.addClass('active');
        toastr.success('上架成功');
        $deleteSection.addClass('dp-none');
      }
    });
  },
  clickRowManage(e) {
    const $this = $(e.currentTarget);
    const id = parseInt($this.attr('data-row-manage'), 10);

    const item = share.items.find(i => i.id === id);

    window.sessionStorage['promote/list:item'] = JSON.stringify(item);

    setTimeout(() => {
      window.location.href = `/zzhadmin/promotionManageHtml/?id=${id}`;
    }, 200);
  },
  clickRowDelete(e) {
    const $this = $(e.currentTarget);
    const id = parseInt($this.attr('data-row-delete'), 10);

    confirm('确定删除吗', () => {
      seeAjax('delete', { id }, res => {
        if (!res.success) {
          dialog(res.message);
          return;
        }

        toastr.success('删除成功');
        requestList();
      });
    });
  },
  // 点击添加一个新项目
  clickToAdd() {
    $('#add-overlay').show();
    $('#add').show();
    requestAddList();
  },
  hideAdd() {
    $('#add-overlay').hide();
    $('#add').hide();
  },
  keyUpAddSearchInput(e) {
    if (e.keyCode === 13) this.clickAddSearchOk();
  },
  clickAddSearchOk() {
    addFilter.search = $('#add-search-input').val();

    requestAddList();
  },
  // 点击选择搜索结果
  clickAddCheck(e) {
    const $this = $(e.currentTarget);

    if ($this.hasClass('disabled')) return;

    $('[data-add-check].active').removeClass('active');

    $this.addClass('active');
  },
  // 确定添加
  clickAddOk() {
    const $check = $('[data-add-check].active');

    if (!$check.length) {
      dialog('请先选择一个项目');
      return;
    }

    const id = $check.attr('data-add-check');

    seeAjax('add', { id }, res => {
      if (!res.success) {
        dialog(res.message);
        return;
      }

      $('#add-input').val('');
      $('#add-ok').addClass('disabled');
      $('#add-hint').hide();
      $('#add-overlay').hide();
      $('#add').hide();
      requestList();
      toastr.success('添加成功');

      setTimeout(() => {
        window.location.href = `/zzhadmin/promotionManageHtml/?id=${id}`;
      }, 1000);
    });
  },
});
