const path = require('path');

var mode = process.env.NODE_ENV || 'development';
module.exports = {
    devtool: (mode === 'development') ? 'inline-source-map' : false,
    mode: mode,
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};