'use strict';

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin'); //清理文件夹

const clearPaths = ['docs/**.html'];
const outputPath = 'dist';

require('babel-polyfill');

let webpackConfig = {
  entry: {
    vendor: 'babel-polyfill'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, outputPath),
    //library: 'qview',
    libraryTarget: 'umd'
  },
  context: path.resolve(__dirname),
  resolve: {
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(
      clearPaths,
      {
        root: __dirname,    //根目录
        exclude:['dist/vendor.js', 'dist/vendor.js.map'],  //排除
        verbose: true,      //开启在控制台输出信息
        dry: false        　//启用删除文件
      }
    )
  ],
  module: {
    rules: []
  },
}

module.exports = webpackConfig;