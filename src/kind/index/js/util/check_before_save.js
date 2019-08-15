import $ from 'jquery';
import dialog from 'util/dialog';

export default _ => {
  const result = {
    success: !0,
    data: {},
  };

  // 获取进展内容
  const content = $('.type-content')
    .val()
    .trim();
  if (0) {
    dialog('善行内容不能为空');
    return result;
  }
  result.data.content = content;

  // 获取图片
  const $coverContainer = $('#cover-container');
  const $coverImg = $coverContainer.find('[data-cover-item-image]');
  const coverImg = [];
  $coverImg.map(function() {
    coverImg.push($(this).attr('src'));
  });

  result.data.img = coverImg;

  // 获取视频
  const $coverVideo = $coverContainer.find('[data-cover-item-video]');
  const coverVideo = [];
  $coverVideo.map(function() {
    coverVideo.push($(this).attr('src'));
  });
  result.data.video = coverVideo;

  // 获取是否推送
  result.data.isPush = $('.set-push')
    .find('.push-select-active')
    .attr('data-push');

  console.log(result);
  return result;
};
