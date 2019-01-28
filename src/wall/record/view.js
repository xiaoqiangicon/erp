/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'toastr',
  './view/main',
  './view/content',
  './view/create',
  './view/hover',
], function($, _, toastr) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;
});
