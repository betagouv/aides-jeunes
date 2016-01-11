var webpack = require('webpack');


module.exports = {
    entry: {
        'front': './front/app.js',
    },
    output: {
        path: './dist/js',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: { presets: ['es2015'] },
            },
        ],
    },
}
