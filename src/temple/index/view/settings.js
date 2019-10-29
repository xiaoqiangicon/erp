import $ from 'jquery';
import seeAjax from 'see-ajax';
import seeView from 'see-view';
import toastr from 'toastr';

seeView({
  events: {
    'click #donate-box-settings': 'onClickDonateBoxSettings',
    'click #donate-box-settings-popup': 'onClickDonateBoxSettingsPopup',
    'change [data-setting]': 'onChangeSetting',
    'click #join-list-settings': 'onClickJoinListSettings',
    'click #join-list-settings-popup': 'onClickJoinListSettingsPopup',
  },
  onClickDonateBoxSettings() {
    $('#donate-box-settings-popup').show();
  },
  onClickDonateBoxSettingsPopup(e) {
    if (e.target === e.currentTarget) {
      $('#donate-box-settings-popup').hide();
    }
  },
  onChangeSetting() {
    const showHomeSuiXi = $('#show-home-sui-xi').prop('checked') ? 1 : 0;
    const showMonkSuiXi = $('#show-monk-sui-xi').prop('checked') ? 1 : 0;
    const showSceneSuiXi = $('#show-scene-sui-xi').prop('checked') ? 1 : 0;
    const showJoinListPrice = $('#show-join-list-price').prop('checked')
      ? 1
      : 0;

    seeAjax(
      'updateSettings',
      {
        showHomeSuiXi,
        showMonkSuiXi,
        showSceneSuiXi,
        showJoinListPrice,
      },
      res => {
        if (!res.success) toastr.error('更新失败');
        else toastr.success('更新成功');
      }
    );
  },
  onClickJoinListSettings() {
    $('#join-list-settings-popup').show();
  },
  onClickJoinListSettingsPopup(e) {
    if (e.target === e.currentTarget) {
      $('#join-list-settings-popup').hide();
    }
  },
});
