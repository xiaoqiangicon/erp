import Video from './video';
window.UE.registerUI('zzh-video', (editor, uiName) => {
  const btn = new UE.ui.Button({
    name: uiName,
    title: '插入视频',
    cssRules: 'background-position: -320px -20px;',
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
