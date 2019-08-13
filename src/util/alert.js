import $ from 'jquery';
import 'jquery-confirm';
import 'jquery-confirm/dist/jquery-confirm.min.css';
export default (content, callback) => {
  $.alert({
    title: !1,
    content: content || '未知错误，请重新尝试',
    buttons: {
      ok: {
        text: '确定',
        action: () => {
          if (callback) callback();
        },
      },
    },
    theme: 'white',
  });
};
