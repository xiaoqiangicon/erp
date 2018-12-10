const Video = require('./video');

// 视频插件
window.UE.registerUI('zzh-video', (editor, uiName) => {
  // 创建一个button
  const btn = new UE.ui.Button({
    // 按钮的名字
    name: uiName,
    // 提示
    title: '插入视频',
    // 需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
    cssRules: 'background-position: -320px -20px;',
    // 点击时执行的命令
    onclick: () => {
      if (!editor.zzhVideo) {
        editor.zzhVideo = new Video({
          onSubmit: code => {
            editor.execCommand('inserthtml', code);
          },
        });
      }
      editor.zzhVideo.show();
    },
  });
  return btn;
});
