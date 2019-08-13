import $ from 'jquery';
import _ from 'underscore';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
var $tagPopupInput = $('#tag-popup-input');
var tagPopupInput = document.getElementById('tag-popup-input');
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
  if (value.length > data.lastTagPopupInputLength) {
    if (lastTag.length == 4) {
      $tagPopupInput.val(value + ' ');
    } else if (lastTag.length > 4) {
      var lastTagArray = [],
        i,
        il;
      for (i = 0, il = lastTag.length; i < il; i += 4) {
        lastTagArray.push(lastTag.slice(i, i + 4));
      }
      tagsArray.pop();
      value = tagsArray.join(' ') + ' ' + lastTagArray.join(' ');
      tagsArray = value.split(' ');
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
  setTimeout(function() {
    moveCursorToEnd();
  }, 0);
}
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
