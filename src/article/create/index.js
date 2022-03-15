import './preset';
import '../../component/nav';
import '../../css/common/index.css';

import Vue from 'vue';
import { Input, Button } from 'element-ui';
import 'jquery-confirm/dist/jquery-confirm.min.css';
import 'colors.css/css/colors.css';
import '@senntyou/shortcut.css';
import 'bootstrap-datetime-picker/css/bootstrap-datetimepicker.css';
import './index.css';

import 'component/ueditor_config';
import '../../../../pro-com/src/ueditor/ueditor.config';
import '../../../../pro-com/src/ueditor/ueditor.all';

import 'component/ueditor_plugins/xiu_mi';
import 'component/ueditor_plugins/import_wx_article';
import 'component/ueditor_plugins/video';
import 'component/ueditor_plugins/choose_image';
import 'component/ueditor_plugins/choose_image_multi';
import '../../com/ueditor-plugins/embed-music';
import '../../com/ueditor-plugins/embed-link';
import '../../com/ueditor-plugins/135editor';

Vue.component(Input.name, Input);
Vue.component(Button.name, Button);

import './old';
