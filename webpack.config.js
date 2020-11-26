const path = require('path');

module.exports = {
    entry: './dist/renderer.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};