import $ from 'jquery';
import seeAjax from 'see-ajax';
import '../../../../../old-com/pagination/src/index.less';
import 'less/pagination.less';
import Pagination from '../../../../../old-com/pagination/src';
import commonTpl from 'common/tpl';
import data from '../data';
import scrollTop from './scroll_top';
import rowsTpl from '../tpl/main/rows';
import '../ajax';

import listTpl from '../tpl/main/detail/record';

import upload from '../../../../../../pro-com/src/upload';
import { makeUploadFileOptions } from '../../../../configs/upload';

import coverVideoItemTpl from '../tpl/main/detail/cover_video_item';
import coverPicTpl from '../tpl/main/detail/cover_pic_item';

import ChooseImage from '../../../../../old-com/choose-image/src';
import zzhHandling from '../../../../../old-com/handling/src';
import recordCheckBeforeSave from '../util/record_check_before_save';
import checkBeforeSave from '../util/check_before_save';

let coverChoose;
let resData;

const requestList = (page, init) => {
  !page && (page = 1);
  typeof init === 'undefined' && (init = !0);
  const $listContainer = $('#list-container');
  const $paginationContainer = $('#pagination-container');
  $listContainer.html(commonTpl.loading);
  init && $paginationContainer.html('');
  seeAjax(
    'list',
    {
      page,
    },
    res => {
      if (!res.success || !res.data || !res.data.length) {
        $listContainer.html(commonTpl.noData);
        return;
      }
      resData = res;
      $listContainer.html(rowsTpl(res));
      if (init) {
        data.pagination = new Pagination('#pagination-container', {
          totalPages: res.totalPages,
          onChange: page => {
            requestList(page, !1);
            data.pagination.render();
          },
        });
        data.pagination.render();
      }
      scrollTop();
      $('.publish-schedule').each((i, item) => {
        $(item).click(() => {
          let charityId = resData.data[i].id;
          // 渲染发布记录
          seeAjax('scheduleList', { charityId: charityId }, res => {
            data.scheduleList = res.data;
            data.list = data.scheduleList.list;

            console.log(data.scheduleList);
            $('#remain-time').text(data.scheduleList.count);
            $('.record-content').html(listTpl(data.scheduleList));
            $('[data-remain-time]').text(data.scheduleList.count);

            if (!data.scheduleList.list.length) {
              $('[data-no-list]').show();
            }

            // 新增
            // 保存
            $('.save').click(e => {
              const $this = $(e.target);
              const result = checkBeforeSave();
              result.data.charityId = charityId;

              if (!result.success) return;
              $this.text(`正在${0 ? '更新' : '保存'}中...`);
              zzhHandling.show();
              seeAjax(
                'updateList',
                {
                  charityId: charityId,
                  content: result.data.content,
                  img: result.data.img.join(','),
                  video: result.data.video.join(','),
                  isPush: result.data.isPush,
                },
                res => {
                  if (!res.success) {
                    alert('操作失败');
                    return;
                  }
                  zzhHandling.hide();
                  window.location.reload();
                }
              );
            });

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
            if ($('.record-type-content').val()) {
              $('[record-data-text-count-show]').text(
                $('.record-type-content').val().length
              );
              // $('.record-type-content').val().length
              // ();
            }
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

                $('[data-text-count-show]').text(
                  $('.type-content').val().length
                );
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
                  console.log(i);
                  // 当前编辑的上传视频
                  const $uploadRecordLoading = $(`
                  <div class="schedule-video-upload-loading" data-record-ele="video-upload-loading">
                      <div class="progress-container">
                          <div class="progress" data-record-ele="progress"></div>
                      </div>
                      <div class="progress-text" data-record-ele="progress-text"></div>
                      <img data-record-ele="del-video-upload" class="schedule-video-del"
                          src="https://pic.zizaihome.com/b36bbb7c-a12c-11e8-9f56-00163e0c001e.png"
                          alt="">
                  </div>`);
                  // $uploadRecordLoading.hide();
                  upload(
                    makeUploadFileOptions({
                      el: $('.record-upload-video').eq(i),
                      done: (url, e, data) => {
                        $uploadRecordLoading.remove();
                        const $recordItemVideo = $('.record-media').eq(i);
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

                        const $recordItemVideo = $('.record-media').eq(i);
                        $recordItemVideo.append($uploadRecordLoading);
                        $uploadRecordLoading.show();
                        const $progress = $('[data-record-ele="progress"]');
                        const $progressText = $(
                          '[data-record-ele="progress-text"]'
                        );
                        let progress = parseInt(
                          (data.loaded / data.total) * 100,
                          10
                        );
                        if (progress > 95) {
                          progress = 95;
                        }
                        $progress.css({
                          width: `${progress}%`,
                        });
                        $progressText.text(`${progress}%`);
                        console.log(progress);
                      },
                    })
                  );
                  // 上传结束
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
                  console.log(url);
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
                if (!result.success) return;
                $(item).text(`正在${0 ? '更新' : '保存'}中...`);
                zzhHandling.show();
                seeAjax(
                  'updateList',
                  {
                    charityId: charityId,
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
            $('.publish-mask').show();
          });
        });
      });
    }
  );
};
export default requestList;
