import './preset';
import 'bootstrap/dist/css/bootstrap.css';
import '../../css/common/index.css';
import '../../css/base.css';

import 'jquery-confirm/dist/jquery-confirm.min.css';
import 'colors.css/css/colors.css';
import '@senntyou/shortcut.css';

import 'swiper/dist/css/swiper.css';

import './index.css';

import { urlParams } from '../../../../pro-com/src/utils';
import seeAjax from 'see-ajax';

if (urlParams.code) {
  seeAjax('fsLogin', { code: urlParams.code }, res => {
    if (res.success) {
      window.location.replace('/');
    } else {
      alert(res.msg);
    }
  });
}

import './ajax';
import './old';
import './view';
