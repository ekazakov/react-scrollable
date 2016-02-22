import React from 'react';

export class TableRow extends React.Component {
    render() {
        const {row, fixedHeight} = this.props;

        let height;
        if (fixedHeight) {
            height = 40;
        } else {
            height = row.get('height');
        }

        return <tr style={{height}}>
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
    }
}