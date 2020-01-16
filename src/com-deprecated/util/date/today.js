var now = new Date(),
  year = now.getFullYear(),
  month = now.getMonth() + 1,
  day = now.getDate();
export default {
  year: year,
  month: month,
  week: now.getDay(),
  day: day,
  display:
    year +
    '-' +
    (month > 9 ? month : '0' + month) +
    '-' +
    (day > 9 ? day : '0' + day),
};
