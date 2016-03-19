var webpack = require('webpack');
var path = require('path');

var BUILD_ENV = process.env.BUILD_ENV || 'development';

module.exports = {
  entry: './app/index.js',
  output: {
    path: 'build',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
      },
    ],
  },
  plugins: BUILD_ENV === 'production'
    ? [
        new webpack.optimize.UglifyJsPlugin({
          test: /\.js$/,
          sourceMap: false,
          compress: {
            screw_ie8: true,
          },
        }),
      ]
    : [],
};
