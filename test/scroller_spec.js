import sd from 'skin-deep';
import React from 'react';
import expect from 'expect';
import {fromJS} from 'immutable';

import {Card} from '../example/card';
import {Scroller} from '../src/Scroller';
import stubs from './stubs';

const {max, min, ceil} = Math;


function calcViewportSize({viewPortHeight, rowHeight}) {
    return ceil(viewPortHeight / rowHeight);
}

function rowsCount(options, cb) {
    const {buffer} = options;
    const viewportSize = calcViewportSize(options);
    return cb(viewportSize, buffer);
}

function totalHeight({size, rowHeight, tableStartOffset}) {
    return rowHeight * size + tableStartOffset;
}

const TableRow = (props) => {
    const {id, name, address, email, phone} = props;

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
};
const TableRowsSet = ({rows, from, to}) => {
    //console.log({from, to}, rows.slice(from, to).size);
    return <table>
        <tbody>
        {rows.slice(from, to).map(row => <TableRow key={row.id} {...row}/>)}
        </tbody>
    </table>;
};

describe('Scroller suite', function () {
    const rows = fromJS(stubs.map(stub => new Card(stub)));
    const scrollerOptions = Object.freeze({
        isBodyScroll: true,
        size: rows.size,
        rowHeight: 10,
        viewPortHeight: 134,
        scrollTop: 0,
        tableStartOffset: 0,
        buffer: 1
    });

    it(`should accept child component for content rendering`, function() {
        const scroller = sd.shallowRender(<Scroller {...scrollerOptions}>
            <TableRowsSet rows={rows}/>
        </Scroller>);

        const tableRowsSet = scroller.dive(['TableRowsSet']);
        expect(tableRowsSet).toExist();

        const trs = tableRowsSet.everySubTree('TableRow');
        expect(trs.length).toBe(27);
    });

    describe(`Rows of the same width`, function() {
        it(`should render only viewport and bottom buffer when scrolled to the top`, function () {
            const options = {...scrollerOptions, scrollTop: 0};

            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);
            const tableRows = scroller.dive(['TableRowsSet']).everySubTree('TableRow');

            expect(tableRows.length).toEqual(27); //ceil(134 * 2 / 10)
        });

        it(`should render only viewport and top buffer when scrolled to the bottom`, function () {
            const height = totalHeight(scrollerOptions) - scrollerOptions.viewPortHeight;
            const options = {...scrollerOptions, scrollTop: height};
            const count = rowsCount(options, (viewPortSize, buffer) => viewPortSize * (buffer + 1));

            const scroller = sd.shallowRender(<Scroller {...options}><TableRowsSet rows={rows}/></Scroller>);
            const tableRows = scroller.dive(['TableRowsSet']).everySubTree('TableRow');

            expect(tableRows.length).toEqual(27); //ceil(134 * 2 / 10)
        });

        it(`should render full buffer when document scrolled to center`, () => {
            const scroller = sd.shallowRender(<Scroller {...scrollerOptions}><TableRowsSet rows={rows}/></Scroller>);

            const options = {...scrollerOptions, scrollTop: 500};
            const count = 41;// ceil(134 * 3 / 10)

            scroller.reRender(<Scroller {...options}><TableRowsSet rows={rows}/></Scroller>);
            const tableRows = scroller.dive(['TableRowsSet']).everySubTree('TableRow');

            expect(tableRows.length).toEqual(count);
        });

        it(`should correctly render placeholders`, function () {
            const options = {...scrollerOptions, scrollTop: 300};
            const scroller = sd.shallowRender(<Scroller {...options}><TableRowsSet rows={rows}/></Scroller>);
            const tableRows = scroller.dive(['TableRowsSet']).everySubTree('TableRow');

            const topPlaceholder = scroller.subTree('.Scroller__TopPlaceholder');
            const bottomPlaceholder = scroller.subTree('.Scroller__BottomPlaceholder');

            expect(tableRows.length).toEqual(41);
            expect(topPlaceholder.props.style).toEqual({height: 160});
            expect(bottomPlaceholder.props.style).toEqual({height: 430});
        });

        it(`should return offset of the row by index`, function () {
            const scroller = sd.shallowRender(<Scroller {...scrollerOptions}>
                <TableRowsSet rows={rows}/>
            </Scroller>);

            expect(scroller.getMountedInstance().getRowOffsetTop(10)).toBe(100);
        });

        it(`should correctly render with offset from page top`, function () {
            const options = {...scrollerOptions, tableStartOffset: 1000, scrollTop: 1000};

            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);

            let topPlaceholder = scroller.subTree('.Scroller__TopPlaceholder');
            expect(topPlaceholder.props.style).toEqual({height: 0}, 'wrong top placeholder');

            scroller.reRender(<Scroller {...{...options, scrollTop: 1200}}>
                <TableRowsSet rows={rows}/>
            </Scroller>);

            topPlaceholder = scroller.subTree('.Scroller__TopPlaceholder');
            expect(topPlaceholder.props.style).toEqual({height: 60}, 'wrong top placeholder');
        });

        it(`should pass visible rows range to children`, function () {
            const options = {...scrollerOptions, scrollTop: 300};
            const scroller = sd.shallowRender(<Scroller {...options}><TableRowsSet rows={rows}/></Scroller>);
            const range = [30, 44];
            expect(scroller.dive(['TableRowsSet']).getMountedInstance().props.visibleRowsRange).toEqual(range);
        });
    });

    describe('Rows of the different width', function() {
        const rowHeight = (index) => rows.get(index).height;

        it(`should correctly calculate placeholders when scrolled to top`, function() {
            const options = {...scrollerOptions, rowHeight};
            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);

            const topPlaceholder = scroller.subTree('.Scroller__TopPlaceholder');
            const bottomPlaceholder = scroller.subTree('.Scroller__BottomPlaceholder');

            expect(topPlaceholder.props.style).toEqual({height: 0});
            expect(bottomPlaceholder.props.style).toEqual({height: 3141}, 'wrong bottom placeholder');
        });

        it(`should correctly calculate placeholders when scrolled to bottom`, function () {
            const options = {...scrollerOptions, scrollTop: 3284, rowHeight};
            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);

            const topPlaceholder = scroller.subTree('.Scroller__TopPlaceholder');
            const bottomPlaceholder = scroller.subTree('.Scroller__BottomPlaceholder');

            expect(topPlaceholder.props.style).toEqual({height: 3136}, 'wrong top placeholder');
            expect(bottomPlaceholder.props.style).toEqual({height: 0}, 'wrong bottom placeholder');
        });

        it(`should correctly calculate placeholders when scrolled to middle`, function() {
            const options = {...scrollerOptions, scrollTop: 500, rowHeight};
            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);

            const topPlaceholder = scroller.subTree('.Scroller__TopPlaceholder');
            const bottomPlaceholder = scroller.subTree('.Scroller__BottomPlaceholder');

            expect(topPlaceholder.props.style).toEqual({height: 334}, 'wrong top placeholder');
            expect(bottomPlaceholder.props.style).toEqual({height: 2630}, 'wrong bottom placeholder');
        });

        it(`should handle case when a little scrolled down from top`, function() {
            const options = {...scrollerOptions, scrollTop: 60, rowHeight};
            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);

            const tableRows = scroller.dive(['TableRowsSet']).everySubTree('TableRow');

            expect(tableRows.length).toEqual(13);
        });

        it(`should support rows with different height: scrolled to top`, function () {
            const options = {...scrollerOptions, rowHeight};
            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);
            const tableRows = scroller.dive(['TableRowsSet']).everySubTree('TableRow');

            expect(tableRows.length).toEqual(11);
        });

        it(`should support rows with different height: scrolled to bottom`, function () {
            const options = {...scrollerOptions, scrollTop: 3284, rowHeight};
            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);
            const tableRows = scroller.dive(['TableRowsSet']).everySubTree('TableRow');

            expect(tableRows.length).toEqual(9);
        });

        it(`should return offset of the row by index`, function () {
            const options = {...scrollerOptions, rowHeight};
            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);

            expect(scroller.getMountedInstance().getRowOffsetTop(10)).toBe(242);
        });
        
        it('should correctly resize when table rows count decreases', function () {
            const options = {...scrollerOptions, rowHeight, scrollTop: 6000};
            const scroller = sd.shallowRender(<Scroller {...options}>
                <TableRowsSet rows={rows}/>
            </Scroller>);

            const topPlaceholder = scroller.subTree('.Scroller__TopPlaceholder');
            const bottomPlaceholder = scroller.subTree('.Scroller__BottomPlaceholder');

            expect(topPlaceholder.props.style).toEqual({height: 3136}, 'wrong top placeholder')
            expect(bottomPlaceholder.props.style).toEqual({height: 0}, 'wrong bottom placeholder');
        });

        it(`should pass visible rows range to children`, function () {
            const options = {...scrollerOptions, scrollTop: 300, rowHeight};
            const scroller = sd.shallowRender(<Scroller {...options}><TableRowsSet rows={rows}/></Scroller>);
            const range = [11, 16];
            expect(scroller.dive(['TableRowsSet']).getMountedInstance().props.visibleRowsRange).toEqual(range);
        });
    });





    it.skip(`should add styles for container scroll`, function () {
        const options = {...scrollerOptions, isBodyScroll: false};
        const tree = sd.shallowRender(<Scroller {...options}>
            <TableRowsSet rows={rows}/>
        </Scroller>);

        expect(tree.props.style)
            .toExist()
            .toEqual({overflow: 'auto'});
    });

    it.skip('should allow provide custom styles', function () {
        const options = {...scrollerOptions, isBodyScroll: false, style: {color: 'red'}};
        const tree = sd.shallowRender(<Scroller {...options}>
            <TableRowsSet rows={rows}/>
        </Scroller>);

        expect(tree.props.style)
            .toExist()
            .toEqual({overflow: 'auto', color: 'red'});
    });

    it.skip(`should allow override container scroll styles with custom`, function() {
        const options = {
            ...scrollerOptions,
            isBodyScroll: false,
            style: {overflow: 'scroll'}
        };
        const tree = sd.shallowRender(<Scroller {...options}>
            <TableRowsSet rows={rows}/>
        </Scroller>);

        expect(tree.props.style)
            .toExist()
            .toEqual({overflow: 'scroll'});
    });

    it(`should allow to provide custom className`, function() {
        const options = {...scrollerOptions, className: 'foo'};
        const tree = sd.shallowRender(<Scroller {...options}>
            <TableRowsSet rows={rows}/>
        </Scroller>);

        expect(tree.props.className).toEqual('foo');
    });

    it(`should correctly rerender on viewport size change`, function() {
        const tree = sd.shallowRender(<Scroller {...scrollerOptions}>
            <TableRowsSet rows={rows}/>
        </Scroller>);
        const options = {...scrollerOptions, viewPortHeight: 80};

        tree.reRender(<Scroller {...options}>
            <TableRowsSet rows={rows}/>
        </Scroller>);

        const tableRows = tree.dive(['TableRowsSet']).everySubTree('TableRow');

        expect(tableRows.length).toEqual(16);
    });

    it(`should support rowHeight as function`, function () {
        const rowHeight = (index) => 10;
        const options = {...scrollerOptions, rowHeight};

        const scroller = sd.shallowRender(<Scroller {...options}>
            <TableRowsSet rows={rows}/>
        </Scroller>);
        const tableRows = scroller.dive(['TableRowsSet']).everySubTree('TableRow');

        expect(tableRows.length).toEqual(27);
    });

});
