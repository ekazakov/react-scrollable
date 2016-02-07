var path = require('path');
var webpack = require('webpack');


module.exports = {
    devtool: 'source-map',
    //entry: [
    //    'webpack-dev-server/client?http://localhost:3000',
    //    'webpack/hot/only-dev-server',
    //    './src/index'
    //],
    entry: {
        'static-table': [
            'webpack-dev-server/client?http://0.0.0.0:3000',
            'webpack/hot/only-dev-server',
            './src/static-table'
        ],

        'react-table': [
            'webpack-dev-server/client?http://0.0.0.0:3000',
            'webpack/hot/only-dev-server',
            './src/react-table'
        ],
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
                loaders: ['react-hot', 'babel'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            }
            //{
            //    test: /\.json$/,
            //    loaders: ['json'],
            //    include: path.join(__dirname, 'src')
            //}
        ]
    },

    devServer: {
        host: '0.0.0.0',
        port: '3000',
        hot: true,
        contentBase: path.join(__dirname, '/static')
    }
};
