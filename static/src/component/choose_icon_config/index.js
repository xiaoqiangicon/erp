import seeAjax from 'see-ajax';

if (location.hostname === 'localhost') {
  seeAjax.config('zzhChooseIconIcons', {
    url: [
      '/zzhadmin/materialPicsGetList/?type=3',
      '/static/src/component/choose_icon_config/data/icons_server.json',
      '/static/src/component/choose_icon_config/data/icons.json',
    ],
  });
}
