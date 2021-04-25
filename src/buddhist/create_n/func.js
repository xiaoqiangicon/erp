import request from '../../utils/request';
import store from './store';
import { plainFuYanList, plainGuiGeList } from './data';

// 刷新分类列表
export function refreshCeremonyTypes(cb) {
  request('/zzhadmin/createCeremonyTypeList/').then(res => {
    store.state.ceremonyTypes = res.data || [];

    if (cb) cb();
  });
}

// 生成一个新的附言
export function generateFuYan(type = 1) {
  return JSON.parse(JSON.stringify(plainFuYanList[type - 1]));
}

// 生成一个新的规格
export function generateGuiGe(type = 1) {
  return JSON.parse(JSON.stringify(plainGuiGeList[type - 1]));
}
