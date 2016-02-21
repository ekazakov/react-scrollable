import React, { Component, Children, cloneElement, PropTypes} from 'react';

import deepEqual from 'is-equal';
import {BODY_SCROLL, CONTAINER_SCROLL} from './constants';
import result from 'lodash.result';
const {max, min, ceil, floor, abs} = Math;

const isFunction = fn => typeof fn === 'function';

const addToPrev = (result, height, index) => {
    index > 0 ? result.push(result[index - 1] + height) : result.push(height);
    return result;
};

const calcRowOffsets = (rows) =>
    rows.reduce(addToPrev, []);

export class Scroller extends Component {
    static propTypes = {
        rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
        size: PropTypes.number.isRequired,
        scrollTop: PropTypes.number.isRequired,
        viewPortHeight: PropTypes.number.isRequired,
        scrollType: PropTypes.oneOf([BODY_SCROLL, CONTAINER_SCROLL]),
        tableStartOffset: PropTypes.number,
        buffer: PropTypes.number
    };

    static defaultProps = {
        tableStartOffset: 0,
        buffer: 1,
        scrollType: BODY_SCROLL
    };

    constructor(...args) {
        super(...args);

        const {rowHeight} = this.props;
        if (isFunction(rowHeight)) {
            this.rows = Array.from(
                Array(this.props.size), (_, index) => rowHeight(index));

            this.rowOffsets = calcRowOffsets(this.rows);

        }

        this.state = {offsetTopIndex: 0};
    }

    _onScroll(props) {
        const {size, rowHeight} = props;

        const stateUpdate = this._update({
            rowHeight,
            size,
            scrollTop: this._calcScrollTop(props),
            offsetTopIndex: this.state.offsetTopIndex
        });

        this.setState(stateUpdate);
    }

    _update(params) {
        const {size, scrollTop, offsetTopIndex:topIndex} = params;
        const rowHeight = params.rowHeight;
        let offsetTopIndex;

        if (isFunction(rowHeight)) {
            for (let [index, offset] of this.rowOffsets.entries()) {
                if (scrollTop < offset) {
                    offsetTopIndex = index;
                    break;
                }
            }
        } else {
            //console.log(rowHeight);
            offsetTopIndex = min(floor(scrollTop / rowHeight), size)
        }

        const isDown = abs(topIndex) - abs(offsetTopIndex) < 0;

        return {
            offsetTopIndex,
            isDown
        };
    }

    _calcScrollTop({scrollType, tableStartOffset, scrollTop}) {
        return scrollType === BODY_SCROLL ? max(scrollTop - tableStartOffset, 0): scrollTop;
    }

    componentWillMount() {
        this._onScroll(this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps);
    }

    componentWillReceiveProps(nextProps) {
        this._onScroll(nextProps);
    }

    render() {
        const containerStyle = {overflow: 'auto'};
        const {className, style = {}} = this.props;
        const finalStyle = {...containerStyle, ...style};

        return <div className={className} style={finalStyle}>
            <div style={{height: this._topPlaceholderHeight()}} className="Scroller__TopPlaceholder"></div>
            {this._renderBody()}
            <div style={{height: this._bottomPlaceholderHeight()}} className="Scroller__BottomPlaceholder"></div>
        </div>;
    }

    _renderBody() {
        const {size, buffer, viewPortHeight, rowHeight} = this.props;
        const {offsetTopIndex} = this.state;
        let from, to;

        if (isFunction(rowHeight)) {
            from = this._calcFromIndex();
            to = this._calcToIndex();
        } else {
            const viewPortSize = ceil(viewPortHeight / rowHeight);
            from = max(offsetTopIndex - viewPortSize * buffer, 0);
            to = min(offsetTopIndex + viewPortSize + viewPortSize * buffer, size);
        }

        //console.log({offsetTopIndex, viewPortHeight,  buffer, offsetTopIndex, size});
        //console.log({from, to, buffer});

        return Children.map(
            this.props.children,
            (child) => cloneElement(child, {from, to}, child.props.children));
    }

    _calcFromIndex() {
        const {buffer, viewPortHeight} = this.props;
        let from = this.state.offsetTopIndex;
        let diff = viewPortHeight * buffer;

        while (from > 0 && diff > 0) {
            diff -= this.rows[--from];
        }

        return from;
    }

    _calcToIndex() {
        const {size, buffer, viewPortHeight} = this.props;
        const {offsetTopIndex} = this.state;
        let to = offsetTopIndex;
        let diff = viewPortHeight + viewPortHeight * buffer;

        while(to < size && diff > 0) {
            diff -= this.rows[to++];
        }

        //console.log({diff, to});
        return to;
    }

    _topPlaceholderHeight() {
        const {buffer, viewPortHeight, rowHeight, size} = this.props;
        const {offsetTopIndex} = this.state;

        if (isFunction(rowHeight)) {
            const from = this._calcFromIndex();
            return from == 0 ? 0 : this.rowOffsets[from - 1];
        }

        const viewPortSize = ceil(viewPortHeight / rowHeight);
        const index = max(offsetTopIndex - viewPortSize * buffer, 0);
        return  (index) * rowHeight;
    }

    _bottomPlaceholderHeight() {
        const { size, buffer, viewPortHeight, rowHeight} = this.props;
        const {offsetTopIndex} = this.state;

        if (isFunction(rowHeight)) {
            const to = this._calcToIndex();
            return this.rowOffsets[size - 1] - this.rowOffsets[to - 1];
        }

        const viewPortSize = ceil(viewPortHeight / rowHeight);
        const index = min(offsetTopIndex + viewPortSize + viewPortSize * buffer, size);
        return (size - index) * rowHeight;
    }
}
