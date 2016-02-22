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
        this._cacheRowsHeightsAndOffsets(this.props);

        this.state = {offsetTopIndex: 0};
    }

    _cacheRowsHeightsAndOffsets(props) {
        const {rowHeight} = props;
        if (isFunction(rowHeight)) {
            this.rows = Array.from(
                new Array(props.size), (_, index) => rowHeight(index));
            this.rowOffsets = calcRowOffsets(this.rows);
        }
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
        this._cacheRowsHeightsAndOffsets(nextProps);
        this._onScroll(nextProps);
    }

    render() {
        const containerStyle = {
            overflow: 'auto',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            WebkitOverflowScrolling: 'touch'
        };

        const {className, style = {}} = this.props;
        const finalStyle = {...containerStyle, ...style};

        const from = this._calcFromIndex();
        const to = this._calcToIndex();

        return <div className={className} style={finalStyle}>
            <div style={{height: this._topPlaceholderHeight(from)}} className="Scroller__TopPlaceholder"></div>
            {this._renderBody(from, to)}
            <div style={{height: this._bottomPlaceholderHeight(this.props.size, to)}} className="Scroller__BottomPlaceholder"></div>
        </div>;
    }

    _renderBody(from, to) {
        //const {size, buffer, viewPortHeight} = this.props;
        //const {offsetTopIndex} = this.state;
        //console.log({offsetTopIndex, viewPortHeight,  buffer, offsetTopIndex, size});
        //console.log({from, to, buffer});

        return Children.map(
            this.props.children,
            (child) => cloneElement(child, {from, to}, child.props.children));
    }

    _calcFromIndex() {
        const {buffer, viewPortHeight, rowHeight, scrollTop} = this.props;
        let from = this.state.offsetTopIndex;
        let diff = viewPortHeight * buffer;

        if (isFunction(rowHeight)) {
            while (from > 0 && diff > 0) {
                diff -= this.rows[--from];
            }

            return from;
        }

        return max(floor((scrollTop - diff)/rowHeight), 0);
    }

    _calcToIndex() {
        const {size, buffer, viewPortHeight, rowHeight, scrollTop} = this.props;
        const {offsetTopIndex} = this.state;

        let to = offsetTopIndex;
        let diff = viewPortHeight + viewPortHeight * buffer;

        if (isFunction(rowHeight)) {
            while (to < size && diff > 0) {
                diff -= this.rows[to++];
            }
            return to;
        }

        return min(ceil((scrollTop + diff)/rowHeight), size);
    }

    _getRowOffset(index) {
        const {rowHeight} = this.props;

        if (isFunction(rowHeight)) {
            return this.rowOffsets[index];
        }

        return rowHeight * (index + 1);
    }

    _topPlaceholderHeight(from) {
        return from == 0 ? 0 : this._getRowOffset(from - 1);
    }

    _bottomPlaceholderHeight(size, to) {
        return this._getRowOffset(size - 1) - this._getRowOffset(to - 1);
    }

    getRowOffset(index) {
        return index === 0 ? 0 : this._getRowOffset(index - 1);
    }
}
