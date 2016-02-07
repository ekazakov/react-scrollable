//import React from 'react';
//import ReactDOM from 'react-dom';
//import App from './App';
//import 'babel-core/polyfill';
//import 'whatwg-fetch';
//import stubs from './stubs.json';

//console.log(stubs);
//ReactDOM.render(<App />, document.getElementById('root'));

const toJSON = (response) => response.json();
const log = console.log.bind(console);
fetch('stubs.json')
    .then(toJSON)
    .then(json => console.log(json))
    .catch(log)
;

function renderTable(root, options, data) {

}