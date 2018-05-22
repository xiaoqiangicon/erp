import React from 'react';
import ReactDOM from 'react-dom';

import Main from './components/Main';

let root = document.getElementById('root');

// 本地环境，模拟测试
if (location.hostname.split('.')[0] === 'localhost') {
    root.style.height = '400px';
}

ReactDOM.render(<Main/>, root);

require('./js/init/editor');
