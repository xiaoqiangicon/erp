import $ from 'jquery';

import commonTpl from 'common/tpl';

import requestList from './util/request_list';

import mainTpl from './tpl/main';
import publishTpl from './tpl/main/detail';
import publish from './util/publish';

import upload from '../../../../../pro-com/src/upload';
import coverVideoItemTpl from './tpl/main/detail/cover_video_item';

const $body = $('body');

$body.append(mainTpl);
$body.append(publishTpl);

$('.publish-mask').hide();
$('.record-content').hide();

$('#list-container').html(commonTpl.loading);
$(document).click(() => {
  $('[data-more-operate]').addClass('more-hide');
});
// 发布进展上传视频
upload({
  el: '.upload-video',
  done: (url, e, data) => {
    const $coverContainer = $('#cover-container');
    $coverContainer.append(
      coverVideoItemTpl({
        video: url,
      })
    );
  },
  uploadHandle: res => {
    console.log(res);
  },
  progress: (e, data) => {
    if (data.total >= 10485676 * 50) {
      $('.fail-big').show();
      return false;
    }
  },
  uploadFail: res => {
    alert('upload failed');
  },
  type: 'file',
});

requestList();
