var data = {
  params: (function () {
    var params = {};
    !!location.search && location.search.slice(1).split("&").map(function (item) {
      params[item.split("=")[0]] = item.split("=")[1];
    });
    return params;
  })(),
  today: (function () {
    var currentDateObj = new Date(), year = currentDateObj.getFullYear(), month = currentDateObj.getMonth() + 1, day = currentDateObj.getDate();
    return {
      year: year,
      month: month,
      weekDay: currentDateObj.getDay(),
      day: day,
      display: "" + year + "-" + (("" + month).length > 1 ? "" + month : "0" + month) + "-" + (("" + day).length > 1 ? "" + day : "0" + day)
    };
  })(),
  cookies: (function () {
    var cookieString = window.document.cookie, cookieArray = cookieString.split(";"), cookies = {};
    cookieArray.map(function (item) {
      var itemArray = item.split("=");
      cookies[itemArray[0].trim()] = !!itemArray[1] ? itemArray[1].trim() : "";
    });
    return cookies;
  })()
};
export default data;
