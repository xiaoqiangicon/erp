import $ from 'jquery';
import dialog from 'util/dialog';

export default i => {
  const result = {
    success: !0,
    data: {},
  };

  // 获取进展内容
  const content = $('.record-type-content')
    .eq(i)
    .val()
    .trim();
  if (0) {
    dialog('善行内容不能为空');
    return result;
  }
  result.data.content = content;

  // 获取图片
  const $recordEditItemPic = $('.record-media').eq(i);
  const $coverImg = $recordEditItemPic.find('[data-cover-item-image]');
  const coverImg = [];
  $coverImg.map(function() {
    coverImg.push($(this).attr('src'));
  });

  result.data.img = coverImg; //.join(",");

  // 获取视频
  const $recordItemVideo = $('.record-media').eq(i);
  const $coverVideo = $recordItemVideo.find('[data-cover-item-video]');
  const coverVideo = [];
  $coverVideo.map(function() {
    coverVideo.push($(this).attr('src'));
  });
  result.data.video = coverVideo; // .join(",");

  // 获取是否推送
  result.data.isPush = $('.record-set-push')
    .eq(i)
    .find('.record-push-select-active')
    .attr('record-data-push');

  console.log(result);
  return result;
};
