require('es6-object-assign').polyfill();
import React from 'react';
import ReactDOM from 'react-dom';
import {fromJS} from 'immutable';
import {App} from './components/App';

const rows = fromJS(stubs);

ReactDOM.render(<App rows={rows}/>, document.getElementById('root'));
