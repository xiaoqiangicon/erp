import 'component/upload_config';
import '../../../old-com/upload/src/css/index.css';
import '../../../old-com/pagination/src/index.less';
import 'less/pagination.less';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';
import '../../../old-com/choose-image/src/css/index.css';
import ChooseImage from '../../../old-com/choose-image/src';
import 'component/choose_image_config';
window.UE.registerUI('zzh-choose-image-multi', (editor, uiName) => {
  const btn = new UE.ui.Button({
    name: uiName,
    title: '添加多张图片',
    cssRules: 'background-position: -726px -77px;',
    onclick() {
      if (!editor.zizaiUploadMultiSelect) {
        editor.zizaiUploadMultiSelect = new ChooseImage({
          multiSelect: !0,
          onSubmit: items => {
            const formatedImages = [];
            items.map(item => {
              formatedImages.push({
                src: item.src,
              });
            });
            editor.execCommand('insertimage', formatedImages);
          },
        });
      }
      editor.zizaiUploadMultiSelect.show();
    },
  });
  return btn;
});
