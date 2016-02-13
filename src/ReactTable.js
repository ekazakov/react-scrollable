import React, { Component } from 'react';

import deepEqual from 'is-equal';
import cs from 'classnames';
import debounce from 'lodash.debounce';
import reducer from './scrollerReducer';

export const BODY_SCROLL = "BODY_SCROLL";
export const CONTAINER_SCROLL = "CONTAINER_SCROLL";

export class ReactTable extends Component {
    constructor(...args) {
        super(...args);

        const viewPortHeight = window.innerHeight;
        const offsetTopIndex = 0;

        this.state = {viewPortHeight, offsetTopIndex};
        this.onScroll = () => this._onScroll(this.props);
        this.onResize = () => this._onResize();

        this.debouncedUpdateSize = debounce(() => this.updateSize(), 100);
    }


    _onResize() {
        this.debouncedUpdateSize();
    }

    _onScroll(props) {
        const {rowHeight, infinityScroll, rows: {size}} = props;

        if (!infinityScroll) return;


        const stateUpdate = reducer({
            rowHeight,
            size,
            scrollTop: this._calcScrollTop(props),
            offsetTopIndex: this.state.offsetTopIndex
        });

        this.setState(stateUpdate);
    }

    _updateSize() {
        const {rowHeight, scrollType} = this.props;
        const viewPortHeight =  scrollType === BODY_SCROLL ? window.innerHeight : this.refs.container.offsetHeight;
        const viewPortSize = Math.ceil(viewPortHeight / rowHeight);
        console.log(`Resize: viewPortHeight: ${viewPortHeight} viewPortSize: ${viewPortSize}`);
        this.setState({viewPortHeight});
    }

    _calcScrollTop({scrollType, tableStartOffset}) {
        return scrollType === BODY_SCROLL ?
            Math.max(window.scrollY - tableStartOffset, 0): this.refs.container.scrollTop;
    }

    componentDidMount() {
        const {scrollType} = this.props;
        if (scrollType === BODY_SCROLL) {
            window.addEventListener('scroll', this.onScroll);
        } else {
            this.refs.container.addEventListener('scroll', this.onScroll);
        }

        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
        this.refs.container.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
    }

    componentWillUpdate() {
        this.debouncedUpdateSize = debounce(() => this._updateSize(), 100);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.scrollType !== this.props.scrollType) {
            if (nextProps.scrollType === BODY_SCROLL) {
                this.refs.container.removeEventListener('scroll', this.onScroll);
                window.addEventListener('scroll', this.onScroll);
            } else {
                window.removeEventListener('scroll', this.onScroll);
                this.refs.container.addEventListener('scroll', this.onScroll);
            }
        }

        this._onScroll(nextProps);
    }

    render() {
        const {className, scrollType} = this.props;
        const containerClassName = scrollType === CONTAINER_SCROLL ? 'containerScroll' : '';

        return <div className={containerClassName} ref="container">
            {this._renderTopPlaceholder()}
            <table className={cs(className, 'performance')}>
                <tbody>
                    {this._renderBody()}
                </tbody>
            </table>
            {this._renderBottomPlaceholder()}
        </div>;
    }

    _renderBody() {
        const {rows, infinityScroll} = this.props;
        const lines = [];

        if (infinityScroll) {
            const {max, min} = Math;
            const {buffer, rowHeight} = this.props;
            const {offsetTopIndex, viewPortHeight} = this.state;
            const viewPortSize = Math.ceil(viewPortHeight / rowHeight);

            const from = max(offsetTopIndex - viewPortSize * buffer, 0);
            const to = min(offsetTopIndex + viewPortSize + viewPortSize * buffer, rows.size);
            console.log(`%c >>>>> render ${offsetTopIndex} from: ${from}, to: ${to}`, "font-weight: bold; color: #000");

            for (let i = from; i < to; i++) {
                lines.push(this._renderRow(rows.get(i)));
            }
        } else {
            for (let i = 0; i < rows.size; i++) {
                lines.push(this._renderRow(rows.get(i)));
            }
        }

        return lines;
    }

    _renderRow(row) {
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

    _renderTopPlaceholder() {
        const {rowHeight, infinityScroll, buffer} = this.props;

        if (!infinityScroll) return null;

        const {offsetTopIndex, viewPortHeight} = this.state;
        const viewPortSize = Math.ceil(viewPortHeight / rowHeight);
        const index = Math.max(offsetTopIndex - viewPortSize * buffer, 0);
        const height = (index) * rowHeight;
        return <div style={{height}}></div>;
    }

    _renderBottomPlaceholder() {
        const {rowHeight, rows, infinityScroll, buffer} = this.props;

        if (!infinityScroll) return null;

        const {offsetTopIndex, viewPortHeight} = this.state;
        const viewPortSize = Math.ceil(viewPortHeight / rowHeight);
        const index = Math.min(offsetTopIndex + viewPortSize + viewPortSize * buffer, rows.size);
        const height = (rows.size - index) * rowHeight;
        return <div style={{height}}></div>;
    }
}
