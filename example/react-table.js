//import 'babel-polyfill';
require('es6-object-assign').polyfill();
import React from 'react';
import ReactDOM from 'react-dom';
import {fromJS} from 'immutable';
//import {Card} from './card';
//import {OptionsPanel, BODY_SCROLL, CONTAINER_SCROLL} from './components/OptionsPanel';
//import {ReactTable} from './../src/ReactTable';
//import './main.less';
import {App} from './components/App';

const tableStartOffset = calculateAbsoluteTopOffset(document.getElementById('root'));
const rows = fromJS(stubs);

function calculateAbsoluteTopOffset(elem) {
    let offsetTop = elem.offsetTop;

    while(elem.offsetParent != null) {
        elem = elem.offsetParent;
        offsetTop += elem.offsetTop;
    }

    return offsetTop;
}

ReactDOM.render(
    <App rows={rows} tableStartOffset={tableStartOffset}/>,
    document.getElementById('root'));
