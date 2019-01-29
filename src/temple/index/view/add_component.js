/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  'clone',
  '../data',
  '../feast_birth_func',
  '../components_sample',
  '../tpl/introduction',
  '../tpl/person_saying',
  '../tpl/swipe_list',
  '../tpl/donate_chart',
  '../tpl/calendar',
  '../tpl/shortcut',
  '../tpl/house',
  '../function',
  '../share',
  './figure/util',
  './house/util',
  'lib/bootstrap-material-datetimepicker',
  'jquery-confirm',
  'lib/jquery.seeView',
  '../ajax',
], function(
  $,
  clone,
  indexData,
  indexFeastBirthFunc,
  sample,
  introTpl,
  personTpl,
  swipeTpl,
  donateTpl,
  calendarTpl,
  shortcutTpl,
  houseTpl,
  func,
  share,
  figureUtil,
  houseUtil
) {
  var tpls = [
    introTpl,
    personTpl,
    swipeTpl,
    donateTpl,
    calendarTpl,
    shortcutTpl,
    houseTpl,
  ];

  $.seeView({
    events: {
      // 点击添加组件，分插入和追加
      'click [data-action="component-add"]': 'onClickComponentAdd',
    },
    // 点击添加组件，分插入和追加
    onClickComponentAdd: function(e) {
      var self = this,
        $this = $(e.target),
        type = parseInt($this.attr('data-type').trim()),
        insert = parseInt($this.attr('data-insert').trim()),
        $activeDisplayComponent = $(
          '[data-container="component-display"].active'
        ),
        $displayContainer = $('#components-display-container'),
        $editContainer = $('#components-edit-container'),
        $editContainerParent = $('#design-sidebar'),
        $displayComponent,
        $editComponent,
        componentName = sample.components[type - 1].name,
        initializeComponentData = clone(
          sample.componentDisplaySample[componentName]
        );

      var availableInfo = self.checkComponentAvailableToAdd(type);
      if (!availableInfo.available) {
        $.alert({
          title: false,
          content: availableInfo.message,
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        return !1;
      }

      // 更新id
      var currentComponentId = indexData.misc.componentCount[type + '']++;
      initializeComponentData.id = currentComponentId;
      initializeComponentData.isUpdate = 0;
      initializeComponentData.sortId = 0;

      // 高僧供养组件
      if (type === 2) {
        share.figureComponent = {
          components: [],
        };
      }
      // 如果是佛历组件，准备当前这一个月的日历数据
      else if (type === 5) {
        initializeComponentData.monthData = indexFeastBirthFunc.getCurrentMonthCalendarData();
        indexFeastBirthFunc.assignCurrentDateToComponent(
          initializeComponentData
        );
        initializeComponentData.currentDay = indexData.today.day;
        initializeComponentData.currentMonth = indexData.today.month;
        initializeComponentData.currentWeekDay =
          indexData.weekdays[indexData.today.weekDay];
      } else if (type === 7) {
        share.houseComponent = {
          houses: [],
        };
      }

      // 显示组件
      $displayComponent = $(
        tpls[type - 1].display.render(initializeComponentData)
      );
      $displayComponent.addClass('active');
      // 插入到当前选中项的下一个
      insert && $activeDisplayComponent.length
        ? $activeDisplayComponent.removeClass('active').after($displayComponent)
        : ($displayContainer.append($displayComponent),
          $displayComponent.siblings().removeClass('active'));

      var editComponentData = {
        id: currentComponentId,
        fileMark: $.seeAjax.getEnv() === 2 ? 'files[]' : 'file',
        isUpdate: 0,
        sortId: 0,
      };

      // 编辑组件
      // 图文组件单列，需要渲染佛事列表
      if (type === 3) {
        editComponentData.buddhistTypes = indexData.misc.buddhistTypes;
        editComponentData.articleTypes = indexData.misc.articleTypes;
      } else if (type === 7) {
        editComponentData.title = '寺院殿堂';
      }

      $editComponent = $(tpls[type - 1].edit.render(editComponentData));

      $editContainer.append($editComponent);
      $editComponent.siblings().hide();
      // 编辑组件滑动到展现组件的水平同一位置
      $editContainerParent
        .css({
          'margin-top': $displayComponent.position().top + 64,
        })
        .show();

      // 添加组件之后的事件添加
      self.postHandleAfterComponentAdded(
        $editComponent,
        type,
        currentComponentId
      );
    },
    // 检查组件是否可添加
    checkComponentAvailableToAdd: function(type) {
      var messages = [
        '寺院简介组件最多只能添加一个',
        '高僧法师组件最多只能添加一个',
        '图文组件最多只能添加一个',
        '功德榜组件最多只能添加一个',
        '佛历组件最多只能添加一个',
        '',
        '寺院殿堂组件最多只能添加一个',
      ];

      switch (type) {
        // 寺院介绍
        case 1:
        //高僧法师
        case 2:
        //功德榜
        case 4:
        // 佛历
        case 5:
        // 寺院殿堂
        case 7:
          if (
            !!$(
              '[data-container="component-display"][data-type="' + type + '"]'
            ).length
          )
            return {
              available: !1,
              message: messages[type - 1],
            };
      }
      return {
        available: !0,
      };
    },
    // 添加组件之后的事件添加
    postHandleAfterComponentAdded: function($editContainer, type, id) {
      var self = this;
      switch (type) {
        // 寺院介绍
        case 1:
          self.postHandleAfterComponentAddedForIntroduction($editContainer, id);
          break;
        // 高僧法师
        case 2:
          self.postHandleAfterComponentAddedForPersonSaying($editContainer, id);
          break;
        // 图文列表
        case 3:
          self.postHandleAfterComponentAddedForSwipeList($editContainer, id);
          break;
        // 功德榜
        case 4:
          self.postHandleAfterComponentAddedForDonateChart($editContainer, id);
          break;
        // 佛历
        case 5:
          self.postHandleAfterComponentAddedForCalendar($editContainer, id);
          break;
        // 佛历
        case 6:
          self.postHandleAfterComponentAddedForShortcut($editContainer, id);
          break;
        // 寺院殿堂
        case 7:
          self.postHandleAfterComponentAddedForHouse($editContainer, id);
          break;
        default:
          break;
      }
    },
    // 添加寺院介绍组件后事件添加
    postHandleAfterComponentAddedForIntroduction: function($editContainer, id) {
      var self = this;
      // 添加地址选择器
      $editContainer.find('[data-place-picker]').distpicker();
      // 图片列表启动排序
      $editContainer.find('[data-introduction-images-container]').sortable({
        items: 'li:not([data-file-upload-container])',
        stop: function(e) {
          var $introductionWrapper = $('[data-introduction-swiper-wrapper]'),
            $imageContainers = $(
              '[data-upload-image-container][data-type="1"]'
            ),
            items = [];

          $imageContainers.map(function() {
            var $this = $(this),
              isUpdate = parseInt($this.attr('data-is-update')),
              imageId = parseInt($this.attr('data-image-id')),
              src = $this.find('img').attr('src');

            items.push({
              id: id,
              image: src,
              imageId: imageId,
              type: 1,
              isUpdate: isUpdate,
            });
          });
          $introductionWrapper.html('');
          items.map(function(item) {
            // 更换图片尺寸
            $introductionWrapper.append(introTpl.displayImageCell.render(item));
          });
        },
      });
    },
    // 添加高僧法师组件后事件添加
    postHandleAfterComponentAddedForPersonSaying: function($editContainer, id) {
      $editContainer.find('[data-edit-com-figure-body]').sortable({
        stop: function(e) {
          figureUtil.afterSortable();
        },
      });
    },
    // 添加图文列表组件后事件添加
    postHandleAfterComponentAddedForSwipeList: function($editContainer, id) {
      var swiperWrapperInnerHtmlIndex1ForBuddhist = '',
        swiperWrapperInnerHtmlIndex1ForArticle = '',
        sourceBuddhistSubCategoryData = void 0,
        sourceArticleSubCategoryData = void 0;
      // 先找到数据
      indexData.misc.buddhistTypes.map(function(item) {
        if (item.id == 0) {
          sourceBuddhistSubCategoryData = item;
          return !1;
        }
      });
      indexData.misc.articleTypes.map(function(item) {
        if (item.id == 0) {
          sourceArticleSubCategoryData = item;
          return !1;
        }
      });

      !!sourceBuddhistSubCategoryData &&
        (sourceBuddhistSubCategoryData.images.map(function(item) {
          swiperWrapperInnerHtmlIndex1ForBuddhist += swipeTpl.displayImageCellIndex1.render(
            {
              componentId: id,
              image: item.url,
              content: item.name,
              status: item.status,
              type: 1,
            }
          );
        }),
        $(
          '[data-swipe-list-swiper-wrapper="' +
            id +
            '"][data-index="1"][data-type="1"]'
        ).html(swiperWrapperInnerHtmlIndex1ForBuddhist));

      !!sourceArticleSubCategoryData &&
        (sourceArticleSubCategoryData.images.map(function(item) {
          swiperWrapperInnerHtmlIndex1ForArticle += swipeTpl.displayImageCellIndex1.render(
            {
              componentId: id,
              image: item.url,
              content: item.name,
              status: item.status,
              type: 2,
            }
          );
        }),
        $(
          '[data-swipe-list-swiper-wrapper="' +
            id +
            '"][data-index="1"][data-type="2"]'
        ).html(swiperWrapperInnerHtmlIndex1ForArticle));

      // 图片列表启动排序
      $editContainer.find('[data-swipe-list-images-container]').sortable({
        items: 'li:not([data-select-article-container])',
        stop: function(e) {
          var $this = $(e.target),
            type = parseInt($this.attr('data-type')),
            $swiperListWrapper = $(
              '[data-swipe-list-swiper-wrapper="' +
                id +
                '"]' +
                '[data-type="' +
                type +
                '"][data-index="2"]'
            ),
            $imageContainers = $(
              '[data-upload-image-container][data-type="3"][data-source-type="' +
                type +
                '"][data-component-id="' +
                id +
                '"]'
            ),
            items = [];

          var componentSubType = parseInt(
            $('[data-swipe-list-sub-type="' + id + '"]:checked').val()
          );

          $imageContainers.map(function() {
            var $this = $(this),
              imageId = parseInt($this.attr('data-upload-image-container'));

            items.push({
              componentId: id,
              imageId: imageId,
              image: $this.attr('data-image'),
              content: $this.attr('data-content'),
              status: parseInt($this.attr('data-status')),
              sourceType: type,
            });
          });
          $swiperListWrapper.html('');
          items.map(function(item) {
            // 更换图片尺寸
            (item.image =
              item.image.slice(0, item.image.indexOf('?')) +
              indexData.imagesParams[3][componentSubType - 1]),
              $swiperListWrapper.append(swipeTpl.displayImageCell.render(item));
          });

          func.reshowSwipeList(id, type, 2);
        },
      });
    },
    // 添加功德榜组件后事件添加
    postHandleAfterComponentAddedForDonateChart: function(
      $editContainer,
      id
    ) {},
    // 添加佛历组件后事件添加
    postHandleAfterComponentAddedForCalendar: function($editContainer, id) {},
    // 添加快捷入口组件后事件添加
    postHandleAfterComponentAddedForShortcut: function($editContainer, id) {
      // 图片列表启动排序
      $editContainer.find('[data-shortcut-images-container]').sortable({
        items: 'li:not([data-edit-shortcut-add])',
        stop: function(e) {
          var $shortcutBody = $('[data-display-shortcut-body="' + id + '"]'),
            $shortcutCells = $('[data-edit-shortcut-cell="' + id + '"]'),
            items = [];

          $shortcutCells.map(function() {
            var $this = $(this),
              title = $this.attr('data-title'),
              image = $this.attr('data-image'),
              link = $this.attr('data-link');

            items.push({
              title: title,
              image: image,
              link: link,
            });
          });
          $shortcutBody.html('');
          items.map(function(item) {
            // 更换图片尺寸
            $shortcutBody.append(shortcutTpl.displayCell.render(item));
          });
        },
      });
    },
    // 添加寺院殿堂组件后事件添加
    postHandleAfterComponentAddedForHouse: function($editContainer, id) {
      $editContainer.find('[data-edit-com-house-body]').sortable({
        stop: function(e) {
          houseUtil.afterSortable();
        },
      });
    },
  });
});
