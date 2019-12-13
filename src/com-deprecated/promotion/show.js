import $ from 'jquery';
import Clipboard from 'clipboard';
import '../../../pro-com/src/libs-es5/jquery-qrcode';
import logger from './util/logger';
import data from './data';
import tpl from './tpl';
let $body = $('body');
export default function(option, onClose) {
  if (!option.link) {
    logger.throwError('option.link can not be empty.');
  }
  !option.title && (option.title = '推广');
  data.onClose = onClose;
  data.link = option.link;
  data.option = option;
  var $popup = $(tpl(option));
  $body.append($popup);
  $('#zzh-promotion-qrcode-container').qrcode({
    width: data.sizes[0],
    height: data.sizes[0],
    text: option.link,
  });
  new Clipboard($popup.find('[data-clipboard-target]')[0]);
}
