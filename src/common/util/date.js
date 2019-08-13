var util = {};
util.getNumberOfDate = function(dateString) {
  return parseInt(dateString.split('-').join(''));
};
util.isValidDate = function(dateString) {
  var dateArray = dateString.split('-');
  if (dateArray.length != 3) return !1;
  if (
    dateArray[0].length != 4 ||
    dateArray[1].length != 2 ||
    dateArray[2].length != 2
  )
    return !1;
  if (!new Date(dateString).getTime()) return !1;
  return !0;
};
export default util;
