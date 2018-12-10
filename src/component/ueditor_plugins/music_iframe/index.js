
require('antd/lib/style/index.css');

require('./index.less');

let title = document.getElementById('title');
let desc = document.getElementById('desc');
let cover = document.getElementById('cover');

title.innerHTML = window.frameElement.getAttribute('music_name');
desc.innerHTML = window.frameElement.getAttribute('singername');

let albumUrl = window.frameElement.getAttribute('albumurl');
let coverSrc = `https://y.gtimg.cn/music/photo_new/T002R68x68M000${albumUrl.split("/")[3]}`;
cover.setAttribute('src', coverSrc);
