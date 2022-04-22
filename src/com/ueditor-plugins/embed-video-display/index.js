import 'normalize.css/normalize.css';
import '../../../styles/base.less';
import './index.less';

const video = document.getElementById('video');
video.setAttribute('src', window.frameElement.getAttribute('d-video') || '');
