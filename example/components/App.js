import React from 'react';
import {OptionsPanel} from './OptionsPanel';
import {TableRow} from './TableRow';
import {TableRowsSet} from './TableRowSet';
import {Scrollable} from '../../src/Scrollable';
import {BODY_SCROLL, CONTAINER_SCROLL} from '../../src/constants';
import '../main.less';
import {Card} from '../card';
import pick from 'lodash.pick';

export class App extends React.Component {
    constructor(...args) {
        super(...args);

        const {rows, tableStartOffset} = this.props;

        this.state = {
            options: {
                minSize: 1000,
                maxSize: rows.size,
                scrollType: BODY_SCROLL,
                size: 1000,
                buffer: 1,
                minBuffer: 1,
                maxBuffer: 10,
                unequalRowsHeight: false,
                rowHeight: 40,
                tableStartOffset,
                className: 'fixedTable'
            }
        };
    }

    _rowHeight(index) {
        return this.props.rows.get(index).get('height');
    }

    onOptionsChange(options) {
        //console.log(options);
        const {unequalRowsHeight, scrollType} = options;

        options.rowHeight = unequalRowsHeight ? this._rowHeight.bind(this) : 40;
        options.className =  scrollType == BODY_SCROLL ? '' : 'containerScroll';

        this.setState({options});
    }

    render() {
        const {rows} = this.props;
        const options = pick(this.state.options,
            ['scrollType', 'size', 'buffer', 'tableStartOffset', 'rowHeight', 'className']);
        return <div>
            <h1>React Table</h1>
            <div id="controls">
                <OptionsPanel options={this.state.options} onChange={this.onOptionsChange.bind(this)}/>
            </div>
            <div>
                <Scrollable {...options}>
                    <TableRowsSet rows={rows} fixedHeight={!this.state.options.unequalRowsHeight}/>
                </Scrollable>
            </div>
        </div>;
    }
}