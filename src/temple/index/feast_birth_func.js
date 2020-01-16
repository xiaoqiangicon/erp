import LunarCalendar from 'lunar-calendar';
import indexData from './data';
import feastAndBirth from 'common/feast_and_birth';
function assignCurrentDateToComponent(component) {
  component.currentLunarMonth = indexData.todayLunar.lunarMonth;
  component.currentLunarDay = indexData.todayLunar.lunarDay;
  component.currentLunarMonthName = indexData.todayLunar.lunarMonthName;
  component.currentLunarDayName = indexData.todayLunar.lunarDayName;
  component.currentFeastDay = getFeastDay(
    indexData.todayLunar.lunarMonth,
    indexData.todayLunar.lunarDay,
    indexData.todayLunar.isBigMonth
  );
  component.currentBirthDay = getBirthDay(
    indexData.todayLunar.lunarMonth,
    indexData.todayLunar.lunarDay,
    indexData.todayLunar.isLunarLeapMonth
  );
  !!component.dayItems &&
    !!component.dayItems.length &&
    component.dayItems.map(function(dayItem) {
      if (
        dayItem.year == indexData.today.year &&
        dayItem.month == indexData.today.month &&
        dayItem.day == indexData.today.day
      ) {
        component.currentHasBuddhist = !0;
        component.currentBuddhist = dayItem.activities;
        component.currentFirstBuddhistTitle =
          component.currentBuddhist[0].title;
      }
    });
  if (
    !component.currentHasBuddhist &&
    !!component.dayItems &&
    !!component.dayItems.length
  ) {
    component.latestBuddhist = {
      month: component.dayItems[0].month,
      day: component.dayItems[0].day,
      title: component.dayItems[0].activities[0].title,
    };
  }
}
function getCurrentMonthCalendarData() {
  var oneMonthData = LunarCalendar.calendar(
    indexData.today.year,
    indexData.today.month,
    true
  );
  oneMonthData.year = indexData.today.year;
  oneMonthData.month = indexData.today.month;
  oneMonthData.monthData.map(function(dayItem, index) {
    formatLunarDayItem(dayItem, indexData.today.year, indexData.today.month);
    dayItem.rowIndex = Math.floor(index / 7);
  });
  return oneMonthData.monthData;
}
function formatLunarDayItem(dayItem, currentYear, currentMonth) {
  !!dayItem.lunarLeapMonth && dayItem.lunarMonth > dayItem.lunarLeapMonth
    ? ((dayItem.lunarMonth -= 1),
      (dayItem.isLunarLeapMonth = dayItem.lunarMonth == dayItem.lunarLeapMonth))
    : (dayItem.isLunarLeapMonth = !1);
  dayItem.feastDay = getFeastDay(
    dayItem.lunarMonth,
    dayItem.lunarDay,
    dayItem.isBigMonth
  );
  dayItem.birthDay = getBirthDay(
    dayItem.lunarMonth,
    dayItem.lunarDay,
    dayItem.isLunarLeapMonth
  );
  dayItem.inCurrentMonth = dayItem.month == currentMonth;
  dayItem.isCurrentDay =
    dayItem.day == indexData.today.day &&
    dayItem.month == indexData.today.month &&
    dayItem.year == indexData.today.year;
}
function getFeastDay(lunarMonth, lunarDay, isBigMonth) {
  var result = [];
  isBigMonth
    ? feastAndBirth.tenDay[lunarDay] && result.push('十斋日')
    : feastAndBirth.tenDayOfSmall[lunarDay] && result.push('十斋日');
  isBigMonth
    ? feastAndBirth.sixDay[lunarDay] && result.push('六斋日')
    : feastAndBirth.sixDayOfSmall[lunarDay] && result.push('六斋日');
  feastAndBirth.shuoWangDay[lunarDay] && result.push('朔望斋');
  feastAndBirth.guanYinDay[lunarMonth + '/' + lunarDay] &&
    result.push('观音斋');
  return result.join(' ');
}
function getBirthDay(lunarMonth, lunarDay, isLunarLeapMonth) {
  var result = [];
  if (isLunarLeapMonth) {
    return '';
  }
  feastAndBirth.birthDays[lunarMonth + '/' + lunarDay] &&
    result.push(feastAndBirth.birthDays[lunarMonth + '/' + lunarDay]);
  return result.join(' ');
}
export default {
  assignCurrentDateToComponent: assignCurrentDateToComponent,
  getCurrentMonthCalendarData: getCurrentMonthCalendarData,
  formatLunarDayItem: formatLunarDayItem,
  getFeastDay: getFeastDay,
  getBirthDay: getBirthDay,
};
