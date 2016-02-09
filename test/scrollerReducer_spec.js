'use strict';

//noinspection JSUnresolvedFunction
var expect = require('expect');
//noinspection JSUnresolvedFunction
var reducer = require('../src/scrollerReducer');

//noinspection JSUnresolvedFunction
describe('Suite', function () {
    //noinspection JSUnresolvedFunction
    it('Test 1', function () {
        const params = {};
        expect(reducer(params)).toBe(params);
    });

});