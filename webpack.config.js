var webpack = require('webpack');


module.exports = {
    entry: {
        'birthdate': './front/birthdate.js',
    },
    output: {
        path: './dist/js',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /birthdate\.js$/,
                loader: 'expose',
                query: 'birthdate',
            },
            {
                test: /store\.js$/,
                loader: 'expose',
                query: 'store',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: { presets: ['es2015'] },
            },
        ],
    },
}
