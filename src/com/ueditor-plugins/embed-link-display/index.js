import 'normalize.css/normalize.css';
import '../../../styles/base.less';
import './index.less';
import logo from '../../../../images/logo.png';

const actions = {
  '1': '参与',
  '2': '结缘',
  '3': '阅读',
  '4': '查看',
  '5': '修行',
  '6': '播放',
  '7': '加入',
  '8': '查看',
};

const title = document.getElementById('title');
const desc = document.getElementById('desc');
const cover = document.getElementById('cover');
const action = document.getElementById('action');
title.innerHTML = window.frameElement.getAttribute('d-title');
desc.innerHTML = window.frameElement.getAttribute('d-desc');
cover.setAttribute('src', window.frameElement.getAttribute('d-cover') || logo);
action.innerHTML =
  actions[window.frameElement.getAttribute('d-type')] || '查看';
