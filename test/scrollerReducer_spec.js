'use strict';

//noinspection JSUnresolvedFunction
var expect = require('expect');
//noinspection JSUnresolvedFunction
var reducer = require('../src/scrollerReducer');

//noinspection JSUnresolvedFunction
describe('Suite', function () {
    it('should calculate first visible row index', function () {
        const params = {
            rowHeight: 10,
            scrollTop: 50,
            offsetTopIndex: 0
        };

        const params2 = {...params, scrollTop: 49};

        expect(reducer(params)).toEqual({
            offsetTopIndex: 5, isDown: true, prevOffsetTopIndex: 0});
        expect(reducer(params2)).toEqual({
            offsetTopIndex: 4, isDown: true, prevOffsetTopIndex: 0}, 'rounding error');
    });
    
    it('should calculate scroll direction', function () {
        const params = {
            rowHeight: 10,
            scrollTop: 50,
            offsetTopIndex: 4
        };

        const params2 = {...params, offsetTopIndex: 6};
        expect(reducer(params)).toEqual({
            offsetTopIndex: 5,
            prevOffsetTopIndex: 4,
            isDown: true
        });
        expect(reducer(params2)).toEqual({
            offsetTopIndex: 5,
            prevOffsetTopIndex: 6,
            isDown: false
        }, 'scroll up');
    });



});