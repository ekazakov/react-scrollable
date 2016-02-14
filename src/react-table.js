//import 'babel-polyfill';
require('es6-object-assign').polyfill();
import React from 'react';
import ReactDOM from 'react-dom';
import {fromJS} from 'immutable';
import {Card} from './card';
import {OptionsPanel, BODY_SCROLL, CONTAINER_SCROLL} from './OptionsPanel';
import {ReactTable} from './ReactTable';
import './main.less';

const TableRow = (props) => {
    const {row} = props;

    return <tr>
        <td className="index">
            <div>{row.get('id')}</div>
        </td>
        <td className="name">
            <div>{row.get('name')}</div>
        </td>
        <td className="address">
            <div>{row.get('address')}</div>
        </td>
        <td className="phone">
            <div>{row.get('phone')}</div>
        </td>
        <td className="email">
            <div>{row.get('email')}</div>
        </td>
    </tr>;
};
const TableRowsSet = ({rows, from, to}) => {
    //console.log({from, to}, rows.slice(from, to).size);
    return <table>
        <tbody>
        {rows.slice(from, to).map(row => <TableRow key={row.get('id')} row={row}/>)}
        </tbody>
    </table>;
};

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

const rows = fromJS(stubs);
const tableStartOffset = calculateAbsoluteTopOffset(document.getElementById('root'));

const tableConfig = {
    //infinityScroll: panelConfig.infinityScroll,
    rowHeight: 40,
    scrollType: panelConfig.scrollType,
    rows: rows.slice(0, panelConfig.size),
    size: panelConfig.size,
    className: 'fixedTable',
    buffer: 1,
    tableStartOffset
};

ReactDOM.render(<OptionsPanel {...panelConfig}/>, document.getElementById('controls'));
renderTable(tableConfig);


function onScrollTypeChange(scrollType) {
    const className = scrollType === CONTAINER_SCROLL ?
        'containerScroll' : 'fixedTable';
    Object.assign(tableConfig, {scrollType, className});
    renderTable(tableConfig);
}

function onDataSizeChange(size) {
    Object.assign(tableConfig, {rows: rows.slice(0, size), size});
    renderTable(tableConfig);
}

function onInfinityScrollChange(infinityScroll) {
    Object.assign(tableConfig, {infinityScroll});
    renderTable(tableConfig);
}

function renderTable(options) {
    const {rows, ...restOptions} = options;
    ReactDOM.render(<ReactTable {...restOptions}>
        <TableRowsSet rows={rows}/>
    </ReactTable>, document.getElementById('root'));
}

