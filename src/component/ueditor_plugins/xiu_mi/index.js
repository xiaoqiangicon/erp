import './index.less';
window.UE.registerUI('zzh-xiumi-connect', (editor, uiName) => {
  const btn = new UE.ui.Button({
    name: uiName,
    title: '秀米',
    onclick: () => {
      const dialog = new UE.ui.Dialog({
        iframeUrl: '/zzhadmin/xiumihtml/',
        editor,
        name: 'xiumi-connect',
        title: '秀米图文消息助手',
        cssRules:
          `width: ${window.innerWidth - 60}px;` +
          `height: ${window.innerHeight - 60}px;`,
      });
      dialog.render();
      dialog.open();
    },
  });
  return btn;
});
