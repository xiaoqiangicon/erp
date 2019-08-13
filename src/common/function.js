import $ from 'jquery';
import 'jquery-confirm';
var data = {};
function cloneObject() {
  var obj = arguments[0];
  if (typeof obj === 'undefined' || obj === null) return {};
  if (typeof obj !== 'object') return obj;
  var attrs = arguments[1],
    attr;
  var enable_spec_attr = true;
  if (!(attrs instanceof Array)) {
    attrs = obj;
    enable_spec_attr = false;
  }
  var result = {};
  var key;
  for (key in attrs) {
    attr = enable_spec_attr ? attrs[key] : key;
    if (obj.hasOwnProperty(attr)) {
      if (obj[attr] instanceof Array) {
        result[attr] = cloneArray(obj[attr]);
      } else if (typeof obj[attr] === 'object') {
        result[attr] = cloneObject(obj[attr]);
      } else {
        result[attr] = obj[attr];
      }
    }
  }
  return result;
}
function cloneArray(array) {
  if (typeof array === 'undefined' || array === null) return [];
  if (!(array instanceof Array)) return [];
  var result = [];
  array.map(function(item, index) {
    typeof item !== 'object'
      ? (result[index] = item)
      : (result[index] = cloneObject(item));
  });
  return result;
}
data.cloneObject = cloneObject;
data.cloneArray = cloneArray;
data.alert = function(content, callback) {
  $.alert({
    title: false,
    content: content || '未知错误，请重新尝试',
    buttons: {
      ok: {
        text: '确定',
        action: function() {
          callback && callback();
        },
      },
    },
    theme: 'white',
  });
};
data.confirm = function(title, content, confirmCallback, cancelCallback) {
  if (typeof content == 'function') {
    cancelCallback = confirmCallback;
    confirmCallback = content;
    content = title;
    title = '';
  }
  $.confirm({
    title: !!title ? title : false,
    content: content,
    buttons: {
      confirm: {
        text: '确定',
        action: function() {
          !!confirmCallback && confirmCallback();
        },
      },
      cancel: {
        text: '取消',
        action: function() {
          !!cancelCallback && cancelCallback();
        },
      },
    },
  });
};
data.dialog = function(title, content) {
  !content && ((content = title), (title = '提示'));
  $.dialog({
    title: title,
    content: content,
  });
};
data.prompt = function(title, callback) {
  if (typeof title == 'function') {
    callback = title;
    title = !1;
  }
  $.confirm({
    title: title,
    content:
      '' +
      '<div class="form-group">' +
      '<label>请输入</label>' +
      '<input type="text" class="form-control">' +
      '</div>',
    buttons: {
      formSubmit: {
        text: '确定',
        action: function() {
          var value = this.$content.find('input').val();
          if (!value) {
            $.alert('输入不能为空，请重新输入');
            return false;
          }
          callback(value);
        },
      },
      cancel: {
        text: '取消',
      },
    },
    theme: 'white',
  });
};
data.addCloseWindowHint = function() {
  if (window.location.href.indexOf('localhost') > -1) return;
  window.onbeforeunload = function() {
    return '确定离开页面吗？';
  };
};
data.removeCloseWindowHint = function() {
  window.onbeforeunload = void 0;
};
export default data;
