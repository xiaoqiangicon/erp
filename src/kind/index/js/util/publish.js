import $ from 'jquery';
import '../ajax';
import seeAjax from 'see-ajax';
import data from '../data';
import listTpl from '../tpl/main/detail/record';

import upload from '../../../../../../pro-com/src/upload';

import coverVideoItemTpl from '../tpl/main/detail/cover_video_item';
import coverPicTpl from '../tpl/main/detail/cover_pic_item';

import '../../../../../old-com/choose-image/src/css/index.css';
import ChooseImage from '../../../../../old-com/choose-image/src';
import zzhHandling from '../../../../../old-com/handling/src';
import 'component/choose_image_config';

import recordCheckBeforeSave from '../util/record_check_before_save';

import zzhUtil from '../../../../../old-com/util/src';

let coverChoose;

// 一开始不显示发布记录
$('.update-content').hide();
// $('.record-content').hide();
// 发布进展
$('.record-content').hide();

// 渲染发布记录
seeAjax('scheduleList', { charityId: zzhUtil.urlParams.id }, res => {
  data.scheduleList = res.data;
  data.list = data.scheduleList.list;

  console.log(data.scheduleList);
  $('.record-content').html(listTpl(data.scheduleList));

  // 初始化
  $('.upload-fails').hide();
  // 首页切换发布进展/发布记录
  $('.header-item').each((i, item) => {
    $(item).click(e => {
      $(item)
        .addClass('header-item-active')
        .siblings()
        .removeClass('header-item-active');
      $('.content').hide();
      $('.content')
        .eq(i)
        .show();
      if (i == 0) {
        $('.record-cancel').click();
      } else {
        $('.type-content').val(' ');
        $('.media').html(' ');
        $('.push-select').removeClass('push-select-active');
        $('.no-push').addClass('push-select-active');
      }
    });
  });

  // 初始化内容字数
  $('[record-data-text-count-show]').text(
    $('.record-type-content').val().length
  );
  // 初始化未编辑状态
  $('.record-operate').hide();
  $('.record-item-edit').hide();

  // 监听输入事件，实时显示字数
  $('.type-content').each((i, item) => {
    $(item).on('input', () => {
      if (
        $('.type-content')
          .eq(i)
          .val().length >= 300
      ) {
        $('.type-content')
          .eq(i)
          .val(
            $('.type-content')
              .eq(i)
              .val()
              .slice(0, 300)
          );
      }

      $('[data-text-count-show]').text($('.type-content').val().length);
    });
  });

  // 发布记录的实时显示字数
  $('.record-type-content').each((i, item) => {
    $(item).on('input', () => {
      if (
        $('.record-type-content')
          .eq(i)
          .val().length >= 300
      ) {
        $('.record-type-content')
          .eq(i)
          .val(
            $('.record-type-content')
              .eq(i)
              .val()
              .slice(0, 300)
          );
      }

      $('[record-data-text-count-show]')
        .eq(i)
        .text(
          $('.record-type-content')
            .eq(i)
            .val().length
        );
    });
  });

  // 点击编辑
  $('.record-edit').each(i => {
    $('.record-edit')
      .eq(i)
      .click(e => {
        $('.record-edit')
          .eq(i)
          .hide();
        $('.record-operate')
          .eq(i)
          .show();

        let index = i;
        $('.record-cancel').each((i, item) => {
          if (index != i) {
            $(item).click();
          }
        });

        $('.record-item-main').show();
        $('.record-item-main')
          .eq(i)
          .hide();

        $('.record-item-edit')
          .eq(i)
          .show();

        $('.record-type-content')
          .eq(i)
          .focus();
      });

    let index = i;
    // 当前编辑的上传视频
    upload({
      el: $('.record-upload-video').eq(i),
      done: (url, e, data) => {
        const $recordItemVideo = $('.record-media');
        $recordItemVideo.append(
          coverVideoItemTpl({
            video: url,
          })
        );
      },
      progress: (e, data) => {
        if (data.total >= 10485676 * 50) {
          $('.fail-big').show();
          return false;
        }
      },
      uploadHandle: res => {},
      type: 'file',
    });
  });

  // 取消编辑
  // 未编辑前的数据
  // data.list
  $('.record-cancel').each((i, item) => {
    $(item).click(e => {
      $('.record-edit')
        .eq(i)
        .show();
      $('.record-operate')
        .eq(i)
        .hide();

      $('.record-item-main')
        .eq(i)
        .show();
      $('.record-item-edit')
        .eq(i)
        .hide();

      $('.record-type-content')
        .eq(i)
        .val(
          $('.record-item-content')
            .eq(i)
            .text()
            .trim()
        );
      $('[record-data-text-count-show]')
        .eq(i)
        .text(
          $('.record-type-content')
            .eq(i)
            .val().length
        );

      // 取消编辑时数据恢复
      let index = i;
      $('.record-media')
        .eq(i)
        .html('');

      data.list[i].img.forEach((url, i) => {
        $('.record-media')
          .eq(index)
          .append(
            coverPicTpl({
              image: url,
            })
          );
      });
      data.list[i].video.forEach((url, i) => {
        $('.record-media')
          .eq(index)
          .append(
            coverVideoItemTpl({
              video: url,
            })
          );
      });
    });
  });

  // 上传图片
  $('.record-upload-pic').each((i, item) => {
    $(item).click(e => {
      let index = i;

      if (!coverChoose) {
        coverChoose = new ChooseImage({
          onSubmit: items => {
            const $recordItemPic = $('.record-media').eq(index);
            items.forEach((item, index) => {
              $recordItemPic.append(
                coverPicTpl({
                  image: item.src,
                })
              );
            });
          },
        });
      }
      coverChoose.show();
    });
  });

  // 保存
  $('.record-save').each((i, item) => {
    let index = i;
    $(item).click(e => {
      const result = recordCheckBeforeSave(i);

      if (result.success) return;
      $(item).text(`正在${0 ? '更新' : '保存'}中...`);
      zzhHandling.show();
      seeAjax(
        'updateList',
        {
          charityId: zzhUtil.urlParams.id,
          id: data.list[index].id,
          content: result.data.content,
          img: result.data.img.join(','),
          video: result.data.video.join(','),
          isPush: result.data.isPush,
        },
        res => {
          if (!res.success) return;
          zzhHandling.hide();
          window.location.reload();
        }
      );
    });
  });
});
