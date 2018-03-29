
const seeAjax = require('see-ajax');

if (location.hostname === 'localhost') {
    seeAjax.config('zzhChooseImageSavedImages', {
        url: [
            '/zzhadmin/materialPicsGetList/?type=1',
            '/static/src/component/choose_image_config/data/images_server.json',
            '/static/src/component/choose_image_config/data/images.json'
        ]
    });
    seeAjax.config('zzhChooseImageSystemImages', {
        url: [
            '/zzhadmin/materialPicsGetList/?type=2',
            '/static/src/component/choose_image_config/data/images_server.json',
            '/static/src/component/choose_image_config/data/images.json'
        ]
    });
}