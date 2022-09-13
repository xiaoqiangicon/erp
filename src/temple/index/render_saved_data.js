import seeAjax from 'see-ajax';
import JsonRefactor from 'json-refactor';
import $ from 'jquery';
import clone from 'clone';
import cookie from 'js-cookie';
import indexData from './data';
import indexFeastBirthFunc from './feast_birth_func';
import sample from './components_sample';
import savedDataRefactorMap from './saved_data_refactor_map';
import commonTpl from './tpl/common';
import tpls from './components_templates';
import share from './share';
import postHandleForIntroduction from './render_saved_data/introduction';
import postHandleForPersonSaying from './render_saved_data/person_saying';
import postHandleForSwipeList from './render_saved_data/swipe_list';
import postHandleForDonateChart from './render_saved_data/donate_chart';
import postHandleForCalendar from './render_saved_data/calendar';
import postHandleForShortcut from './render_saved_data/shortcut';
import postHandleForHouse from './render_saved_data/house';
import 'jquery-confirm';

let isStaff = cookie.get('is_staff') === 'False';
let pwMeritRank = parseInt(cookie.get('pw_merit_rank'), 10);
function renderSavedData(res) {
  function renderComponent(data) {
    if (data.type === 4 && !pwMeritRank) return;
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
    var currentComponentId = data.id;
    indexData.misc.componentCount[type + ''] <= currentComponentId &&
      (indexData.misc.componentCount[type + ''] = currentComponentId + 1);
    initializeComponentData.id = currentComponentId;
    initializeComponentData.isUpdate = 1;
    initializeComponentData.sortId = data.sortId;
    initializeComponentData.isStaff = isStaff;
    if (type === 2) {
      initializeComponentData.id = 1;
      currentComponentId = 1;
      initializeComponentData.components = data.components;
      initializeComponentData.subType = data.subType;
      share.figureComponent = data;
    } else if (type === 5) {
      initializeComponentData.monthData = indexFeastBirthFunc.getCurrentMonthCalendarData();
      initializeComponentData.dayItems = data.dayItems;
      indexFeastBirthFunc.assignCurrentDateToComponent(initializeComponentData);
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
    $displayComponent = $(
      tpls[type - 1].display.render(initializeComponentData)
    );
    $displayContainer.append($displayComponent);
    var editRenderData = {
      id: currentComponentId,
      fileMark: seeAjax.getEnv() === 2 ? 'files[]' : 'file',
      isUpdate: 1,
      sortId: data.sortId,
    };
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
    postHandle($displayComponent, $editComponent, data);
  }
  function postHandle($displayComponent, $editContainer, data) {
    switch (data.type) {
      case 1:
        postHandleForIntroduction($displayComponent, $editContainer, data);
        break;
      case 2:
        postHandleForPersonSaying($displayComponent, $editContainer, data);
        break;
      case 3:
        postHandleForSwipeList($displayComponent, $editContainer, data);
        break;
      case 4:
        postHandleForDonateChart($displayComponent, $editContainer, data);
        break;
      case 5:
        postHandleForCalendar($displayComponent, $editContainer, data);
        break;
      case 6:
        postHandleForShortcut($displayComponent, $editContainer, data);
        break;
      case 7:
        postHandleForHouse($displayComponent, $editContainer, data);
        break;
      default:
        break;
    }
  }
  res.data.map(function(item) {
    var i, il;
    if (seeAjax.getEnv() !== 2) {
      JsonRefactor(item, savedDataRefactorMap[item.type - 1] || {});
      if (item.type === 1) {
        !!item.images &&
          !!item.images.length &&
          item.images.map(function(cell) {
            cell.url.indexOf('?') < 0 &&
              (cell.url += indexData.imagesParams[1]);
          });
      } else if (item.type === 2) {
        item.subType = 1;
        if (item.components && item.components.length) {
          item.subType = item.components[0].showType || 1;
          item.components.forEach(function(com) {
            !!com.avatar &&
              com.avatar.indexOf('?') < 0 &&
              (com.avatar += indexData.imagesParams[2]);
          });
        } else {
          item.components = [];
        }
      } else if (item.type === 3) {
        !!item.images &&
          !!item.images.length &&
          item.images.map(function(cell) {
            cell.url.indexOf('?') < 0 &&
              (cell.url += indexData.imagesParams[3][2]);
          });
      } else if (item.type === 5) {
        item.totalPages = Math.ceil(item.totalPages / 5);
        item.currentPage =
          item.pageNumber < 0 ? item.totalPages : item.pageNumber;
        indexData.misc.calendarSelectedBuddhist.totalPages = item.totalPages;
        item.dayItems = [];
        item.message.map(function(dateItem) {
          if (!dateItem.events || !dateItem.events.length) return;
          var dateArray = dateItem.date.split('-'),
            data = {
              year: parseInt(dateArray[0]),
              month: parseInt(dateArray[1]),
              day: parseInt(dateArray[2]),
              activities: [],
            };
          dateItem.events.map(function(activity) {
            var isBuddhist = !!activity.commodityId;
            var activityData = {
              id: activity.id,
              title: isBuddhist ? activity.commodityName : activity.title,
              type: isBuddhist ? 1 : 2,
              image: isBuddhist ? activity.commodityPic : '',
            };
            data.activities.push(activityData);
          });
          item.dayItems.push(data);
        });
      } else if (item.type === 7) {
        item.subType = 1;
        item.title = '殿堂场景';
        if (item.houses && item.houses.length) {
          item.subType = item.houses[0].showType || 1;
          item.title = item.houses[0].moduleName || '殿堂场景';
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
export default renderSavedData;
