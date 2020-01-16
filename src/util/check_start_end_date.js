import getDateNumber from './get_date_number';
export default (startDate, endDate) => {
  if (!startDate || !endDate) return !0;
  const startNum = parseInt(getDateNumber(startDate));
  const endNum = parseInt(getDateNumber(endDate));
  return endNum >= startNum;
};
