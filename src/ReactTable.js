import React, { Component } from 'react';
import _ from 'lodash';
import cs from 'classnames';

export const BODY_SCROLL = "BODY_SCROLL";
export const CONTAINER_SCROLL = "CONTAINER_SCROLL";

export class ReactTable extends Component {
    constructor(...args) {
        super(...args);

        const {rowHeight, rows} = this.props;
        const viewPortHeight = window.innerHeight;
        const viewPortSize = Math.ceil(viewPortHeight / rowHeight);
        this.scrollTop = 0;
        this.state = {
            viewPortHeight,
            viewPortSize,
            topIndex: 0,
            bottomIndex: viewPortSize * 3 - 1
        };
        this.onScroll = this.onScroll.bind(this);
    }

    onScroll() {
        const {rowHeight} = this.props;
        const {topIndex, bottomIndex, viewPortSize, viewPortHeight} = this.state;
        const stateUpdate = {};
        const scrollTop = window.scrollY;
        const isScrollDown = scrollTop - this.scrollTop > 0;

        this.scrollTop = scrollTop;

        //console.log(` scrollTop: ${scrollTop}, bottomIndex: ${bottomIndex},  bottomIndex * rowHeight: ${bottomIndex * rowHeight} `);

        if (isScrollDown) {
            if ((bottomIndex) * rowHeight <= scrollTop + viewPortHeight) {
                stateUpdate.topIndex = this.calcNextTopIndex(isScrollDown);
                stateUpdate.bottomIndex = this.calcNextBottomIndex(isScrollDown);
                console.log(`indexes: ${stateUpdate.topIndex}, ${stateUpdate.bottomIndex}`);
                this.setState(stateUpdate);
            }
        } else {
            if ((topIndex) * rowHeight >= scrollTop) {
                stateUpdate.topIndex = this.calcNextTopIndex(isScrollDown);
                stateUpdate.bottomIndex = this.calcNextBottomIndex(isScrollDown);
                console.log(`indexes: ${stateUpdate.topIndex}, ${stateUpdate.bottomIndex}`);
                this.setState(stateUpdate);
            }
        }
    }

    calcNextBottomIndex(increase) {
        const {rows: {length}} = this.props;
        const {bottomIndex, viewPortSize} = this.state;

        if (increase) {
            if (bottomIndex + viewPortSize >= length - 1) {
                return length - 1;
            }

            return bottomIndex + viewPortSize;
        } else {
            if (bottomIndex - viewPortSize <= viewPortSize * 3 - 1) {
                return viewPortSize * 3 - 1;
            }

            return bottomIndex - viewPortSize;
        }
    }

    calcNextTopIndex(increase) {
        const {rows: {length}} = this.props;
        const {topIndex, viewPortSize} = this.state;

        if (increase) {
            if (topIndex + viewPortSize >= length - viewPortSize * 3) {
                return length - viewPortSize * 3 - 1;
            }

            return topIndex + viewPortSize;
        } else {
            if (topIndex - viewPortSize <= 0) {
                return 0;
            }
            return topIndex - viewPortSize;
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll);
        //this.onScroll();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    render() {
        const {className, containerClassName = ''} = this.props;
        return <div className={containerClassName}>
            {this.renderTopPlaceholder()}
            <table className={cs(className, 'performance')}>
               {/* <thead>
                    <tr>
                        {this.renderHeader()}
                    </tr>
                </thead>*/}
                <tbody>
                    {this.renderBody()}
                </tbody>
            </table>
            {this.renderBottomPlaceholder()}
        </div>;
    }

    renderHeader() {
        const {columns} = this.props;

        return columns.map(
            (title, index) => <th key={index}>{title}</th>)
    }

    renderBody() {

        const {rows, size, infinityScroll} = this.props;
        const lines = [];

        if (infinityScroll) {
            const {topIndex, bottomIndex} = this.state;
            //console.log('render', topIndex, bottomIndex);

            for(let i = topIndex; i <= bottomIndex; i++) {
                lines.push(this.renderRow(rows[i]));
            }
        } else {
            for(let i = 0; i < size; i++) {
                lines.push(this.renderRow(rows[i]));
            }
        }


        return lines;
    }

    renderRow(row) {
        const {id, name, address, email, phone} = row;

        return <tr key={id}>
            <td className="index">
                <div>{id}</div>
            </td>
            <td className="name">
                <div>{name}</div>
            </td>
            <td className="address">
                <div>{address}</div>
            </td>
            <td className="phone">
                <div>{phone}</div>
            </td>
            <td className="email">
                <div>{email}</div>
            </td>
        </tr>;
    }

    renderTopPlaceholder() {
        const {rowHeight} = this.props;
        const {topIndex} = this.state;
        const height = topIndex * rowHeight;
        //console.log(`top placeholder: ${topIndex}, ${height}px`);
        return <div style={{height}}></div>;
    }


    renderBottomPlaceholder() {
        const {rowHeight, rows} = this.props;
        const {bottomIndex} = this.state;
        const height = (rows.length - bottomIndex - 1) * rowHeight;
        return <div style={{height}}></div>;
    }
}