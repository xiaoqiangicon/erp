export const fakeBatchList = [1, 2, 3, 4, 5, 6].map(id => ({
  receiverName: '王勇' + id,
  receiverPhone: '1381111999' + id,
  receiverAddress: '上海上海市青浦区华徐公路3029弄28号' + id,
  goodsName: '衣服' + id,
  goodsQuantity: 2 * id,
  remark: '备注' + id,
  foshiOrderIds: '123；44' + id,
}));

export function getCompanyName(companyCode) {
  if (companyCode === 'shunfeng' || companyCode === 'SF') return '顺丰速运';

  return '圆通速递';
}
