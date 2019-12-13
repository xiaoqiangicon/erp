import 'bootstrap/dist/css/bootstrap.css';
import '../../../component/pagination/index.less';
import $ from 'jquery';
import seeAjax from 'see-ajax';
import ChooseIcon from '..';
seeAjax.setEnv(1);
let chooseIcon1;
$('#btn-1').click(e => {
  if (!chooseIcon1) {
    chooseIcon1 = new ChooseIcon({
      onSubmit: items => {
        console.log('btn-1: ');
        console.log(items);
      },
    });
  }
  chooseIcon1.show();
});
let chooseIcon2;
$('#btn-2').click(e => {
  if (!chooseIcon2) {
    chooseIcon2 = new ChooseIcon({
      multiSelect: !1,
      onSubmit: items => {
        console.log('btn-2: ');
        console.log(items);
      },
    });
  }
  chooseIcon2.show();
});
