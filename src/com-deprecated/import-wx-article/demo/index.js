import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import ImportWxArticle from '..';
window.importWxArticleEmptyHandle = msg => {
  console.log(msg);
};
window.importWxArticleGetArticle = (url, callback) => {
  callback('lalalalalal');
};
let importWxArticle1;
$('#btn-1').click(e => {
  if (!importWxArticle1) {
    importWxArticle1 = new ImportWxArticle({
      onCancel: () => {
        console.log('cancel: 1');
      },
      onSubmit: content => {
        console.log('submit: 1');
        console.log(content);
      },
    });
  }
  importWxArticle1.show();
});
let importWxArticle2;
$('#btn-2').click(e => {
  if (!importWxArticle2) {
    importWxArticle2 = new ImportWxArticle({
      onCancel: () => {
        console.log('cancel: 2');
      },
      onSubmit: content => {
        console.log('submit: 2');
        console.log(content);
      },
    });
  }
  importWxArticle2.show();
});
