/**
 * 获取日期的数字表达
 *
 * 2018-01-01 -> 20180101
 *
 * @param date
 */
module.exports = date => {
    return date.slice(0, 4) + date.slice(5, 7) + date.slice(8, 10);
};