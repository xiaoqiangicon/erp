require('component/upload_config');

require('../../../old-com/upload/src/css/index.css');
require('../../../old-com/pagination/src/index.less');
require('less/pagination.less');
require('@fancyapps/fancybox/dist/jquery.fancybox.css');
require('@zzh/choose-image/dist/choose-image.css');
const ChooseImage = require('@zzh/choose-image');

require('component/choose_image_config');

// 单选图片
window.UE.registerUI('zzh-choose-image', (editor, uiName) => {
  // 创建一个button
  const btn = new UE.ui.Button({
    // 按钮的名字
    name: uiName,
    // 提示
    title: '添加图片',
    // 需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
    cssRules: 'background-position: -380px 0;',
    // 点击时执行的命令
    onclick: () => {
      if (!editor.zzhChooseImage) {
        editor.zzhChooseImage = new ChooseImage({
          multiSelect: !1,
          onSubmit: items => {
            const get_img = editor.selection.getRange().getClosedNode();
            if (typeof get_img !== 'undefined')
              $(get_img).attr({ src: items[0].src, _src: items[0].src });
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
