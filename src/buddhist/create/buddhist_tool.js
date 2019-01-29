/**
 * Created by Linfe on 2017/3/8.
 */
define([], function() {
  function parseStringToHTML(text) {
    /*字符串转片段Dom*/
    var i,
      a = document.createElement('div'),
      b = document.createDocumentFragment();
    a.innerHTML = text;
    while ((i = a.firstChild)) b.appendChild(i);
    return b;
  }

  function deepCopy(obj) {
    // 深复制对象
    if (obj instanceof Array) {
      var n = [];
      for (var i = 0; i < obj.length; ++i) {
        n[i] = deepCopy(obj[i]);
      }
      return n;
    } else if (obj instanceof Object) {
      var n = {};
      for (var i in obj) {
        n[i] = deepCopy(obj[i]);
      }
      return n;
    } else {
      return obj;
    }
  }

  function getNowFormatDate() {
    var date = new Date();
    var seperator1 = '-';
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    var currentdate =
      date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }
  return {
    parseStringToHTML: parseStringToHTML,
    deepCopy: deepCopy,
    getNowFormatDate: getNowFormatDate,
  };
});
