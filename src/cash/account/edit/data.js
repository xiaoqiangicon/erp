import commonVars from '../../../common/variables';
import blankImage from '../../../../images/cash/account/edit/blank@3x.png';
export default {
  blankImage,
  type: parseInt(commonVars.params.type) || 1,
  isEdit: !!parseInt(commonVars.params.edit),
  cacheKey: 'cash-account-info',
};
