import $ from 'jquery';
import seeAjax from 'see-ajax';
import '../../../../com-deprecated/pagination/index.less';
import 'less/pagination.less';
import Pagination from '../../../../com-deprecated/pagination';
import commonFunc from 'common/function';
import commonTpl from 'common/tpl';
import data from '../data';
import scrollTop from './scroll_top';
import rowsTpl from '../tpl/main/rows';
import '../ajax';

import listTpl from '../tpl/main/detail/record';
import contentTpl from '../tpl/main/detail/content';

import multipartUpload from '../../../../com/multipartUpload';

import coverVideoItemTpl from '../tpl/main/detail/cover_video_item';
import coverPicTpl from '../tpl/main/detail/cover_pic_item';

import ChooseImage from '../../../../com-deprecated/choose-image';
import * as zzhHandling from '../../../../../../pro-com/src/handling';
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
          let nextPage = 0;
          let charityId = resData.data[i].id;
          let pageNum = 0;
          let recordScheduleList = {};
          // ??????????????????
          seeAjax('scheduleList', { charityId: charityId, pageNum: 0 }, res => {
            nextPage = res.data.pageNum;
            data.scheduleList = res.data;
            recordScheduleList = res.data;
            data.list = data.scheduleList.list;
            console.log(res.data);

            $('#remain-time').text(data.scheduleList.todayNum);
            $('.update-content').html(contentTpl(data.scheduleList));
            const $uploadLoading = $('[data-ele="video-upload-loading"]');
            $uploadLoading.hide();
            $('.record-content').html(listTpl(data.scheduleList));
            $('[data-remain-time]').text(data.scheduleList.todayNum);
            $('.publish-mask').show();

            if (!data.scheduleList.list.length) {
              $('[data-no-list]').show();
            }

            // ????????????
            $('.publish-mask').on('scroll', e => {
              // console.log(recordScheduleList);
              const h =
                document.documentElement.clientHeight ||
                document.body.clientHeight;
              const scrollHeight =
                $('.publish-container').get(0).scrollHeight + 60 - h;
              const osTop = $('.publish-mask').scrollTop();

              if (
                osTop >= scrollHeight - 40 &&
                recordScheduleList.list.length
              ) {
                fetch(charityId, ++pageNum);
              }
            });

            // ????????????????????????
            multipartUpload({
              el: '.upload-video',
              done: (url, e, data) => {
                $('[data-ele="video-upload-loading"]').remove();
                const $coverContainer = $('#cover-container');
                $coverContainer.append(
                  coverVideoItemTpl({
                    video: url,
                  })
                );
              },
              progress: (e, data) => {
                const $coverContainer = $('#cover-container');
                $coverContainer.append($uploadLoading);
                $uploadLoading.show();
                const $progress = $('[data-ele="progress"]');
                const $progressText = $('[data-ele="progress-text"]');
                let progress = parseInt((data.loaded / data.total) * 100, 10);
                if (progress > 95) {
                  progress = 95;
                }
                $progress.css({
                  width: `${progress}%`,
                });
                $progressText.text(`${progress}%`);
              },
            });

            // ??????
            // ??????
            $('#save').click(e => {
              const $this = $(e.target);
              const result = checkBeforeSave();
              let editUrl;
              if ($('span[data-edit-url=0]').hasClass('link-select-active')) {
                editUrl = '';
              } else {
                editUrl = $('#edit-link-input').val();
              }
              result.data.charityId = charityId;

              if (!result.success) return;
              $this.text(`??????${0 ? '??????' : '??????'}???...`);
              zzhHandling.show();
              seeAjax(
                'updateList',
                {
                  charityId: charityId,
                  content: result.data.content,
                  img: result.data.img.join(','),
                  video: '',
                  isPush: result.data.isPush,
                  url: editUrl,
                },
                res => {
                  if (!res.success) {
                    zzhHandling.hide();
                    commonFunc.alert(res.msg || '??????????????????????????????');
                    $this.text(`??????`);
                    return;
                  }
                  zzhHandling.hide();
                  window.location.reload();
                }
              );
            });

            // ?????????
            $('.upload-fails').hide();
            // ????????????????????????/????????????
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
                  $('.type-content').val('');
                  $('[data-text-count-show="1"]').text('0');
                  $('.media').html('');
                  $('.push-select').removeClass('push-select-active');
                  $('.no-push').addClass('push-select-active');
                }
              });
            });

            // ?????????????????????
            if ($('.record-type-content').val()) {
              $('[record-data-text-count-show]').text(
                $('.record-type-content').val().length
              );
              // $('.record-type-content').val().length
              // ();
            }
            // ????????????????????????
            $('.record-operate').hide();
            $('.record-item-edit').hide();

            // ???????????????????????????????????????
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

            // ?????????????????????????????????
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

            // ????????????
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

                  // ???????????????????????????
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
                  multipartUpload({
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
                    },
                  });
                  // ????????????
                });
            });

            // ????????????
            // ?????????????????????
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

                // ???????????????????????????
                let index = i;
                $('.record-media')
                  .eq(i)
                  .html('');
                // ?????????????????????
                data.list[i].img.forEach((item, i) => {
                  if (item.type === 0)
                    $('.record-media')
                      .eq(index)
                      .append(
                        coverPicTpl({
                          image: item.src,
                        })
                      );
                  else
                    $('.record-media')
                      .eq(index)
                      .append(
                        coverVideoItemTpl({
                          video: item.src,
                        })
                      );
                });
              });
            });

            // ????????????
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

            // ??????
            $('.record-save').each((i, item) => {
              let index = i;
              $(item).click(e => {
                const result = recordCheckBeforeSave(i);
                if (!result.success) return;
                $(item).text(`??????${0 ? '??????' : '??????'}???...`);
                zzhHandling.show();
                seeAjax(
                  'updateList',
                  {
                    charityId: charityId,
                    id: data.list[index].id,
                    content: result.data.content,
                    img: result.data.img.join(','),
                    video: '',
                    isPush: result.data.isPush,
                    url: recordScheduleList.list[index].url,
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

          function fetch(charityId, pageNum) {
            if (nextPage == -1) return;
            // ??????????????????
            seeAjax(
              'scheduleList',
              { charityId: charityId, pageNum: pageNum },
              res => {
                nextPage = res.data.pageNum;
                data.scheduleList = res.data;
                data.list = data.scheduleList.list;

                $('#remain-time').text(data.scheduleList.todayNum);
                // $('.update-content').html(contentTpl(data.scheduleList));
                const $uploadLoading = $('[data-ele="video-upload-loading"]');
                $uploadLoading.hide();
                recordScheduleList.list.push(...(res.data.list || []));
                $('.record-content').html(listTpl(recordScheduleList));
                $('[data-remain-time]').text(data.scheduleList.todayNum);
                $('.publish-mask').show();
                console.log(recordScheduleList);
                // ????????????????????????
                multipartUpload({
                  el: '.upload-video',
                  done: (url, e, data) => {
                    $('[data-ele="video-upload-loading"]').remove();
                    const $coverContainer = $('#cover-container');
                    $coverContainer.append(
                      coverVideoItemTpl({
                        video: url,
                      })
                    );
                  },
                  progress: (e, data) => {
                    const $coverContainer = $('#cover-container');
                    $coverContainer.append($uploadLoading);
                    $uploadLoading.show();
                    const $progress = $('[data-ele="progress"]');
                    const $progressText = $('[data-ele="progress-text"]');
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
                  },
                });

                // ??????
                // ??????
                $('#save').click(e => {
                  const $this = $(e.target);
                  result.data.charityId = charityId;

                  if (!result.success) return;
                  $this.text(`??????${0 ? '??????' : '??????'}???...`);
                  zzhHandling.show();
                  seeAjax(
                    'updateList',
                    {
                      charityId: charityId,
                      content: result.data.content,
                      img: result.data.img.join(','),
                      video: '',
                      isPush: result.data.isPush,
                    },
                    res => {
                      if (!res.success) {
                        alert('????????????');
                        return;
                      }
                      zzhHandling.hide();
                      window.location.reload();
                    }
                  );
                });

                // ?????????
                $('.upload-fails').hide();
                // ????????????????????????/????????????
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
                      $('.type-content').val('');
                      $('[data-text-count-show="1"]').text('0');
                      $('.media').html('');
                      $('.push-select').removeClass('push-select-active');
                      $('.no-push').addClass('push-select-active');
                    }
                  });
                });

                // ?????????????????????
                if ($('.record-type-content').val()) {
                  $('[record-data-text-count-show]').text(
                    $('.record-type-content').val().length
                  );
                  // $('.record-type-content').val().length
                  // ();
                }
                // ????????????????????????
                $('.record-operate').hide();
                $('.record-item-edit').hide();

                // ???????????????????????????????????????
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

                // ?????????????????????????????????
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

                // ????????????
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

                      // ???????????????????????????
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
                      multipartUpload({
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
                        },
                      });
                      // ????????????
                    });
                });

                // ????????????
                // ?????????????????????
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

                    // ???????????????????????????
                    let index = i;
                    $('.record-media')
                      .eq(i)
                      .html('');
                    // ?????????????????????
                    recordScheduleList.list[i].img.forEach((item, i) => {
                      if (item.type === 0)
                        $('.record-media')
                          .eq(index)
                          .append(
                            coverPicTpl({
                              image: item.src,
                            })
                          );
                      else
                        $('.record-media')
                          .eq(index)
                          .append(
                            coverVideoItemTpl({
                              video: item.src,
                            })
                          );
                    });
                  });
                });

                // ????????????
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

                // ??????
                $('.record-save').each((i, item) => {
                  let index = i;
                  $(item).click(e => {
                    const result = recordCheckBeforeSave(i);
                    if (!result.success) return;
                    $(item).text(`??????${0 ? '??????' : '??????'}???...`);
                    zzhHandling.show();
                    seeAjax(
                      'updateList',
                      {
                        charityId: charityId,
                        id: recordScheduleList.list[index].id,
                        content: result.data.content,
                        img: result.data.img.join(','),
                        video: '',
                        url: recordScheduleList.list[index].url,
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
              }
            );
          }
        });
      });
    }
  );
};
export default requestList;
