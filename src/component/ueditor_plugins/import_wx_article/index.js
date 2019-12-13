import '../../../com-deprecated/import-wx-article/css/index.css';
import ImportWxArticle from '../../../com-deprecated/import-wx-article';
import './index.less';
import './config';
window.UE.registerUI('zzh-import-wx-article', (editor, uiName) => {
  const btn = new UE.ui.Button({
    name: uiName,
    title: '导入微信文章',
    onclick: () => {
      if (!editor.zzhImportWxArticle) {
        editor.zzhImportWxArticle = new ImportWxArticle({
          onSubmit: content => {
            editor.execCommand('cleardoc');
            editor.execCommand('inserthtml', content);
          },
        });
      }
      editor.zzhImportWxArticle.show();
    },
  });
  return btn;
});
