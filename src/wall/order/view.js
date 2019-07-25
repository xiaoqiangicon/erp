/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'toastr',
  './view/base',
  './view/main',
  './view/content',
  './view/detail',
  './view/printer',
], function(toastr) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;
});
