import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash-es/debounce';
import throttle from 'lodash-es/throttle';
import {Scroller} from './Scroller';

export default class Scrollable extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            viewPortHeight: this._viewPortHeight({isBodyScroll: true}),
            scrollTop: this._scrollTop({isBodyScroll: true})
        };
        this.onScroll = throttle(() => this._onScroll(this.props), 50);
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

    _scrollTop({isBodyScroll}) {
        return isBodyScroll ?
            window.pageYOffset: ReactDOM.findDOMNode(this.refs.container).scrollTop;
    }

    _viewPortHeight({isBodyScroll}) {
        return isBodyScroll ? window.innerHeight : ReactDOM.findDOMNode(this.refs.container).offsetHeight;
    }

    componentDidMount() {
        const {isBodyScroll} = this.props;
        if (isBodyScroll) {
            window.addEventListener('scroll', this.onScroll);
        } else {
            ReactDOM.findDOMNode(this.refs.container).addEventListener('scroll', this.onScroll);
            this.setState({
                viewPortHeight: this._viewPortHeight(this.props),
                scrollTop: this._scrollTop(this.props)
            });
        }

        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
        ReactDOM.findDOMNode(this.refs.container).removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isBodyScroll !== this.props.isBodyScroll) {
            if (nextProps.isBodyScroll) {
                ReactDOM.findDOMNode(this.refs.container).removeEventListener('scroll', this.onScroll);
                window.addEventListener('scroll', this.onScroll);

                this.setState({
                    viewPortHeight: this._viewPortHeight(nextProps),
                    scrollTop: this._scrollTop(nextProps)
                });

            } else {
                window.removeEventListener('scroll', this.onScroll);
                ReactDOM.findDOMNode(this.refs.container).addEventListener('scroll', this.onScroll);

                this.setState({scrollTop: 0}, ()=>
                    this.setState({viewPortHeight: this._viewPortHeight(nextProps)}));
            }
        }
    }

    render() {
        const finalProps = {...this.props, ...this.state};
        return <Scroller {...finalProps} ref="container">
            {this.props.children}
        </Scroller>;
    }

    scrollToRow(index, toCenter = false) {
        const offset = this.refs.container.getRowOffsetTop(index) -
            (toCenter ? this.state.viewPortHeight / 2 : 0);

        if (this.props.isBodyScroll) {
            window.scrollTo(0, offset);
        } else {
            ReactDOM.findDOMNode(this.refs.container).scrollTop = offset;
        }
    }
}
