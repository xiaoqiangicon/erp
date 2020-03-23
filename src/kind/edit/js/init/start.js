import $ from 'jquery';
import 'component/ueditor_config';
import '../../../../../pro-com/src/ueditor/ueditor.config';
import '../../../../../pro-com/src/ueditor/ueditor.all';
import 'component/ueditor_plugins/xiu_mi';
import 'component/ueditor_plugins/import_wx_article';
import 'component/ueditor_plugins/video';
import 'component/ueditor_plugins/choose_image';
import 'component/ueditor_plugins/choose_image_multi';
import data from '../data';
import mainTpl from '../tpl/main';
import coverItemTpl from '../tpl/main/detail/cover_item';
import payItemTpl from '../tpl/main/detail/pay_item';
import shareItemTpl from '../tpl/main/detail/share_item';
const $body = $('body');
export default _ => {
  $body.append(mainTpl(data.info));
  data.editor = window.UE.getEditor('editor', {
    initialFrameWidth: 700,
    initialFrameHeight: 400,
  });
  data.editor.ready(() => {
    data.info.intro && data.editor.setContent(data.info.intro);
  });
  if (data.info.covers && data.info.covers.length) {
    const $coverContainer = $('#cover-container');
    const $coverAdd = $('#cover-add');
    data.info.covers.forEach(image => {
      $coverContainer.append(
        coverItemTpl({
          image,
        })
      );
    });
    data.info.covers.length >= 3 && $coverAdd.addClass('hide');
  }
  if (data.info.headImg) {
    $('img[data-share-item-image=0]').attr('src', data.info.headImg);
  }
  if (data.info.payImg) {
    $('img[data-share-item-image=1]').attr('src', data.info.payImg);
  }
  if (data.info.payItems && data.info.payItems.length) {
    const $payContainer = $('#pay-container');
    data.info.payItems.forEach(item => {
      $payContainer.append(payItemTpl(item));
    });
  }
  if (data.info.shareIcon) {
    const $shareIconContainer = $('#share-icon-container');
    $shareIconContainer.append(
      shareItemTpl({
        image: data.info.shareIcon,
      })
    );
    $('#share-icon-add').addClass('hide');
  }
};
