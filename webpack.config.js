var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


module.exports = {
  entry: [
    './src/index.js',
  ],
  target: 'node',
  output: {
    path: './dist',
    filename: 'index.js',
  },
  externals: nodeModules,
  resolve: {
    alias: {
      token: './config/token.js',
    },
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|dist)/,
        loader: 'babel',
        query: {
          presets: [
            'es2015',
            'stage-2',
          ],
        },
      },
    ],
  },
};
