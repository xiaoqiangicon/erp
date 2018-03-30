
require('./index.less');

window.UE.registerUI('dialog', (editor, uiName) => {
    let btn = new UE.ui.Button({
        name   : 'xiumi-connect',
        title  : '秀米',
        onclick: () => {
            let dialog = new UE.ui.Dialog({
                iframeUrl: '/zzhadmin/xiumihtml/',
                editor   : editor,
                name     : 'xiumi-connect',
                title    : "秀米图文消息助手",
                cssRules : "width: " + (window.innerWidth - 60) + "px;" + "height: " + (window.innerHeight - 60) + "px;",
            });
            dialog.render();
            dialog.open();
        }
    });

    return btn;
});