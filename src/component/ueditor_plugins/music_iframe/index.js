require('antd/lib/style/index.css');

require('./index.less');

const title = document.getElementById('title');
const desc = document.getElementById('desc');
const cover = document.getElementById('cover');

title.innerHTML = window.frameElement.getAttribute('music_name');
desc.innerHTML = window.frameElement.getAttribute('singername');

const albumUrl = window.frameElement.getAttribute('albumurl');
const coverSrc = `https://y.gtimg.cn/music/photo_new/T002R68x68M000${
  albumUrl.split('/')[3]
}`;
cover.setAttribute('src', coverSrc);
