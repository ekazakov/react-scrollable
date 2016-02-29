var path = require('path');
var webpack = require('webpack');


var env = process.env.NODE_ENV;

var plugins = [
    new webpack.optimize.OccurenceOrderPlugin()
];

if (env === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false}
    }));
}


module.exports = {
    devtool: 'source-map',
    entry: {
        index: './src/Scrollable.js'
    },
    output: {
        path: path.join(__dirname, '/dist/'),
        library: 'react-scrollable',
        libraryTarget: 'umd'
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/,
                include: path.join(__dirname, '/src/')
            }
        ]
    }
};