const intRegExp = /^\d+$/;
const digitRegExp = /^[\d.]+$/;
const intIdRegExp = /^\d{1,10}$/;
const longIdRegExp = /^\d{1,19}$/;

// 是否是整数
export function isInt(str) {
  str += '';

  return intRegExp.test(str);
}

// 是否是价格（最多两位小数）
export function isPrice(str) {
  str += '';

  if (!digitRegExp.test(str)) return false;

  const strArray = str.split('.');

  // 1.2.3
  if (strArray.length > 2) return false;
  // .23
  if (!strArray[0].length) return false;
  // 1. / 1.234
  if (
    strArray.length > 1 &&
    (!strArray[1] || !strArray[1].length || strArray[1].length > 2)
  )
    return false;

  // ok
  return true;
}

// 比例（0.01-1, 最多两位小数）
export function isRate(str) {
  str += '';

  if (!digitRegExp.test(str)) return false;

  const strArray = str.split('.');

  // 1.2.3
  if (strArray.length > 2) return false;
  // .23
  if (!strArray[0].length) return false;
  // 1. / 1.234
  if (
    strArray.length > 1 &&
    (!strArray[1] || !strArray[1].length || strArray[1].length > 2)
  )
    return false;

  // 1.23
  if (parseFloat(str) > 1) return false;

  // ok
  return true;
}

// 是否是Int型Id
export function isIntId(str) {
  str += '';

  return intIdRegExp.test(str);
}

// 是否是Long型Id
export function isLongId(str) {
  str += '';

  return longIdRegExp.test(str);
}
