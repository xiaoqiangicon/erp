/**
 * Created by senntyou on 2016/12/5.
 */
define([
  'jquery',
  './data',
  './render_saved_data',
  './tpl/common',
  './components_sample',
  'common/function',
  './util/update_sort',
  'jquery-ui/ui/widgets/sortable',
  'jquery-confirm',
  './ajax',
], function(
  $,
  indexData,
  renderSavedData,
  commonTpl,
  sample,
  commonFunc,
  updateSort
) {
  var typesLoadedCount = 0; // 佛事类别和文章类别加载计数，因为是异步的，故只能通过 外部变量实现

  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
    error: function(xhr, status, error) {
      commonFunc.dialog('网络链接错误，请稍后重试');
      $('#save-data')
        .attr({ 'data-handling': 0 })
        .text('保存');
    },
  });

  // 添加关闭页面的提示
  commonFunc.addCloseWindowHint();

  // 初始化界面
  $('#components-container').html(commonTpl.addComponent.render(sample));
  $('#components-edit-container').html(commonTpl.addComponent2.render(sample));

  /**
   * 因为如果组件多了，后端会保存超时，需要改版，要去掉排序功能。
   */
  // 展示组件启用排序
  $('#components-display-container').sortable({
    stop: function() {
      var $editContainerParent = $('#design-sidebar'),
        $activeDisplayComponent = $(
          '[data-container="component-display"].active'
        );

      if ($activeDisplayComponent.length) {
        // 更新编辑容器位置
        $editContainerParent
          .css({
            'margin-top': $activeDisplayComponent.position().top + 64,
          })
          .show();
      }

      // 保存当前组件的顺序
      updateSort();
    },
  });

  // 获取佛事类型
  $.seeAjax.get('buddhistTypes', {}, function(res) {
    res.success
      ? ((indexData.misc.buddhistTypes = res.data),
        // 加载完成后，做一些其他的操作
        handleAfterLoadTypes())
      : !!res.message && console.error('获取佛事列表失败：' + res.message);
  });

  // 获取文章类型
  $.seeAjax.get('articleTypes', {}, function(res) {
    res.success
      ? ((indexData.misc.articleTypes = res.data),
        // 加载完成后，做一些其他的操作
        handleAfterLoadTypes())
      : !!res.message && console.error('获取文章列表失败：' + res.message);
  });

  // 获取应用类型
  $.seeAjax.get('appTypes', {}, function(res) {
    res.success
      ? (indexData.misc.appTypes = res.data)
      : !!res.message && console.error('获取应用列表失败：' + res.message);
  });

  function handleAfterLoadTypes() {
    typesLoadedCount += 1;

    // 需要两种类别都加载完，才能执行以下的内容
    if (typesLoadedCount < 2) return;

    $.seeAjax.get('savedData', {}, function(res) {
      res.success &&
        (renderSavedData(res),
        // 显示推广按钮
        !!res.data && !!res.data.length && $('#fixed-bottom').show());

      // 不管有没有数据，隐藏loading
      $('#loading-toast')
        .hide()
        .removeClass('unloaded');
    });
  }
});
