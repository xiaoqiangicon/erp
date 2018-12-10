import seeAjax from 'see-ajax';

const alert = require('util/alert');
const dialog = require('util/dialog');
const confirm = require('util/confirm');

if (location.hostname === 'localhost') {
  seeAjax.config('zzhChooseImageSavedImages', {
    url: [
      '/zzhadmin/materialPicsGetList/?type=1',
      '/src/component/choose_image_config/data/images_server.json',
      '/src/component/choose_image_config/data/images.json',
    ],
  });
  seeAjax.config('zzhChooseImageSystemImages', {
    url: [
      '/zzhadmin/materialPicsGetList/?type=2',
      '/src/component/choose_image_config/data/images_server.json',
      '/src/component/choose_image_config/data/images.json',
    ],
  });
}

window.zzhChooseImageExtractFail = dialog;
window.zzhChooseImageCanNotDelete = dialog;
window.zzhChooseImageSelectedEmpty = dialog;
window.zzhChooseImageDeleteSuccessful = alert;
window.zzhChooseImageDeleteConfirm = confirm;
