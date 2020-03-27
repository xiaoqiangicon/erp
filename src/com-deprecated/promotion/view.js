import seeView from 'see-view';
import $ from 'jquery';
import Canvas2Image from '@senntyou/canvas2image';
import '../../../../pro-com/src/libs-es5/jquery-qrcode';
let $body = $('body');
import data from './data';
import tpl from './tpl/post';
seeView({
  events: {
    'click [data-zzh-promotion-close]': 'onClickClose',
    'click [data-zzh-promotion-tab-2]': 'onClickTab2',
    'click #zzh-promotion-save-qr-code': 'onClickSaveQrCode',
    'click [data-zzh-promotion-tab-1]': 'onClickTab1',
    'click #zzh-promotion-post-wx': 'onClickPostWx',
    'click #zzh-promotion-post-qrcode': 'onClickPostQrcode',
    'click #zzh-promotion-post-load': 'onClickPostLoad',
    'propertychange #zzh-promotion-post-input': 'onInputPostInput',
    'input #zzh-promotion-post-input': 'onInputPostInput',
  },
  onClickClose: function(e) {
    if (e.target === e.currentTarget) {
      let $this = $(e.target);
      if ($this.hasClass('zzh-promotion')) $this.remove();
      else $this.parents('.zzh-promotion').remove();
      data.onClose && data.onClose();
    }
  },
  onClickTab2: function(e) {
    let $this = $(e.target),
      type = parseInt($this.attr('data-zzh-promotion-tab-2')),
      $qrcodeContainer = $('#zzh-promotion-qrcode-container');
    let $tabContainer = $('#zzh-promotion-tab-2-container');
    if ($this.hasClass('active')) return;
    $('[data-zzh-promotion-tab-2]').removeClass('active');
    $this.addClass('active');
    $qrcodeContainer.html('');
    $qrcodeContainer.qrcode({
      width: data.sizes[type - 1],
      height: data.sizes[type - 1],
      text: data.link,
    });
    if (type === 2) $tabContainer.addClass('second');
    else $tabContainer.removeClass('second');
  },
  onClickSaveQrCode: e => {
    let canvas = $('#zzh-promotion-qrcode-container').find('canvas')[0];
    Canvas2Image.saveAsPNG(canvas);
  },
  onClickTab1: function(e) {
    let $this = $(e.currentTarget);
    let tab = parseInt($this.attr('data-zzh-promotion-tab-1'));
    if ($this.hasClass('active')) return;
    $('[data-zzh-promotion-tab-1]').removeClass('active');
    $('[data-zzh-promotion-tab-1-content]').addClass('dp-none');
    $(`[data-zzh-promotion-tab-1="${tab}"]`).addClass('active');
    $(`[data-zzh-promotion-tab-1-content="${tab}"]`).removeClass('dp-none');
  },
  onClickPostWx: e => {
    $body.append(tpl);
    $('#zzh-promotion-qrcode-container-2').qrcode({
      width: data.sizes[0],
      height: data.sizes[0],
      text: data.option.postWxUrl,
    });
  },
  onClickPostQrcode: e => {
    $('#zzh-promotion-post-qrcode').remove();
  },
  onClickPostLoad: e => {
    let $input = $('#zzh-promotion-post-input');
    let title = $input.val().trim();
    data.option.loadPost((postImageUrl, postWxUrl) => {
      postImageUrl && (data.option.postImageUrl = postImageUrl);
      postWxUrl && (data.option.postWxUrl = postWxUrl);
      $('#zzh-promotion-post-image').attr({
        src: data.option.postImageUrl,
      });
      $('#zzh-promotion-post-save').attr({
        href: data.option.postImageUrl,
      });
      $('#zzh-promotion-display-3-left-2').addClass('dp-none');
      $('#zzh-promotion-display-3-right-2').addClass('dp-none');
      $('#zzh-promotion-display-3-left-1').removeClass('dp-none');
      $('#zzh-promotion-display-3-right-1').removeClass('dp-none');
    }, title);
  },
  onInputPostInput: e => {
    let $this = $(e.target);
    $('#zzh-promotion-post-input-count').text($this.val().length);
  },
});
