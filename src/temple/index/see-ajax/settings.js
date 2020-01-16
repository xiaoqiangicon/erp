/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

const refactor = {
  data: 'temple',
  _data: {
    // 显示微站首页随喜
    showHomeSuiXi: 'show_website_suixi',
    // 显示高僧随喜
    showMonkSuiXi: 'show_website_abbot_suixi',
    // 显示场景随喜
    showSceneSuiXi: 'show_website_scenes_suixi',
    // 显示参与列表金额
    showJoinListPrice: 'isShowGongdeBoxPrice',
  },
};

seeAjax.config('settings', {
  url: ['/zzhadmin/getTemple/', '/settings1', '/settings'],
  refactor: [refactor, refactor],
});
