import $ from 'jquery';
import dialog from 'util/dialog';

export default _ => {
  const result = {
    success: !0,
    data: {},
  };
  const content = $('.type-content')
    .val()
    .trim();
  if (0) {
    dialog('善行内容不能为空');
    return result;
  }
  result.data.content = content;

  result.data.isPush = $('.push-select-active').attr('data-push');

  console.log(result);
  return result;
};
