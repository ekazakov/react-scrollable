var path = require('path');
var webpack = require('webpack');


module.exports = {
    devtool: 'source-map',

    entry: {
        index: [
            'webpack-dev-server/client?http://0.0.0.0:3000',
            'webpack/hot/only-dev-server',
            './example/index.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: [
                    path.join(__dirname, '../src'),
                    path.join(__dirname, './'),
                ]
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            }
        ]
    },

    devServer: {
        host: '0.0.0.0',
        port: '3000',
        hot: true,
        contentBase: path.join(__dirname, '/static')
    }
};
