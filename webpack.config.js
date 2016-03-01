var path = require('path');
var webpack = require('webpack');


var env = process.env.NODE_ENV;

var plugins = [
    new webpack.optimize.OccurenceOrderPlugin()
];

if (env === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compressor: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true,
            warnings: true
        }
    }));
}

var reactExternal = {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
};

var reactDomExternal = {
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom'
};

module.exports = {
    entry: {
        index: './src/Scrollable.js'
    },
    output: {
        path: path.join(__dirname, '/dist/'),
        library: 'react-scrollable',
        libraryTarget: 'umd'
    },
    externals: {
        'react': reactExternal,
        'react-dom': reactDomExternal
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                //exclude: /node_modules/,
                //include: path.join(__dirname, '/src/')
            }
        ]
    }
};
