/**
 * 去除字符字段两边的空格
 * @param item
 */
export function formatInputItem(item) {
  const newItem = {};
  Object.keys(item).forEach(key => {
    const value = item[key];

    if (typeof value === 'string') newItem[key] = item[key].trim();
    else if (Array.isArray(value)) newItem[key] = [...value];
    else if (typeof value === 'object' && value) newItem[key] = { ...value };
    else newItem[key] = item[key];
  });
  return newItem;
}
