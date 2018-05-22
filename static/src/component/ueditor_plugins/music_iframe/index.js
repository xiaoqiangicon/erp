
require('antd/lib/style/index.css');

require('./index.less');

let title = document.getElementById('title');
let desc = document.getElementById('desc');

title.innerHTML = window.frameElement.getAttribute('music_name');
desc.innerHTML = window.frameElement.getAttribute('singername');
