import React from 'react';
import ReactDOM from 'react-dom';

import Main from './components/Main';

let root = document.getElementById('root');

ReactDOM.render(<Main/>, root);

require('./js/init/editor');
