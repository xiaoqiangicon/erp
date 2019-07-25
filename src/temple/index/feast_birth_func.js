/**
 * Created by senntyou on 2017/2/27.
 */
define(['lunar-calendar', './data', 'common/feast_and_birth'], function(
  LunarCalendar,
  indexData,
  feastAndBirth
) {
  // 把当前的日期值赋给组件数据
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
    // 第二版本的需求, 应测试要求，pc端与微信完全保持一致
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
    // 如果今天没有佛事，并且有预告佛事，则赋值预告佛事
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
  // 准备当前这一个月的日历数据
  function getCurrentMonthCalendarData() {
    // 一个月的数据
    var oneMonthData = LunarCalendar.calendar(
      indexData.today.year,
      indexData.today.month,
      true
    );
    // 赋值
    oneMonthData.year = indexData.today.year;
    oneMonthData.month = indexData.today.month;

    // 格式化
    oneMonthData.monthData.map(function(dayItem, index) {
      formatLunarDayItem(dayItem, indexData.today.year, indexData.today.month);
      // 每项数据都要添加一个行号，用于动画
      dayItem.rowIndex = Math.floor(index / 7);
    });

    return oneMonthData.monthData;
  }
  // 格式化阴历数据
  function formatLunarDayItem(dayItem, currentYear, currentMonth) {
    // 把阴历月份恢复到正常值
    !!dayItem.lunarLeapMonth && dayItem.lunarMonth > dayItem.lunarLeapMonth
      ? ((dayItem.lunarMonth -= 1),
        (dayItem.isLunarLeapMonth =
          dayItem.lunarMonth == dayItem.lunarLeapMonth))
      : (dayItem.isLunarLeapMonth = !1);

    // 斋日
    dayItem.feastDay = getFeastDay(
      dayItem.lunarMonth,
      dayItem.lunarDay,
      dayItem.isBigMonth
    );
    // 圣诞日
    dayItem.birthDay = getBirthDay(
      dayItem.lunarMonth,
      dayItem.lunarDay,
      dayItem.isLunarLeapMonth
    );
    // 是否处于当前月
    dayItem.inCurrentMonth = dayItem.month == currentMonth;
    // 是否是当天
    dayItem.isCurrentDay =
      dayItem.day == indexData.today.day &&
      dayItem.month == indexData.today.month &&
      dayItem.year == indexData.today.year;
  }
  // 获取斋日
  function getFeastDay(lunarMonth, lunarDay, isBigMonth) {
    var result = [];
    // 十斋日

    isBigMonth
      ? feastAndBirth.tenDay[lunarDay] && result.push('十斋日')
      : feastAndBirth.tenDayOfSmall[lunarDay] && result.push('十斋日');

    // 六斋日
    isBigMonth
      ? feastAndBirth.sixDay[lunarDay] && result.push('六斋日')
      : feastAndBirth.sixDayOfSmall[lunarDay] && result.push('六斋日');

    // 朔望斋
    feastAndBirth.shuoWangDay[lunarDay] && result.push('朔望斋');

    // 观音斋
    feastAndBirth.guanYinDay[lunarMonth + '/' + lunarDay] &&
      result.push('观音斋');

    return result.join(' ');
  }

  // 获取圣诞日
  function getBirthDay(lunarMonth, lunarDay, isLunarLeapMonth) {
    var result = [];

    if (isLunarLeapMonth) {
      return '';
    }
    // 观音斋
    feastAndBirth.birthDays[lunarMonth + '/' + lunarDay] &&
      result.push(feastAndBirth.birthDays[lunarMonth + '/' + lunarDay]);

    return result.join(' ');
  }

  return {
    assignCurrentDateToComponent: assignCurrentDateToComponent,
    getCurrentMonthCalendarData: getCurrentMonthCalendarData,
    formatLunarDayItem: formatLunarDayItem,
    getFeastDay: getFeastDay,
    getBirthDay: getBirthDay,
  };
});
