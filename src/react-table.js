//import 'babel-core/polyfill';
require('es6-object-assign').polyfill();
import React from 'react';
import ReactDOM from 'react-dom';
import {fromJS} from 'immutable';
import {Card} from './card';
import {OptionsPanel, BODY_SCROLL, CONTAINER_SCROLL} from './OptionsPanel';
import {ReactTable} from './ReactTable';
import './main.less';

function calculateAbsoluteTopOffset(elem) {
    let offsetTop = elem.offsetTop;

    while(elem.offsetParent != null) {
        elem = elem.offsetParent;
        offsetTop += elem.offsetTop;
    }

    return offsetTop;
}

const columns = ['#', 'name', 'address', 'phone', 'email'];

const panelConfig = {
    size: 8000,
    minSize: 1000,
    maxSize: stubs.length,
    scrollType: BODY_SCROLL,
    infinityScroll: true,
    onScrollTypeChange,
    onDataSizeChange,
    onInfinityScrollChange
};

const rows = fromJS(stubs.map(stub => new Card(stub)));
const tableStartOffset = calculateAbsoluteTopOffset(document.getElementById('root'));

const tableConfig = {
    infinityScroll: panelConfig.infinityScroll,
    rowHeight: 40,
    scrollType: panelConfig.scrollType,
    rows: rows.slice(0, panelConfig.size),
    className: 'fixedTable',
    columns,
    tableStartOffset
};

ReactDOM.render(<OptionsPanel {...panelConfig}/>, document.getElementById('controls'));
renderTable(tableConfig);


function onScrollTypeChange(scrollType) {
    Object.assign(tableConfig, {scrollType});
    renderTable(tableConfig);
}

function onDataSizeChange(size) {
    Object.assign(tableConfig, {rows: rows.slice(0, size)});
    renderTable(tableConfig);
}

function onInfinityScrollChange(infinityScroll) {
    Object.assign(tableConfig, {infinityScroll});
    renderTable(tableConfig);
}

function renderTable(options) {
    ReactDOM.render(<ReactTable {...options}/>, document.getElementById('root'));
}
