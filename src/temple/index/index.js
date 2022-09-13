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
import '../../com-deprecated/promotion/less/index.less';
import '../../com-deprecated/upload/css/index.css';
import '../../com-deprecated/pagination/index.less';
import '../../less/pagination.less';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';
import '../../com-deprecated/choose-image/css/index.css';
import '../../com-deprecated/choose-icon/css/index.css';
import '../../css/base.css';
import './index.css';
import './styles/index.less';
import '../../component/upload_config';
import $ from 'jquery';
import seeAjax from 'see-ajax';
import './old';
import './see-ajax';
import './old-extra';

seeAjax('settings', {}, res => {
  if (!res.data) return;
  $('#show-home-sui-xi').prop({
    checked: !!res.data.showHomeSuiXi,
  });
  $('#show-monk-sui-xi').prop({
    checked: !!res.data.showMonkSuiXi,
  });
  $('#show-scene-sui-xi').prop({
    checked: !!res.data.showSceneSuiXi,
  });
  $('#show-join-list-price').prop({
    checked: !!res.data.showJoinListPrice,
  });
  $('#show-join-list-cryptonym').prop({
    checked: !!res.data.isCryptonymShow,
  });
});
