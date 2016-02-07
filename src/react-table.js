import React from 'react';
import ReactDOM from 'react-dom';
import {Card} from './card';
import {OptionsPanel, BODY_SCROLL, CONTAINER_SCROLL} from './OptionsPanel';
import {ReactTable} from './ReactTable';
import './main.less';

const columns = ['#', 'name', 'address', 'phone', 'email'];

const panelConfig = {
    size: 1000,
    min: 1000,
    max: stubs.length,
    scrollType: BODY_SCROLL,
    onScrollTypeChange,
    onDataSizeChange
};

const rows = stubs.slice(0, 1000).map(stub => new Card(stub));

const tableConfig = {
    infinityScroll: true,
    rowHeight: 40,
    rows,
    size: 1000,
    className: 'fixedTable',
    columns
};

ReactDOM.render(<OptionsPanel {...panelConfig}/>, document.getElementById('controls'));
renderTable(tableConfig);


function onScrollTypeChange(type) {
    Object.assign(tableConfig, {
        containerClassName: type === BODY_SCROLL ? '' : 'containerScroll'
    });

    renderTable(tableConfig);
}

function onDataSizeChange(size) {
    Object.assign(tableConfig, {size});
    renderTable(tableConfig);
}

function renderTable(options) {
    ReactDOM.render(<ReactTable {...options}/>, document.getElementById('root'));
}
