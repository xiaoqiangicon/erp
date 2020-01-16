import 'component/upload_config';
import '../../com-deprecated/upload/css/index.css';
import '../../com-deprecated/pagination/index.less';
import 'less/pagination.less';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';
import '../../com-deprecated/choose-image/css/index.css';
import ChooseImage from '../../com-deprecated/choose-image';
window.UE.registerUI('zzh-choose-image', (editor, uiName) => {
  const btn = new UE.ui.Button({
    name: uiName,
    title: '添加图片',
    cssRules: 'background-position: -380px 0;',
    onclick: () => {
      if (!editor.zzhChooseImage) {
        editor.zzhChooseImage = new ChooseImage({
          multiSelect: !1,
          onSubmit: items => {
            const get_img = editor.selection.getRange().getClosedNode();
            if (typeof get_img !== 'undefined')
              $(get_img).attr({
                src: items[0].src,
                _src: items[0].src,
              });
            else
              editor.execCommand('insertimage', {
                src: items[0].src,
              });
          },
        });
      }
      editor.zzhChooseImage.show();
    },
  });
  return btn;
});
