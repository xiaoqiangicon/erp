import $ from 'jquery';
import '../ajax';
import commonTpl from 'common/tpl';
import seeAjax from 'see-ajax';
import data from '../data';
import listTpl from '../tpl/main/detail/record';

import mainTpl from '../tpl/main';

$('body').append(mainTpl);

$('.main-content').hide();

seeAjax('scheduleList', {}, res => {
  data.scheduleList = res.data;
  data.list = data.scheduleList.list;

  console.log(data.scheduleList);
  $('.record-content').html(listTpl(data.scheduleList));

  // 初始化

  // 监听输入事件，实时显示字数
  $('.type-content').on('input', () => {
    if ($('.type-content').val().length >= 300) {
      $('.type-content').val(
        $('.type-content')
          .val()
          .slice(0, 300)
      );
    }

    $('[data-text-count-show]').text($('.type-content').val().length);
  });

  // 发布记录的实时显示字数
  $('.record-type-content').on('input', () => {
    if ($('.record-type-content').val().length >= 300) {
      $('.record-type-content').val(
        $('.record-type-content')
          .val()
          .slice(0, 300)
      );
    }

    $('[record-data-text-count-show]').text(
      $('.record-type-content').val().length
    );
  });

  // 初始化未编辑状态
  $('.record-operate').hide();
  // $('.record-item-main').hide();
  $('.record-item-edit').hide();

  // 点击编辑
  $('.record-edit').each(i => {
    $('.record-edit')
      .eq(i)
      .click(() => {
        $('.record-edit')
          .eq(i)
          .hide();
        $('.record-operate')
          .eq(i)
          .show();

        $('.record-item-main').show();
        $('.record-item-main')
          .eq(i)
          .hide();
        $('.record-item-edit').hide();
        $('.record-item-edit')
          .eq(i)
          .show();

        $('.record-type-content')
          .eq(i)
          .focus();
      });
  });

  // 取消编辑
  $('.record-cancel').click(() => {
    $('.record-edit').show();
    $('.record-operate').hide();

    $('.record-item-main').show();
    $('.record-item-edit').hide();
  });
});

// requestList();
