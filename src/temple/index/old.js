import $ from 'jquery';
import indexData from './data';
import renderSavedData from './render_saved_data';
import commonTpl from './tpl/common';
import sample from './components_sample';
import commonFunc from 'common/function';
import updateSort from './util/update_sort';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-confirm';
import './ajax';
var typesLoadedCount = 0;
$.ajaxSetup({
  cache: !1,
  error: function(xhr, status, error) {
    commonFunc.dialog('网络链接错误，请稍后重试');
    $('#save-data')
      .attr({
        'data-handling': 0,
      })
      .text('保存');
  },
});
commonFunc.addCloseWindowHint();
$('#components-container').html(commonTpl.addComponent.render(sample));
$('#components-edit-container').html(commonTpl.addComponent2.render(sample));
$('#components-display-container').sortable({
  stop: function() {
    var $editContainerParent = $('#design-sidebar'),
      $activeDisplayComponent = $(
        '[data-container="component-display"].active'
      );
    if ($activeDisplayComponent.length) {
      $editContainerParent
        .css({
          'margin-top': $activeDisplayComponent.position().top + 64,
        })
        .show();
    }
    updateSort();
  },
});
$.seeAjax.get('buddhistTypes', {}, function(res) {
  res.success
    ? ((indexData.misc.buddhistTypes = res.data), handleAfterLoadTypes())
    : !!res.message && console.error('获取佛事列表失败：' + res.message);
});
$.seeAjax.get('articleTypes', {}, function(res) {
  res.success
    ? ((indexData.misc.articleTypes = res.data), handleAfterLoadTypes())
    : !!res.message && console.error('获取文章列表失败：' + res.message);
});
$.seeAjax.get('appTypes', {}, function(res) {
  res.success
    ? (indexData.misc.appTypes = res.data)
    : !!res.message && console.error('获取应用列表失败：' + res.message);
});
function handleAfterLoadTypes() {
  typesLoadedCount += 1;
  if (typesLoadedCount < 2) return;
  $.seeAjax.get('savedData', {}, function(res) {
    res.success &&
      (renderSavedData(res),
      !!res.data && !!res.data.length && $('#fixed-bottom').show());
    $('#loading-toast')
      .hide()
      .removeClass('unloaded');
  });
}
