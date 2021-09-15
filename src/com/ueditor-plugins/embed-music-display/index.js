import 'normalize.css/normalize.css';
import '../../../styles/base.less';
import './index.less';
import logo from '../../../../images/logo.png';

const title = document.getElementById('title');
const desc = document.getElementById('desc');
const cover = document.getElementById('cover');
title.innerHTML = window.frameElement.getAttribute('d-title');
desc.innerHTML = window.frameElement.getAttribute('d-desc');
cover.setAttribute('src', window.frameElement.getAttribute('d-cover') || logo);
