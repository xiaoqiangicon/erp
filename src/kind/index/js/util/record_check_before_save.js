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

  // 获取图片和视频
  const $recordEditItemPic = $('.record-media').eq(i);
  const $coverImg = $recordEditItemPic.find('[data-cover-item-image]');
  const coverImg = [];
  $coverImg.each(function(i, item) {
    if (parseInt($(item).attr('data-cover-item-image'), 10)) {
      coverImg.push(`img:${$(item).attr('src')}`);
    } else {
      coverImg.push(`video:${$(item).attr('src')}`);
    }
  });

  result.data.img = coverImg; //.join(",");

  // 获取是否推送
  result.data.isPush = $('.record-set-push')
    .eq(i)
    .find('.record-push-select-active')
    .attr('record-data-push');

  console.log(result);
  return result;
};
