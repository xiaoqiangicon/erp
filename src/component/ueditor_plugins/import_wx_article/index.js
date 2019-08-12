import "../../../../old-com/import-wx-article/src/css/index.css";
import ImportWxArticle from "../../../../old-com/import-wx-article/src";
import "./index.less";
import "./config";
window.UE.registerUI("zzh-import-wx-article", (editor, uiName) => {
  const btn = new UE.ui.Button({
    name: uiName,
    title: "导入微信文章",
    onclick: () => {
      if (!editor.zzhImportWxArticle) {
        editor.zzhImportWxArticle = new ImportWxArticle({
          onSubmit: content => {
            editor.execCommand("cleardoc");
            editor.execCommand("inserthtml", content);
          }
        });
      }
      editor.zzhImportWxArticle.show();
    }
  });
  return btn;
});
