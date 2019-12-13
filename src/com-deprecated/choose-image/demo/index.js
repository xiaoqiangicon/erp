import 'bootstrap/dist/css/bootstrap.css';
import '../../../com-deprecated/pagination/index.less';
import '../../../../old-com/upload/src/css/index.css';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';
import $ from 'jquery';
import seeAjax from 'see-ajax';
import ChooseImage from '..';
window.zzhUploadImageUrl = '/';
window.zzhUploadImageHandle = res => {
  return 'https://pic.zizaihome.com/e2601442-32fe-11e8-91c9-00163e0c1e1c.jpg';
};
window.zzhChooseImageDeleteConfirm = (msg, cb) => {
  var ok = confirm(msg);
  ok && cb();
};
seeAjax.setEnv(1);
let chooseImage1;
$('#btn-1').click(e => {
  if (!chooseImage1) {
    chooseImage1 = new ChooseImage({
      onSubmit: items => {
        console.log('btn-1: ');
        console.log(items);
      },
    });
  }
  chooseImage1.show();
});
let chooseImage2;
$('#btn-2').click(e => {
  if (!chooseImage2) {
    chooseImage2 = new ChooseImage({
      multiSelect: !1,
      multiUpload: !1,
      showManage: !1,
      onSubmit: items => {
        console.log('btn-2: ');
        console.log(items);
      },
    });
  }
  chooseImage2.show();
});
