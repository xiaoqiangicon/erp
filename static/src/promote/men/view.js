import $ from 'jquery';
import seeView from 'see-view';
import seeAjax from 'see-ajax';
import toastr from 'toastr';
import promotion from '@zzh/promotion';
import { manFilter, requestInfo, requestManList, requestVerifyList, verifyFilter } from './util';
import dialog from '../../util/dialog';
import confirm from '../../util/confirm';
import share from './share';

let handlingId = 0;

seeView({
  events: {
    // 切换 tab
    '!click [data-content-tab]': 'clickContentTab',
    '!click [data-verify-status]': 'clickVerifyStatus',
    '!click [data-verify-sort]': 'clickVerifySort',
    // 点击关闭弹框
    '!click [data-verify-close]': 'clickVerifyClose',
    '!click #verify-overlay': 'clickVerifyOverlay',
    // 点击通过
    'click [data-verify-row-pass]': 'clickVerifyRowPass',
    '!click #pass-ok': 'clickPassOk',
    // 点击拒绝
    'click [data-verify-row-refuse]': 'clickVerifyRowRefuse',
    '!input #refuse-input': 'changeRefuseInput',
    '!propertychange #refuse-input': 'changeRefuseInput',
    '!click #refuse-ok': 'clickRefuseOk',
    '!click [data-man-status]': 'clickManStatus',
    '!click [data-man-sort]': 'clickManSort',
    '!keyup #man-search': 'keyUpManSearch',
    '!click #man-search-ok': 'clickManSearchOk',
    // 点击禁用
    'click [data-man-row-forbid]': 'clickManRowForbid',
    '!click #forbid-ok': 'clickForbidOk',
    // 点击取消禁用
    'click [data-man-row-unforbid]': 'clickManRowUnforbid',
    // 点击招募推广人员
    '!click #to-promote': 'clickToPromote',
  },
  // 切换 tab
  clickContentTab(e) {
    const $this = $(e.target);

    if ($this.hasClass('active')) return;

    const id = $this.attr('data-content-tab');

    $('[data-content]').hide();
    $(`[data-content="${id}"]`).show();
    $('[data-content-tab].active').removeClass('active');
    $(`[data-content-tab="${id}"]`).addClass('active');
  },
  clickVerifyStatus(e) {
    const $this = $(e.target);

    verifyFilter.status = parseInt($this.attr('data-verify-status'), 10);
    $('#verify-status').text($this.text());

    requestVerifyList();
  },
  clickVerifySort(e) {
    const $this = $(e.currentTarget);
    const field = $this.attr('data-verify-sort');

    if ($this.hasClass('show-sort')) {
      $this.removeClass('show-sort');
      verifyFilter[field] = 0;
    } else {
      $this.addClass('show-sort');
      verifyFilter[field] = 1;
    }

    requestVerifyList();
  },
  // 点击关闭弹框
  clickVerifyClose(e) {
    $(e.target)
      .parent()
      .parent()
      .hide();
    $('#verify-overlay').hide();
  },
  clickVerifyOverlay() {
    $('#verify-overlay').hide();
    $('#pass').hide();
    $('#refuse').hide();
    $('#forbid').hide();
  },
  // 点击通过
  clickVerifyRowPass(e) {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-verify-row-pass'), 10);
    const item = share.verifyList.find(i => i.id === id);

    handlingId = id;
    $('#pass-name').text(item.name);
    $('#verify-overlay').show();
    $('#pass').show();
  },
  clickPassOk(e) {
    seeAjax('pass', { id: handlingId }, res => {
      if (!res.success) {
        dialog(res.message);
        return;
      }

      $(e.target)
        .parent()
        .parent()
        .hide();
      $('#verify-overlay').hide();
      toastr.success('操作成功');
      requestInfo();
      requestVerifyList();
    });
  },
  // 点击拒绝
  clickVerifyRowRefuse(e) {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-verify-row-refuse'), 10);
    const item = share.verifyList.find(i => i.id === id);

    handlingId = id;
    $('#refuse-name').text(item.name);
    $('#refuse-input').val('');
    $('#refuse-input-count').text(0);
    $('#verify-overlay').show();
    $('#refuse').show();
  },
  changeRefuseInput() {
    $('#refuse-input-count').text($('#refuse-input').val().length);
  },
  clickRefuseOk(e) {
    const reason = $('#refuse-input').val();

    if (!reason) {
      dialog('请输入拒绝的原因');
      return;
    }

    seeAjax('refuse', { id: handlingId, reason }, res => {
      if (!res.success) {
        dialog(res.message);
        return;
      }

      $(e.target)
        .parent()
        .parent()
        .hide();
      $('#verify-overlay').hide();
      toastr.success('操作成功');
      requestInfo();
      requestVerifyList();
    });
  },
  clickManStatus(e) {
    const $this = $(e.target);

    manFilter.status = parseInt($this.attr('data-man-status'), 10);
    $('#man-status').text($this.text());

    requestManList();
  },
  clickManSort(e) {
    const $this = $(e.currentTarget);
    const field = $this.attr('data-man-sort');

    if ($this.hasClass('show-sort')) {
      $this.removeClass('show-sort');
      manFilter[field] = 0;
    } else {
      $this.addClass('show-sort');
      manFilter[field] = 1;
    }

    requestManList();
  },
  keyUpManSearch(e) {
    if (e.keyCode === 13) this.clickManSearchOk();
  },
  clickManSearchOk() {
    manFilter.search = $('#man-search').val();

    requestManList();
  },
  // 点击禁用
  clickManRowForbid(e) {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-man-row-forbid'), 10);
    const item = share.manList.find(i => i.id === id);

    handlingId = id;
    $('#forbid-name').text(item.name);
    $('#verify-overlay').show();
    $('#forbid').show();
  },
  clickForbidOk(e) {
    seeAjax('forbid', { id: handlingId }, res => {
      if (!res.success) {
        dialog(res.message);
        return;
      }

      $(e.target)
        .parent()
        .parent()
        .hide();
      $('#verify-overlay').hide();
      toastr.success('操作成功');
      requestManList();
    });
  },
  // 点击取消禁用
  clickManRowUnforbid(e) {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-man-row-unforbid'), 10);

    confirm('确定取消禁用吗', () => {
      seeAjax('unforbid', { id }, res => {
        if (!res.success) {
          dialog(res.message);
          return;
        }

        toastr.success('操作成功');
        requestManList();
      });
    });
  },
  // 点击招募推广人员
  clickToPromote() {
    if (share.promoteUrl) promotion.show({ link: share.promoteUrl });
    else location.href = '/';
  },
});
