import seeAjax from 'see-ajax';
import $ from 'jquery';
import cookie from 'js-cookie';
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

let isStaff = cookie.get('is_staff') === 'False';
let pwMeritRank = parseInt(cookie.get('pw_merit_rank'), 10);
if (isStaff) {
  $('#design-add').removeClass('hide');
}
if (pwMeritRank) {
  $('#temple-set').removeClass('hide');
} else {
  // sample.components = sample.components.filter(item => {
  //   return item.type !== 4;
  // });
}
commonFunc.addCloseWindowHint();
$('#components-container').html(commonTpl.addComponent.render(sample));
$('#components-edit-container').html(commonTpl.addComponent2.render(sample));
$('[data-type=4]')
  .parent()
  .addClass('hide');
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
seeAjax('buddhistTypes', {}, function(res) {
  res.success
    ? ((indexData.misc.buddhistTypes = res.data), handleAfterLoadTypes())
    : !!res.message && console.error('获取项目列表失败：' + res.message);
});
seeAjax('articleTypes', {}, function(res) {
  res.success
    ? ((indexData.misc.articleTypes = res.data), handleAfterLoadTypes())
    : !!res.message && console.error('获取文章列表失败：' + res.message);
});
seeAjax('appTypes', {}, function(res) {
  res.success
    ? (indexData.misc.appTypes = res.data)
    : !!res.message && console.error('获取应用列表失败：' + res.message);
});
function handleAfterLoadTypes() {
  typesLoadedCount += 1;
  if (typesLoadedCount < 2) return;
  seeAjax('savedData', {}, function(res) {
    res.success &&
      (renderSavedData(res),
      isStaff && !!res.data && !!res.data.length && $('#fixed-bottom').show());
    $('#loading-toast')
      .hide()
      .removeClass('unloaded');
  });
}
