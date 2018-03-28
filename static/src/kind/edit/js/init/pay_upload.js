
const $ = require('jquery');

require('component/upload_config');

require('@zzh/upload/dist/upload.css');
const upload = require('@zzh/upload');

module.exports = $el => {
    upload($el[0], (image, e, data) => {
        let $this = $(e.target);
        let $container = $this.parents('[data-pay-item-icon-container]');

        $container.find('[data-pay-item-image]').attr({src: image});
        $container.find('[data-pay-item-add]').addClass('hide');
        $container.find('[data-pay-item-icon]').removeClass('hide');
    });
};