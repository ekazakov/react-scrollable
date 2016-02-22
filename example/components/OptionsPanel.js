import React, { Component } from 'react';

function noop() {}

export class OptionsPanel extends Component {
    static defaultProps = {
        onChange: noop,
        options: {}
    };

    constructor(...args) {
        super(...args);
        this.state = {row: this.props.row};
    }

    onRowChange(value) {
        this.setState({row: parseInt(value, 10)});
    }

    onChange(prop, value) {
        const {onChange, options} = this.props;
        if (typeof value === 'string') {
            const tmpValue = parseInt(value, 10);
            if (tmpValue === tmpValue) {
                value = tmpValue;
            }
        }
        onChange({...options, [prop]: value});
    }

    render() {
        const {options: {
            isBodyScroll,
            size,
            minSize,
            maxSize,
            buffer,
            maxBuffer,
            minBuffer,
            unequalRowsHeight,
            row}} = this.props;

        return <div className="controlsPanel">
            <h4>Scroll type</h4>
            <div>
                <label>
                    <input type="radio"
                           name="type"
                           value={true}
                           checked={isBodyScroll}
                           onChange={(e) => this.onChange('isBodyScroll', true)} /> body
                </label>
            </div>
            <div>
                <label>
                    <input type="radio"
                           name="type"
                           value={false}
                           checked={!isBodyScroll}
                           onChange={(e) => this.onChange('isBodyScroll', false)}/> container
                </label>
            </div>
            <h4>Rows height</h4>
            <div style={{marginTop: 10}}>
                <label>
                    <input type="checkbox"
                           onChange={(e) => this.onChange('unequalRowsHeight', e.target.checked)}
                           checked={unequalRowsHeight}/> rows of different height
                </label>
            </div>

{/*            <div style={{marginTop: 10}}>
                <label>
                    <input type="checkbox"
                           onChange={this.onInfinityScrollChange.bind(this)}
                           checked={infinityScroll}/> infinity scroll
                </label>
            </div>*/}

            <h4>Data size</h4>
            <div>
                {minSize/1000}k
                <input type="range"
                       className="dataSizeRange"
                       min={minSize}
                       max={maxSize}
                       step="1000"
                       value={size}
                       onChange={(e) => this.onChange('size', e.target.value)}/>
                {maxSize/1000}k
            </div>

            <div style={{marginTop: 10}}>
                size: {size / 1000}k
            </div>

            <h4>Buffer size</h4>
            <div>
                {minBuffer}
                <input type="range"
                       className="dataSizeRange"
                       min={minBuffer}
                       max={maxBuffer}
                       step="1"
                       value={buffer}
                       onChange={(e) => this.onChange('buffer', e.target.value)}/>
                {maxBuffer}
            </div>

            <div style={{marginTop: 10}}>
                buffer: {buffer}
            </div>

            <h4>Scroll to row</h4>
            <div>
                <input type="text"
                       value={this.state.row}
                       onChange={(e) => this.onRowChange(e.target.value)}
                       onBlur={(e) => this.onChange('row', e.target.value)}/>
            </div>
        </div>;
    }


}
