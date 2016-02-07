import React, { Component } from 'react';
//import _ from 'lodash';
import cs from 'classnames';
import debounce from 'lodash.debounce';

export const BODY_SCROLL = "BODY_SCROLL";
export const CONTAINER_SCROLL = "CONTAINER_SCROLL";

const buffer = 10;
export class ReactTable extends Component {
    constructor(...args) {
        super(...args);

        const {rowHeight} = this.props;
        this.viewPortHeight = window.innerHeight;
        const viewPortSize = Math.ceil(this.viewPortHeight / rowHeight);
        const topIndex = 0;

        this.state = {viewPortSize, topIndex};
        this.state.bottomIndex = topIndex + this.calcFullViewPortSize() - 1;
        this.onScroll = debounce(() =>  this.updateScroll(this.props), 50);
        this.onResize = this.updateSize.bind(this);
        this.scrollTime = Date.now();
    }

    calcFullViewPortSize() {
        return this.state.viewPortSize + 2 * this.state.viewPortSize * buffer;
    }

    updateScroll(props) {
        const time =  Date.now();
        const _delay = (time - this.scrollTime) / 1000;

        this.scrollTime = time;
        //console.log(`delay beetwen scroll events: ${_delay}`);

        const {rowHeight, rows: {size}, infinityScroll} = props;

        if (!infinityScroll) return;

        const {topIndex, viewPortSize} = this.state;
        const stateUpdate = {};
        const updateState = () => {
            stateUpdate.bottomIndex = stateUpdate.topIndex + this.calcFullViewPortSize() - 1;
            this.setState(stateUpdate);
        };

        let scrollTop = this.calcScrollTop(props);
        const index = Math.floor(scrollTop / rowHeight);

        if (topIndex > size - this.calcFullViewPortSize()) {
            stateUpdate.topIndex = size - this.calcFullViewPortSize();

            updateState();
            return;
        }

        //console.log('index:', index, 'topIndex:', topIndex);
        if (index - topIndex > buffer * viewPortSize) {
            console.log('------- scroll down --------');
            stateUpdate.topIndex = index - buffer * viewPortSize / 2;

            if (stateUpdate.topIndex > size - this.calcFullViewPortSize()) {
                stateUpdate.topIndex = size - this.calcFullViewPortSize();
            }

            updateState();
            return;
        }

        //if (index - topIndex < buffer * viewPortSize) {
        //    console.log('------- scroll up --------');
        //    stateUpdate.topIndex = index - buffer * viewPortSize / 2;
        //
        //    if (stateUpdate.topIndex < 0) {
        //        stateUpdate.topIndex = 0;
        //    }
        //
        //    updateState();
        //}

    }

    updateSize() {
        const {rowHeight} = this.props;
        this.viewPortHeight = window.innerHeight;
        const viewPortSize = Math.ceil(this.viewPortHeight / rowHeight);
        console.log('Resize. viewPortSize:', viewPortSize);
        this.setState({viewPortSize});
    }

    calcScrollTop({scrollType, tableStartOffset}) {
        //noinspection JSUnresolvedVariable
        return scrollType === BODY_SCROLL ?
            window.scrollY - tableStartOffset: this.refs.container.scrollTop;
    }

    componentWillMount() {
        const {scrollType} = this.props;
        if (scrollType === BODY_SCROLL) {
            window.addEventListener('scroll', this.onScroll);
        }

        window.addEventListener('resize', this.onResize);
    }

    componentDidMount() {
        const {scrollType} = this.props;
        if (scrollType === CONTAINER_SCROLL) {
            this.refs.container.addEventListener('scroll', this.onScroll);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
        this.refs.container.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
    }
    
    shouldComponentUpdate() {
        return true;
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

        this.updateScroll(nextProps);
    }

    render() {
        const {className, scrollType} = this.props;
        const containerClassName = scrollType === CONTAINER_SCROLL ? 'containerScroll' : '';
        return <div className={containerClassName} ref="container">
            {this.renderTopPlaceholder()}
            <table className={cs(className, 'performance')}>
                <thead>
                    <tr>
                        {this.renderHeader()}
                    </tr>
                </thead>
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
        const {rows, infinityScroll} = this.props;
        const lines = [];

        if (infinityScroll) {
            const {topIndex, bottomIndex} = this.state;
            console.log(`%c >>>>> render ${topIndex} ${bottomIndex}`, "font-weight: bold; color: #000");

            for (let i = topIndex; i <= bottomIndex; i++) {
                lines.push(this.renderRow(rows.get(i)));
            }
        } else {
            for (let i = 0; i < rows.size; i++) {
                lines.push(this.renderRow(rows.get(i)));
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
        const {rowHeight, infinityScroll} = this.props;
        const {topIndex} = this.state;

        if (!infinityScroll) return null;

        const height = topIndex * rowHeight;
        return <div style={{height}}></div>;
    }


    renderBottomPlaceholder() {
        const {rowHeight, rows, infinityScroll} = this.props;
        const {bottomIndex} = this.state;

        if (!infinityScroll) return null;

        const height = (rows.size - bottomIndex - 1) * rowHeight;
        return <div style={{height}}></div>;
    }
}