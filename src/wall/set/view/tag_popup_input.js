/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'toastr',
  'common/function',
  'common/variables',
  '../data',
], function($, _, toastr, commonFunc, commonVars, data) {
  var $tagPopupInput = $('#tag-popup-input');
  var tagPopupInput = document.getElementById('tag-popup-input');
  // 用来处理中文输入时，输入框中的拼音会触发值改变事件
  // http://www.cnblogs.com/jesse007/p/5627167.html
  var compositionStart = !1;

  $tagPopupInput.on('compositionstart', function() {
    compositionStart = !0;
  });
  $tagPopupInput.on('compositionend', function() {
    compositionStart = !1;
    onInputChange();
  });

  $tagPopupInput.on('input propertychange', function() {
    if (compositionStart) return;

    onInputChange();
  });
  function onInputChange() {
    var value = $tagPopupInput.val(),
      tagsArray = value.split(' '),
      lastTag = tagsArray[tagsArray.length - 1];

    // 如果输入超过之前的数据，则表示是在加入数据
    if (value.length > data.lastTagPopupInputLength) {
      // 如果最后输入的值等于4，自动加空格
      if (lastTag.length == 4) {
        $tagPopupInput.val(value + ' ');
      }
      // 如果最后输入的值大于4，自动分隔
      else if (lastTag.length > 4) {
        // 临时存一个数组，用于存放分隔后的最后一个字符串数组
        var lastTagArray = [],
          i,
          il;
        for (i = 0, il = lastTag.length; i < il; i += 4) {
          lastTagArray.push(lastTag.slice(i, i + 4));
        }
        // 先弹出原有的最后一个
        tagsArray.pop();
        // 重新定义新的值
        value = tagsArray.join(' ') + ' ' + lastTagArray.join(' ');
        // 重新建立数组
        tagsArray = value.split(' ');
        // 重写表单中的值
        $tagPopupInput.val(
          value + (tagsArray[tagsArray.length - 1].length < 4 ? '' : ' ')
        );
      }
    }

    data.lastTagPopupInputLength = value.length;

    $('[data-tag-popup-cell]').map(function() {
      var $this = $(this);
      tagsArray.indexOf($this.attr('data-name')) > -1
        ? $this.removeClass('unselected')
        : $this.addClass('unselected');
    });

    // 输入中文的时候，光标总是不会在最后面
    // 执行函数还必须加个定时器，保证在下一轮时间循环中，才能生效
    setTimeout(function() {
      moveCursorToEnd();
    }, 0);
  }
  // 鼠标光标移到最后面
  function moveCursorToEnd() {
    var len = tagPopupInput.value.length;
    if (document.selection) {
      var sel = tagPopupInput.createTextRange();
      sel.moveStart('character', len);
      sel.collapse();
      sel.select();
    } else if (
      typeof tagPopupInput.selectionStart == 'number' &&
      typeof tagPopupInput.selectionEnd == 'number'
    ) {
      tagPopupInput.selectionStart = tagPopupInput.selectionEnd = len;
    }
  }
});
