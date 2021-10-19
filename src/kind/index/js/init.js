import $ from 'jquery';

import commonTpl from 'common/tpl';

import requestList from './util/request_list';

import mainTpl from './tpl/main';
import publishTpl from './tpl/main/detail';

import multipartUpload from '../../../com/multipartUpload';
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
const $uploadLoading = $('[data-ele="video-upload-loading"]');
$uploadLoading.hide();
// 发布进展上传视频
multipartUpload({
  el: '.upload-video',
  done: (url, e, data) => {
    $('[data-ele="video-upload-loading"]').remove();
    const $coverContainer = $('#cover-container');
    $coverContainer.append(
      coverVideoItemTpl({
        video: url,
      })
    );
  },
  progress: (e, data) => {
    const $coverContainer = $('#cover-container');
    $coverContainer.append($uploadLoading);
    $uploadLoading.show();
    const $progress = $('[data-ele="progress"]');
    const $progressText = $('[data-ele="progress-text"]');
    let progress = parseInt((data.loaded / data.total) * 100, 10);
    if (progress > 95) {
      progress = 95;
    }
    $progress.css({
      width: `${progress}%`,
    });
    $progressText.text(`${progress}%`);
    console.log(progress);
  },
});

requestList();
