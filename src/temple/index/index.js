import './preset';
import '../../component/nav';
import '../../css/common/index.css';

import 'jquery-confirm/dist/jquery-confirm.min.css';
import 'colors.css/css/colors.css';
import '@senntyou/shortcut.css';

import '../../lib/material-icons.css';
import '../../lib/bootstrap-material-datetimepicker.css';
import 'swiper/dist/css/swiper.css';
import 'toastr/build/toastr.css';
import '@zzh/promotion/dist/promotion.css';
import '@zzh/handling/dist/handling.css';
import '@zzh/upload/dist/upload.css';
import '@zzh/pagination/dist/pagination.css';
import '../../less/pagination.less';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';
import '@zzh/choose-image/dist/choose-image.css';
import '@zzh/choose-icon/dist/choose-icon.css';

import '../../css/base.css';
import './index.css';
import './styles/index.less';

import '../../component/upload_config';
import '../../component/choose_image_config';
import '../../component/choose_icon_config';

import $ from 'jquery';
import seeAjax from 'see-ajax';

import './old';
import './see-ajax';

// import './old-extra';

window.$ = $;

seeAjax('settings', {}, res => {
  if (!res.data) return;

  $('#show-home-sui-xi').prop({ checked: !!res.data.showHomeSuiXi });
  $('#show-monk-sui-xi').prop({ checked: !!res.data.showMonkSuiXi });
  $('#show-scene-sui-xi').prop({ checked: !!res.data.showSceneSuiXi });
});

require.ensure([], function(require) {
  require('./old-extra');
});
