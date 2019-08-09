require('component/upload_config');

require('../../../old-com/upload/src/css/index.css');
require('../../../old-com/pagination/src/index.less');
require('less/pagination.less');
require('@fancyapps/fancybox/dist/jquery.fancybox.css');
require('../../../old-com/choose-image/src/css/index.css');
const ChooseImage = require('../../../old-com/choose-image/src');

require('component/choose_image_config');

// 多选图片
window.UE.registerUI('zzh-choose-image-multi', (editor, uiName) => {
  // 创建一个button
  const btn = new UE.ui.Button({
    // 按钮的名字
    name: uiName,
    // 提示
    title: '添加多张图片',
    // 需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
    cssRules: 'background-position: -726px -77px;',
    // 点击时执行的命令
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
