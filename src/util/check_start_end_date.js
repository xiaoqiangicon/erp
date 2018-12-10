
let getDateNumber = require('./get_date_number');

/**
 * 检查结束日期是否大于等于开始日期
 * @param startDate 开始日期，格式 2018-01-01
 * @param endDate 结束日期，格式 2018-01-01
 */
module.exports = (startDate, endDate) => {
    if (!startDate || !endDate) return !0;

    let startNum = parseInt(getDateNumber(startDate));
    let endNum = parseInt(getDateNumber(endDate));

    return endNum >= startNum;
};