define([
  'toastr',
  './view/add_component',
  './view/common',
  './view/introduction',
  './view/figure',
  './view/swipe_list',
  './view/donate_chart',
  './view/calendar',
  './view/shortcut',
  './view/house',
  './view/save_components',
  './view/donate-box-settings',
], function(toastr) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;
});
