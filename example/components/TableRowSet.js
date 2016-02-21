import React from 'react';
import {TableRow} from './TableRow';
export class TableRowsSet extends React.Component {
    render() {
        const {rows, from, to} = this.props;
        return <table>
            <tbody>
            {rows.slice(from, to).map(row => <TableRow key={row.get('id')} row={row}/>)}
            </tbody>
        </table>;
    }
}