import seeAjax from 'see-ajax';

if (location.hostname === 'localhost') {
  seeAjax.config('zzhChooseIconIcons', {
    url: [
      '/zzhadmin/materialPicsGetList/?type=3',
      '/src/component/choose_icon_config/data/icons_server.json',
      '/src/component/choose_icon_config/data/icons.json',
    ],
  });
}
