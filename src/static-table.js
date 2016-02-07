import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Card} from './card';
import {OptionsPanel, BODY_SCROLL, CONTAINER_SCROLL} from './OptionsPanel';
import './main.less';

const log = console.log.bind(console);

const columns = ['#', 'name', 'address', 'phone', 'email'];
const tableClass = 'fixedTable';
const size = 1000;
const options = {size, columns, createRow, tableClass};
const root = document.querySelector('#root');

const rows = stubs.map(stub => new Card(stub));

const panelConfig = {
    size: 1000,
    min: 1000,
    max: rows.length,
    scrollType: BODY_SCROLL,
    onScrollTypeChange,
    onDataSizeChange
};

ReactDOM.render(<OptionsPanel {...panelConfig}/>, document.getElementById('controls'));



renderTable(root, options, rows);

function onScrollTypeChange(type) {
    if (type === BODY_SCROLL) {
        root.className = "";
    } else {
        root.className = "containerScroll";
    }
}

function onDataSizeChange(size) {
    renderTable(root, Object.assign({}, options, {size}), rows);
}




function createRow (row, index) {
    const {id, name, address, email, phone, website, company} = row;
    return `
        <tr>
            <td class="index">
                <div>${id}</div>
            </td>
            <td class="name">
                <div>${name}</div>
            </td>
            <td class="address">
                <div>${address}</div>
            </td>
            <td class="phone">
                <div>${phone}</div>
            </td>
            <td class="email">
                <div>${email}</div>
            </td>
        </tr>
    `;
};



function renderTable(root, options, data) {
    const {size, columns, createRow, tableClass} = options;
    const tds = columns.map(title => `<th>${title}</th>`).join('');
    data = data.slice(0, size);
    const html = `
        <table class="${tableClass}">
            <thead>
                <tr>
                    ${tds}
                </tr>
            </thead>
            <tbody>${data.map(createRow).join('\n')}</tbody>
        </table>
    `;

    root.innerHTML = html;
}