const commonVars = require('../../../common/variables');
const blankImage = require('../../../../images/cash/account/edit/blank@3x.png');

module.exports = {
  // 空白图片
  blankImage,
  // 1：对公账户，2：个人账户
  type: parseInt(commonVars.params.type) || 1,
  // 是否是编辑页面
  isEdit: !!parseInt(commonVars.params.edit),
  // 上一步以前存储值
  cacheKey: 'cash-account-info',
};
