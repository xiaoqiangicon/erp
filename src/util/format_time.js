/**
 *
 * @param timeStr
 * @returns {string}
 */

export default timeStr => {
  const date = new Date(timeStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${y}-${m >= 10 ? m : `0${m}`}-${d >= 10 ? d : `0${d}`}`;
};
