'use strict';

import expect from 'expect';
import reducer from '../src/scrollerReducer';

describe('Suite', function () {
    it('should calculate first visible row index', function () {
        const params = {
            rowHeight: 10,
            scrollTop: 50,
            size: 24,
            offsetTopIndex: 0
        };

        const params2 = {...params, scrollTop: 49};

        expect(reducer(params)).toEqual({
            offsetTopIndex: 5, isDown: true});
        expect(reducer(params2)).toEqual({
            offsetTopIndex: 4, isDown: true}, 'rounding error');
    });
    
    it('should calculate scroll direction', function () {
        const params = {
            rowHeight: 10,
            scrollTop: 50,
            size: 24,
            offsetTopIndex: 4
        };

        const params2 = {...params, offsetTopIndex: 6};
        expect(reducer(params)).toEqual({
            offsetTopIndex: 5,
            isDown: true
        });
        expect(reducer(params2)).toEqual({
            offsetTopIndex: 5,
            isDown: false
        }, 'scroll up');
    });



});