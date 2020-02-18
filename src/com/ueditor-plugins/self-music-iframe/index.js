import 'normalize.css/normalize.css';
import '@senntyou/shortcut.css';
import 'colors.css/css/colors.css';
import '../../../styles/base.less';
import './index.less';

const title = document.getElementById('title');
const desc = document.getElementById('desc');
const cover = document.getElementById('cover');
title.innerHTML = window.frameElement.getAttribute('music_name');
desc.innerHTML = window.frameElement.getAttribute('singername');
cover.setAttribute('src', window.frameElement.getAttribute('albumurl'));
