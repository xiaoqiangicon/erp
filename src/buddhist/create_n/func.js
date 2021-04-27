import request from '../../utils/request';
import StoreImage from '../../com-deprecated/store-image';
import * as zzhHandling from '../../../../pro-com/src/handling';
import purifyATarget from '../../util/purify_a_target';
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

let tipBeforeClose = true;
window.addEventListener('beforeunload', function(e) {
  // 本地调试，禁用这个功能
  if (window.location.hostname.indexOf('localhost') > -1) return;

  if (tipBeforeClose) {
    const confirmationMessage = '你确定离开吗?（未保存的修改将不生效）';
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }
});
export function disableTipBeforeClose() {
  tipBeforeClose = false;
}
export function enableTipBeforeClose() {
  tipBeforeClose = true;
}

// 转存图片
export function tranStoreImages(val, cb) {
  const list = Array.isArray(val) ? val : [val];
  const result = [];

  let index = 0;
  function startStoreImages() {
    new StoreImage(
      list[index],
      function(handledContent) {
        result.push(purifyATarget(handledContent));

        // 已经传完了
        if (index >= list.length - 1) {
          cb(Array.isArray(val) ? result : result[0]);
        }
        // 传下一个
        else {
          index += 1;
          startStoreImages();
        }
      },
      function(uploaded, total) {
        zzhHandling.setText('上传 ' + uploaded + '/' + total);
      }
    );
  }

  startStoreImages();
}
