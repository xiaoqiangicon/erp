import $ from 'jquery';
import 'jquery-confirm';
import 'jquery-confirm/dist/jquery-confirm.min.css';
export default (title, content, confirmCallback, cancelCallback) => {
  if (typeof content === 'function') {
    cancelCallback = confirmCallback;
    confirmCallback = content;
    content = title;
    title = '';
  }
  $.confirm({
    title: title || !1,
    content,
    buttons: {
      confirm: {
        text: '确定',
        action: () => {
          if (confirmCallback) confirmCallback();
        },
      },
      cancel: {
        text: '取消',
        action: () => {
          if (cancelCallback) cancelCallback();
        },
      },
    },
  });
};
