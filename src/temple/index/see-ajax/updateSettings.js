/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

const req = {
  // 显示微站首页随喜
  showHomeSuiXi: 'showSuixi',
  // 显示高僧随喜
  showMonkSuiXi: 'showAbbotSuixi',
  // 显示场景随喜
  showSceneSuiXi: 'showScenesSuixi',
};

seeAjax.config('updateSettings', {
  method: ['post'],
  url: ['/zzhadmin/suixiShow/', '/updateSettings1', '/updateSettings'],
  req: [req, req],
});
