import React, { Component, Children, cloneElement, PropTypes} from 'react';

import {shallowEqual} from './shallowEqual';
const {max, min, ceil, floor} = Math;

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
        isBodyScroll: PropTypes.bool.isRequired,
        tableStartOffset: PropTypes.number,
        buffer: PropTypes.number
    };

    static defaultProps = {
        tableStartOffset: 0,
        buffer: 1,
        isBodyScroll: true
    };

    _cacheRowsHeightsAndOffsets(props) {
        const {rowHeight, size} = props;
        if (isFunction(rowHeight)) {
            this.rows = Array.from(
                new Array(size), (_, index) => rowHeight(index));
            this.rowOffsets = calcRowOffsets(this.rows);
        }
    }

    _calcTopIndex() {
        const {size, scrollTop, rowHeight} = this.props;
        let offsetTopIndex;

        if (isFunction(rowHeight)) {
            for (let [index, offset] of this.rowOffsets.entries()) {
                if (scrollTop < offset) {
                    offsetTopIndex = index;
                    break;
                }
            }

            return offsetTopIndex;
        }

        return min(floor(scrollTop / rowHeight), size);
    }

    _calcScrollTop({isBodyScroll, tableStartOffset, scrollTop}) {
        return isBodyScroll ? max(scrollTop - tableStartOffset, 0): scrollTop;
    }

    componentWillMount() {
        this._cacheRowsHeightsAndOffsets(this.props);
    }

    shouldComponentUpdate(nextProps) {
        return !shallowEqual(this.props, nextProps);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.size !== nextProps.size || this.props.rowHeight !== nextProps.rowHeight) {
            this._cacheRowsHeightsAndOffsets(nextProps);
        }
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
        const offsetTopIndex = this._calcTopIndex();

        const from = this._calcFromIndex(offsetTopIndex);
        const to = this._calcToIndex(offsetTopIndex);

        return <div className={className} style={finalStyle}>
            <div style={{height: this._topPlaceholderHeight(from)}} className="Scroller__TopPlaceholder"></div>
            {this._renderBody(from, to)}
            <div style={{height: this._bottomPlaceholderHeight(this.props.size, to)}} className="Scroller__BottomPlaceholder"></div>
        </div>;
    }

    _renderBody(from, to) {
        return Children.map(
            this.props.children,
            (child) => cloneElement(child, {from, to}, child.props.children));
    }

    _calcFromIndex(from) {
        const {buffer, viewPortHeight, rowHeight, scrollTop} = this.props;
        let diff = viewPortHeight * buffer;

        if (isFunction(rowHeight)) {
            while (from > 0 && diff > 0) {
                diff -= this.rows[--from];
            }

            return from;
        }

        return max(floor((scrollTop - diff)/rowHeight), 0);
    }

    _calcToIndex(to) {
        const {size, buffer, viewPortHeight, rowHeight, scrollTop} = this.props;
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

    getRowOffsetTop(index) {
        const offset = index === 0 ? 0 : this._getRowOffset(index - 1);

        if (this.props.isBodyScroll) {
            return offset + this.props.tableStartOffset;
        }

        return offset;
    }
}
