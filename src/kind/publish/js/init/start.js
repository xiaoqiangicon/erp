const $ = require('jquery');

require('component/ueditor_config');
require('@zzh/ueditor/src/ueditor.config');
require('@zzh/ueditor');

require('component/ueditor_plugins/xiu_mi');
require('component/ueditor_plugins/import_wx_article');
require('component/ueditor_plugins/video');
require('component/ueditor_plugins/choose_image');
require('component/ueditor_plugins/choose_image_multi');

const data = require('../data');
const mainTpl = require('../tpl/main');

const $body = $('body');

module.exports = _ => {
  $body.append(mainTpl(data.info));

  $('.type-content').on('input', () => {
    if ($('.type-content').val().length >= 300) {
      $('.type-content').val(
        $('.type-content')
          .val()
          .slice(0, 300)
      );
    }

    $('[data-text-count-show]').text($('.type-content').val().length);
  });
};
