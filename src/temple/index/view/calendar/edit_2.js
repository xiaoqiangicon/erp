/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  '../../data',
  '../../tpl/common',
  '../../tpl/calendar',
  'lib/bootstrap-material-datetimepicker',
  'jquery-confirm',
  'lib/jquery.seeView',
], function($, indexData, commonTpl, calendarTpl) {
  $.seeView({
    events: {
      // 点击删除佛历已添加条目
      'click [data-calendar-modify-selected-activity-delete]':
        'onClickCalendarModifySelectedActivitiesDelete',
      // 点击佛历组件编辑区域分页分页
      'click [data-calendar-page-index]': 'onClickCalendarPageIndex',
      // 佛历组件根据选定的日期请求数据
      'change [data-edit-calendar-select-date]':
        'onChangeEditCalendarSelectDate',
      // 点击删除已添加的日期单元
      'click [data-calendar-popup-date-cell-delete]':
        'onClickCalendarPopupDateCellDelete',
      // 点击设置日期为0，查看全部已添加的佛事
      'click [data-edit-calendar-query-all]': 'onClickEditCalendarQueryAll',
    },
    // 点击删除佛历已添加条目
    onClickCalendarModifySelectedActivitiesDelete: function(e) {
      var self = this,
        $this = $(e.target),
        year = $this.attr('data-year'),
        month = $this.attr('data-month'),
        day = $this.attr('data-day'),
        id = $this.attr('data-id'),
        type = $this.attr('data-type');

      $.confirm({
        title: false,
        content: '此删除操作会同步到服务器。<br>确定删除这条数据吗？',
        theme: 'white',
        buttons: {
          confirm: {
            text: '确定',
            action: function() {
              self.deleteActivityOfCalendar($this, year, month, day, id, type);
            },
          },
          cancel: {
            text: '取消',
            action: function() {},
          },
        },
      });
    },
    // 删除佛历已添加条目
    deleteActivityOfCalendar: function($this, year, month, day, id, type) {
      $this.text('正在删除...');
      $.seeAjax.post(
        'deleteActivityOfCalendar',
        {
          date:
            year +
            '-' +
            (month.length <= 1 ? '0' + month : month) +
            '-' +
            (day.length <= 1 ? '0' + day : day),
          id: id,
          //type: type
          // 根据后台的接口更改
          componentId: parseInt(
            $(
              '[data-container="component-edit"][data-type="5"][data-is-update="1"]'
            ).attr('data-id')
          ),
        },
        function(res) {
          $this.text('删除');
          if (res.success) {
            // 删除当前条目
            $this
              .parents('[data-calendar-modify-selected-activity-cell]')
              .remove();

            // 删完了，一个不剩，直接删掉编辑区域的对应的单元
            if (!$('[data-calendar-modify-selected-activity-cell]').length) {
              $(
                '[data-edit-calendar-selected-cell]' +
                  '[data-year="' +
                  year +
                  '"][data-month="' +
                  month +
                  '"][data-day="' +
                  day +
                  '"]'
              ).remove();
            } else {
              // 删掉编辑区域的对应的单元格
              $(
                '[data-edit-calendar-selected-activity-cell]' +
                  '[data-year="' +
                  year +
                  '"][data-month="' +
                  month +
                  '"][data-day="' +
                  day +
                  '"]' +
                  '[data-id="' +
                  id +
                  '"][data-type="' +
                  type +
                  '"]'
              ).remove();
              // 更新显示序列号
              $('[data-calendar-modify-selected-activity-sequence]').map(
                function(index) {
                  $(this).text(index + 1);
                }
              );
            }
          } else {
            !!res.message &&
              $.alert({
                title: false,
                content: res.message,
                buttons: { ok: { text: '确定' } },
                theme: 'white',
              });
          }
        }
      );
    },
    // 点击佛历组件编辑区域分页分页
    onClickCalendarPageIndex: function(e) {
      var self = this,
        $this = $(e.target),
        currentPage, // 当前页
        totalPages, // 总页数
        page, // 按钮指向页数
        $contentContainer, // 内容容器
        $contentParentContainer, // 内容容器父元素
        $paginationContainer, // 分页容器
        $paginationInput,
        paginationInput,
        paginationInputInt; // 跳到某一页的输入

      // 如果当前已经处于激活状态，或者禁用，返回
      if ($this.hasClass('active') || $this.hasClass('disabled')) return !1;

      currentPage = parseInt($this.attr('data-current-page'));
      totalPages = parseInt($this.attr('data-total-pages'));
      page = parseInt($this.attr('data-calendar-page-index'));

      $paginationInput = $('[data-calendar-pagination-input]');
      paginationInput = $paginationInput.val();
      $paginationInput.val('');

      if (page == -1) {
        // 上一页
        page = currentPage - 1;
      } else if (page == -2) {
        // 下一页
        page = currentPage + 1;
      } else if (page == -3) {
        // 跳到某一页
        // 没有值，直接返回
        if (!paginationInput) {
          return;
        }
        paginationInputInt = parseInt(paginationInput);
        if (
          !paginationInputInt ||
          paginationInputInt <= 0 ||
          paginationInputInt > totalPages
        ) {
          return;
        }
        page = paginationInput;
      }
      $contentContainer = $(
        '[data-edit-calendar-selected-content-inner][data-page="' +
          page +
          '"][data-date="0"]'
      );
      $paginationContainer = $('[data-edit-calendar-pagination]');
      // 先隐藏同类容器
      $('[data-edit-calendar-selected-content-inner][data-date="0"]').hide();

      var i,
        il,
        pages = [];

      // 如果已经请求过了，就直接显示
      if (!!$contentContainer.length) {
        for (i = 0; i < totalPages; i++) pages.push(i + 1);
        $contentContainer.show();
        $paginationContainer.html(
          calendarTpl.editPagination.render({
            currentPage: page,
            totalPages: totalPages,
            pages: pages,
          })
        );
      }
      // 未请求过，则请求之后渲染
      else {
        $contentParentContainer = $(
          '[data-edit-calendar-selected-content][data-date="0"]'
        );
        $contentContainer = $(
          calendarTpl.editPaginationContentOnePage.render({
            page: page,
          })
        );
        $contentContainer.appendTo($contentParentContainer);
        // 请求数据
        $.seeAjax.get(
          'activitiesOfCalendar',
          {
            page: page,
            date: '',
            componentId: parseInt(
              $this.parents('[data-container="component-edit"]').attr('data-id')
            ),
          },
          function(res) {
            res.success
              ? self.onRequestCalendarSelectedBuddhistSuccess(res)
              : res.message &&
                $.alert({
                  title: false,
                  content: res.message,
                  buttons: { ok: { text: '确定' } },
                  theme: 'white',
                });
          }
        );
      }
    },
    // 请求佛历组件的已添加的佛事完成后(无日期，有分页)
    onRequestCalendarSelectedBuddhistSuccess: function(res) {
      //res.currentPage == 1 ? (
      //        indexData.misc.calendarSelectedBuddhist.totalPages = res.totalPages
      //) : (
      //    // 总数大于1，而且是最后一个，返回的是0，纠正这个数据
      res.currentPage <= 0 &&
        (res.currentPage = indexData.misc.calendarSelectedBuddhist.totalPages);
      res.totalPages = indexData.misc.calendarSelectedBuddhist.totalPages;
      //);
      var $contentContainer = $(
          '[data-edit-calendar-selected-content-inner][data-page="' +
            (res.currentPage || 1) +
            '"][data-date="0"]'
        ),
        $paginationContainer = $('[data-edit-calendar-pagination]'),
        htmlString = '';

      htmlString += calendarTpl.editPaginationContentActivities.render(res);
      // 创建内容
      $contentContainer.html(htmlString);
      var i,
        il,
        pages = [],
        totalPages = res.totalPages;
      for (i = 0; i < totalPages; i++) pages.push(i + 1);
      // 创建分页

      $paginationContainer.html(
        calendarTpl.editPagination.render({
          currentPage: res.currentPage || 1,
          totalPages: res.totalPages,
          pages: pages,
        })
      );
    },
    // 佛历组件根据选定的日期请求数据
    onChangeEditCalendarSelectDate: function(e) {
      var self = this,
        $this = $(e.target),
        date = $this.val(),
        $contentContainer, // 内容容器
        $contentParentContainer; // 内容容器父元素

      !date && (date = 0);

      $contentContainer = $(
        '[data-edit-calendar-selected-content][data-date="' + date + '"]'
      );
      // 先隐藏同类容器
      $('[data-edit-calendar-selected-content]').hide();
      // 隐藏分页，此种情况下不会有分页
      $('[data-edit-calendar-pagination]').hide();
      // 如果已经请求过了，就直接显示
      if (!!$contentContainer.length) {
        $contentContainer.show();
      }
      // 未请求过，则请求之后渲染
      else {
        $contentParentContainer = $(
          '[data-edit-calendar-selected-content-container]'
        );
        $contentContainer = $(
          calendarTpl.editPaginationContent.render({
            date: date,
          })
        );
        $contentContainer.appendTo($contentParentContainer);
        // 请求数据
        $.seeAjax.get(
          'activitiesOfCalendar',
          {
            page: 1,
            date: date,
            componentId: parseInt(
              $this.parents('[data-container="component-edit"]').attr('data-id')
            ),
          },
          function(res) {
            res.success
              ? self.onRequestCalendarSelectedBuddhistOfSpecifiedDateSuccess(
                  res,
                  date
                )
              : res.message &&
                $.alert({
                  title: false,
                  content: res.message,
                  buttons: { ok: { text: '确定' } },
                  theme: 'white',
                });
          }
        );
      }
    },
    // 请求佛历组件的已添加的佛事完成后(有日期，无分页)
    onRequestCalendarSelectedBuddhistOfSpecifiedDateSuccess: function(
      res,
      date
    ) {
      var $contentContainer = $(
          '[data-edit-calendar-selected-content][data-date="' + date + '"]'
        ),
        htmlString = '';

      htmlString += calendarTpl.editPaginationContentActivities.render(res);
      // 创建内容
      $contentContainer.html(htmlString);
    },
    // 点击删除已添加的日期单元
    onClickCalendarPopupDateCellDelete: function(e) {
      $(e.target)
        .parent()
        .remove();
    },
    // 点击设置日期为0，查看全部已添加的佛事
    onClickEditCalendarQueryAll: function(e) {
      // 输入设置为0
      $('[data-edit-calendar-select-date]')
        .val('')
        .trigger('change');
      // 显示分页
      $('[data-edit-calendar-pagination]').show();
    },
  });
});
