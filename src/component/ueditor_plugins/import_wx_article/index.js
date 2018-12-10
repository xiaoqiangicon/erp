
require('@zzh/import-wx-article/dist/import-wx-article.css');
const ImportWxArticle = require('@zzh/import-wx-article');

require('./index.less');
require('./config');

// 导入微信文章
window.UE.registerUI('zzh-import-wx-article',function(editor,uiName){

    //创建一个button
    let btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:'导入微信文章',
        //点击时执行的命令
        onclick:() => {
            if (!editor.zzhImportWxArticle) {
                editor.zzhImportWxArticle = new ImportWxArticle({
                    onSubmit: content => {
                        editor.execCommand( 'cleardoc');
                        editor.execCommand( 'inserthtml', content);
                    }
                });
            }
            editor.zzhImportWxArticle.show();
        }
    });
    return btn;
});