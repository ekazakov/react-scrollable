import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import debounce from 'lodash.debounce';
import {Scroller} from './Scroller';
import {BODY_SCROLL} from './scrollConstants';

export class ReactTable extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            //TODO don't call findDOMNode(this.refs.container) in constructor
            viewPortHeight: this._viewPortHeight(this.props),
            scrollTop: this._scrollTop(this.props)
        };
        this.onScroll = () => this._onScroll(this.props);
        this.onResize = () => this._onResize();
        this.debouncedUpdateSize = debounce(() => this._updateSize(this.props), 100);
    }

    _onScroll(props) {
        this.setState({scrollTop: this._scrollTop(props)});
    }

    _onResize() {
        this.debouncedUpdateSize();
    }

    _updateSize(props) {
        this.setState({viewPortHeight:  this._viewPortHeight(props)});
    }

    _scrollTop({scrollType}) {
        return scrollType === BODY_SCROLL ?
            window.pageYOffset: findDOMNode(this.refs.container).scrollTop;
    }

    _viewPortHeight({scrollType}) {
        return scrollType === BODY_SCROLL ? window.innerHeight : findDOMNode(this.refs.container).offsetHeight;
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
        findDOMNode(this.refs.container).removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.scrollType !== this.props.scrollType) {
            if (nextProps.scrollType === BODY_SCROLL) {
                findDOMNode(this.refs.container).removeEventListener('scroll', this.onScroll);
                window.addEventListener('scroll', this.onScroll);
            } else {
                window.removeEventListener('scroll', this.onScroll);
                findDOMNode(this.refs.container).addEventListener('scroll', this.onScroll);
            }
        }

        this.setState({
            viewPortHeight: this._viewPortHeight(nextProps),
            scrollTop: this._scrollTop(nextProps)
        });
    }

    render() {
        const finalProps = {...this.props, ...this.state};
        return <Scroller {...finalProps} ref="container">
            {this.props.children}
        </Scroller>;
    }
}
