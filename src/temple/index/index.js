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
import '../../component/promotion/less/index.less';
import '../../../old-com/upload/src/css/index.css';
import '../../../old-com/pagination/src/index.less';
import '../../less/pagination.less';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';
import '../../component/choose-image/css/index.css';
import '../../component/choose-icon/css/index.css';
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
});
