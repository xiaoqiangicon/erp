import { formatInputItem } from '../../utils/format';

export function checkItemValid(item) {
  const newItem = formatInputItem(item);

  if (!newItem.device_name) return '设备名称不能为空';
  if (!newItem.device_num) return '设备编号不能为空';

  return newItem;
}
