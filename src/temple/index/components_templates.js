define([
  './tpl/introduction',
  './tpl/person_saying',
  './tpl/swipe_list',
  './tpl/donate_chart',
  './tpl/calendar',
  './tpl/shortcut',
  './tpl/house',
], function(
  introTpl,
  personTpl,
  swipeTpl,
  donateTpl,
  calendarTpl,
  shortcutTpl,
  houseTpl
) {
  var templates = [
    introTpl,
    personTpl,
    swipeTpl,
    donateTpl,
    calendarTpl,
    shortcutTpl,
    houseTpl,
  ];

  return templates;
});
