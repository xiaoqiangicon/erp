/**
 * Created by senntyou on 2017/7/18.
 */

define([
  'jquery',
  'common/variables',
  './data',
  './function',
  './ajax',
  './view',
], function($, commonVars, data, func) {
  $.ajaxSetup({ cache: !1 });

  func.requestAds();

  $('#machine-name').text(decodeURIComponent(commonVars.params.name));
});
