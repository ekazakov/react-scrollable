import React, { Component, Children, cloneElement, PropTypes} from 'react';

import deepEqual from 'is-equal';
import reducer from './scrollerReducer';
import {BODY_SCROLL, CONTAINER_SCROLL} from './scrollConstants';

const {max, min, ceil} = Math;

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

        this.state = {offsetTopIndex: 0};
    }

    _onScroll(props) {
        const {rowHeight, size} = props;

        const stateUpdate = reducer({
            rowHeight,
            size,
            scrollTop: this._calcScrollTop(props),
            offsetTopIndex: this.state.offsetTopIndex
        });

        this.setState(stateUpdate);
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
        const {size, buffer, rowHeight, viewPortHeight} = this.props;
        const {offsetTopIndex} = this.state;
        const viewPortSize = ceil(viewPortHeight / rowHeight);
        const from = max(offsetTopIndex - viewPortSize * buffer, 0);
        const to = min(offsetTopIndex + viewPortSize + viewPortSize * buffer, size);
        console.log({offsetTopIndex, viewPortHeight, viewPortSize, buffer, offsetTopIndex, size});
        console.log({from, to});

        return Children.map(
            this.props.children,
            (child) => cloneElement(child, {from, to}, child.props.children));
    }

    _topPlaceholderHeight() {
        const {rowHeight, buffer, viewPortHeight} = this.props;
        const {offsetTopIndex} = this.state;
        const viewPortSize = ceil(viewPortHeight / rowHeight);
        const index = max(offsetTopIndex - viewPortSize * buffer, 0);
        return  (index) * rowHeight;
    }

    _bottomPlaceholderHeight() {
        const {rowHeight, size, buffer, viewPortHeight} = this.props;
        const {offsetTopIndex} = this.state;
        const viewPortSize = ceil(viewPortHeight / rowHeight);
        const index = min(offsetTopIndex + viewPortSize + viewPortSize * buffer, size);
        return (size - index) * rowHeight;
    }
}
