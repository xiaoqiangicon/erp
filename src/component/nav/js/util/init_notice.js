import $ from 'jquery';
import tplNoticeItems from '../tpl/notice-item';
import tplNoticeItemsNull from '../tpl/notice-item-null';
import api from '../api';

// 渲染推送通知
export default () => {
  api
    .getNoticeList({
      type: 1,
      pageNumber: 1,
      pageSize: 10,
    })
    .then(res => {
      if (res.result === 0 && res.data) {
        if (res.total > 0) {
          $('#notice-unread-num>span').text(res.total);
          $('#notice-unread-num').show();
        }
        if (res.data.length) {
          $('#notice-container').html(
            tplNoticeItems({
              items: res.data,
            })
          );
        } else {
          $('#notice-container').html(tplNoticeItemsNull);
        }
      } else {
        console.log(res);
      }
    });
};
