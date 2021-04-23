import request from '../../utils/request';
import store from './store';

// 刷新分类列表
export function refreshCeremonyTypes(cb) {
  request('/zzhadmin/createCeremonyTypeList/').then(res => {
    store.state.ceremonyTypes = res.data || [];

    if (cb) cb();
  });
}
