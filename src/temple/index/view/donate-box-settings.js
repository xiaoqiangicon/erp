import $ from 'jquery';
import seeAjax from 'see-ajax';
import seeView from 'see-view';
import toastr from 'toastr';

seeView({
  events: {
    'click #donate-box-settings': 'onClickSettings',
    'click #donate-box-settings-popup': 'onClickSettingsPopup',
    'change [data-donate-box-setting]': 'onChangeSetting',
  },
  onClickSettings() {
    $('#donate-box-settings-popup').show();
  },
  onClickSettingsPopup(e) {
    if (e.target === e.currentTarget) {
      $('#donate-box-settings-popup').hide();
    }
  },
  onChangeSetting() {
    const showHomeSuiXi = $('#show-home-sui-xi').prop('checked') ? 1 : 0;
    const showMonkSuiXi = $('#show-monk-sui-xi').prop('checked') ? 1 : 0;
    const showSceneSuiXi = $('#show-scene-sui-xi').prop('checked') ? 1 : 0;

    seeAjax(
      'updateSettings',
      {
        showHomeSuiXi,
        showMonkSuiXi,
        showSceneSuiXi,
      },
      res => {
        if (!res.success) toastr.error('更新失败');
        else toastr.success('更新成功');
      }
    );
  },
});
