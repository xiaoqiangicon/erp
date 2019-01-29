/**
 * Created by senntyou on 2017/2/27.
 */

define([
  'jquery',
  'clone',
  './data',
  './feast_birth_func',
  './components_sample',
  './saved_data_refactor_map',
  './tpl/common',
  './components_templates',
  './share',
  './render_saved_data/introduction',
  './render_saved_data/person_saying',
  './render_saved_data/swipe_list',
  './render_saved_data/donate_chart',
  './render_saved_data/calendar',
  './render_saved_data/shortcut',
  './render_saved_data/house',
  'jquery-confirm',
], function(
  $,
  clone,
  indexData,
  indexFeastBirthFunc,
  sample,
  savedDataRefactorMap,
  commonTpl,
  tpls,
  share,
  postHandleForIntroduction,
  postHandleForPersonSaying,
  postHandleForSwipeList,
  postHandleForDonateChart,
  postHandleForCalendar,
  postHandleForShortcut,
  postHandleForHouse
) {
  function renderSavedData(res) {
    // 渲染组件
    function renderComponent(data) {
      var type = data.type,
        $displayContainer = $('#components-display-container'),
        $editContainer = $('#components-edit-container'),
        $editContainerParent = $('#design-sidebar'),
        $displayComponent,
        $editComponent,
        componentName = sample.components[type - 1].name,
        initializeComponentData = clone(
          sample.componentDisplaySample[componentName]
        );

      // 更新id
      var currentComponentId = data.id;
      // 更新到全局组件计数中
      indexData.misc.componentCount[type + ''] <= currentComponentId &&
        (indexData.misc.componentCount[type + ''] = currentComponentId + 1);
      initializeComponentData.id = currentComponentId;
      initializeComponentData.isUpdate = 1;
      initializeComponentData.sortId = data.sortId;

      if (type === 2) {
        // todo: temporary
        initializeComponentData.id = 1;
        currentComponentId = 1;
        initializeComponentData.components = data.components;
        initializeComponentData.subType = data.subType;

        share.figureComponent = data;
      }
      // 如果是佛历组件，准备当前这一个月的日历数据
      else if (type === 5) {
        initializeComponentData.monthData = indexFeastBirthFunc.getCurrentMonthCalendarData();
        initializeComponentData.dayItems = data.dayItems;
        indexFeastBirthFunc.assignCurrentDateToComponent(
          initializeComponentData
        );
        initializeComponentData.currentDay = indexData.today.day;
        initializeComponentData.currentMonth = indexData.today.month;
        initializeComponentData.currentWeekDay =
          indexData.weekdays[indexData.today.weekDay];
      } else if (type === 7) {
        initializeComponentData.title = data.title;
        initializeComponentData.houses = data.houses;
        initializeComponentData.subType = data.subType;

        share.houseComponent = data;
      }

      // 显示组件
      $displayComponent = $(
        tpls[type - 1].display.render(initializeComponentData)
      );
      // 添加到容器中
      $displayContainer.append($displayComponent);

      var editRenderData = {
        id: currentComponentId,
        fileMark: $.seeAjax.getEnv() === 2 ? 'files[]' : 'file',
        isUpdate: 1,
        sortId: data.sortId,
      };

      // 编辑组件
      // 图文组件单列，需要渲染佛事列表
      if (type === 2) {
        editRenderData.components = data.components;
        editRenderData.subType = data.subType;
      } else if (type === 3) {
        editRenderData.buddhistTypes = indexData.misc.buddhistTypes;
        editRenderData.articleTypes = indexData.misc.articleTypes;
      } else if (type === 5) {
        editRenderData.dayItems = data.dayItems;
      } else if (type === 7) {
        editRenderData.title = data.title;
        editRenderData.houses = data.houses;
        editRenderData.subType = data.subType;
      }

      $editComponent = $(tpls[type - 1].edit.render(editRenderData));
      $editContainer.append($editComponent);
      $editComponent.hide();
      // 编辑组件滑动到展现组件的水平同一位置

      // 添加组件之后的事件添加
      postHandle($displayComponent, $editComponent, data);
    }

    // 添加组件之后的事件添加
    function postHandle($displayComponent, $editContainer, data) {
      switch (data.type) {
        // 寺院介绍
        case 1:
          postHandleForIntroduction($displayComponent, $editContainer, data);
          break;
        // 高僧法师
        case 2:
          postHandleForPersonSaying($displayComponent, $editContainer, data);
          break;
        // 图文列表
        case 3:
          postHandleForSwipeList($displayComponent, $editContainer, data);
          break;
        // 功德榜
        case 4:
          postHandleForDonateChart($displayComponent, $editContainer, data);
          break;
        // 佛历
        case 5:
          postHandleForCalendar($displayComponent, $editContainer, data);
          break;
        // 快捷入口
        case 6:
          postHandleForShortcut($displayComponent, $editContainer, data);
          break;
        // 寺院殿堂
        case 7:
          postHandleForHouse($displayComponent, $editContainer, data);
          break;
        default:
          break;
      }
    }

    res.data.map(function(item) {
      var i, il;
      if ($.seeAjax.getEnv() !== 2) {
        JSON.refactor(item, savedDataRefactorMap[item.type - 1] || {});

        // 介绍组件
        if (item.type === 1) {
          // 格式化所有的图片
          !!item.images &&
            !!item.images.length &&
            item.images.map(function(cell) {
              cell.url.indexOf('?') < 0 &&
                (cell.url += indexData.imagesParams[1]);
            });
        }
        // 方丈说组件
        else if (item.type === 2) {
          // subType 是写在 message item 里边的
          item.subType = 1;
          if (item.components && item.components.length) {
            item.subType = item.components[0].showType || 1;

            item.components.forEach(function(com) {
              // 格式化所有的图片
              !!com.avatar &&
                com.avatar.indexOf('?') < 0 &&
                (com.avatar += indexData.imagesParams[2]);
            });
          } else {
            item.components = [];
          }
        }

        // 图文组件
        else if (item.type === 3) {
          // 格式化所有的图片
          !!item.images &&
            !!item.images.length &&
            item.images.map(function(cell) {
              cell.url.indexOf('?') < 0 &&
                (cell.url += indexData.imagesParams[3][2]);
            });
        }

        // 佛历
        else if (item.type === 5) {
          // 本来我要的是页数，但后台传给我的是条数，故在此更改
          item.totalPages = Math.ceil(item.totalPages / 5);
          // 当前页
          item.currentPage =
            item.pageNumber < 0 ? item.totalPages : item.pageNumber;
          // 把总页数保存到变量中，以后就不用返回总页数了
          indexData.misc.calendarSelectedBuddhist.totalPages = item.totalPages;
          // 活动项目
          item.dayItems = [];
          item.message.map(function(dateItem) {
            // 后台可能返回为空
            if (!dateItem.events || !dateItem.events.length) return;

            var dateArray = dateItem.date.split('-'),
              data = {
                year: parseInt(dateArray[0]),
                month: parseInt(dateArray[1]),
                day: parseInt(dateArray[2]),
                activities: [],
              };
            dateItem.events.map(function(activity) {
              var isBuddhist = !!activity.commodityId; // 是否是佛事
              //var activityData = {
              //    id:  isBuddhist? activity.commodityId : activity.id,
              //    title: isBuddhist ? activity.commodityName : activity.title,
              //    type: isBuddhist ? 1 : 2,
              //    image: isBuddhist ? activity.commodityPic : ''
              //};
              // 由于后台给的接口不一致，故在此更改
              var activityData = {
                id: activity.id, // 后台不需要佛事id，故去掉
                title: isBuddhist ? activity.commodityName : activity.title,
                type: isBuddhist ? 1 : 2, // 这个字段无用，保留无害
                image: isBuddhist ? activity.commodityPic : '',
              };
              data.activities.push(activityData);
            });

            item.dayItems.push(data);
          });
        }

        // 寺院殿堂组件
        else if (item.type === 7) {
          // subType 是写在 message.list item 里边的
          item.subType = 1;
          item.title = '寺院殿堂';

          if (item.houses && item.houses.length) {
            item.subType = item.houses[0].showType || 1;
            item.title = item.houses[0].moduleName || '寺院殿堂';

            item.houses.forEach(function(house) {
              house.covers = house.covers.split(',').map(function(cover) {
                if (cover.indexOf('?') > 0) return cover;
                if (item.subType === 1)
                  return cover + indexData.imagesParams[7][0];
                if (item.subType === 2)
                  return cover + indexData.imagesParams[7][1];
                return cover;
              });
            });
          } else {
            item.houses = [];
          }
        }
      }
      renderComponent(item);
    });
  }

  return renderSavedData;
});
